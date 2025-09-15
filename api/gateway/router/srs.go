package router

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nomyx/resonance-platform/shared/types"
)

// SRS API types
type SRSRequest struct {
	Problem string            `json:"problem" binding:"required" example:"3sat"`
	Spec    map[string]interface{} `json:"spec" binding:"required"`
	Config  *SRSConfig        `json:"config,omitempty"`
}

type SRSConfig struct {
	Stop      *StopConfig      `json:"stop,omitempty"`
	Schedules *ScheduleConfig  `json:"schedules,omitempty"`
}

type StopConfig struct {
	IterMax     int     `json:"iterMax,omitempty" example:"5000"`
	PlateauEps  float64 `json:"plateauEps,omitempty" example:"1e-6"`
	TimeoutSec  int     `json:"timeoutSec,omitempty" example:"300"`
}

type ScheduleConfig struct {
	Eta0     float64 `json:"eta0,omitempty" example:"0.3"`
	EtaDecay float64 `json:"etaDecay,omitempty" example:"0.002"`
}

type SRSResponse struct {
	Feasible    bool                   `json:"feasible"`
	Certificate *Certificate          `json:"certificate,omitempty"`
	Metrics     *types.Metrics        `json:"metrics"`
	Telemetry   []types.TelemetryPoint `json:"telemetry,omitempty"`
	Timing      *TimingInfo           `json:"timing"`
}

type Certificate struct {
	Assignment []int `json:"assignment"`
}

type TimingInfo struct {
	StartTime   time.Time `json:"start_time"`
	EndTime     time.Time `json:"end_time"`
	Duration    float64   `json:"duration_ms"`
	Iterations  int       `json:"iterations"`
}

// SetupSRSRoutes configures SRS service routes
func SetupSRSRoutes(rg *gin.RouterGroup) {
	srs := rg.Group("/srs")
	{
		srs.POST("/solve", solveProblem)
		srs.GET("/problems", listSupportedProblems)
		srs.GET("/status", getSRSStatus)
	}
}

// solveProblem handles SRS problem solving requests
// @Summary Solve NP-complete problems using Symbolic Resonance
// @Description Submit a problem specification for solving using advanced symbolic resonance algorithms
// @Tags SRS
// @Accept json
// @Produce json
// @Param request body SRSRequest true "Problem specification"
// @Success 200 {object} types.APIResponse{data=SRSResponse}
// @Failure 400 {object} types.APIResponse
// @Failure 401 {object} types.APIResponse
// @Failure 500 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/srs/solve [post]
func solveProblem(c *gin.Context) {
	requestID := c.GetString("request_id")
	var req SRSRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, types.NewAPIError(
			"SRS_001",
			"Invalid request format",
			err.Error(),
			requestID,
		))
		return
	}

	// Simulate problem solving with stubbed response
	startTime := time.Now()
	
	// Mock solving delay
	time.Sleep(100 * time.Millisecond)
	
	endTime := time.Now()
	duration := float64(endTime.Sub(startTime).Nanoseconds()) / 1e6

	// Generate mock telemetry data
	telemetry := generateMockTelemetry(100)
	
	response := SRSResponse{
		Feasible: true,
		Certificate: &Certificate{
			Assignment: []int{1, 0, 1, 0}, // Mock solution
		},
		Metrics: &types.Metrics{
			Entropy:           0.034,
			PlateauDetected:   true,
			Dominance:         0.89,
			ResonanceStrength: 0.95,
			ConvergenceTime:   duration,
			Iterations:        85,
		},
		Telemetry: telemetry,
		Timing: &TimingInfo{
			StartTime:  startTime,
			EndTime:    endTime,
			Duration:   duration,
			Iterations: 85,
		},
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(response, requestID))
}

// listSupportedProblems returns list of supported problem types
// @Summary List supported problem types
// @Description Get a list of all problem types supported by the SRS service
// @Tags SRS
// @Produce json
// @Success 200 {object} types.APIResponse{data=[]string}
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/srs/problems [get]
func listSupportedProblems(c *gin.Context) {
	requestID := c.GetString("request_id")
	
	problems := []string{
		"3sat",
		"ksat", 
		"subsetsum",
		"hamiltonian_path",
		"vertex_cover",
		"clique",
		"exact_3_cover",
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(problems, requestID))
}

// getSRSStatus returns service status
// @Summary Get SRS service status
// @Description Check the health and status of the SRS service
// @Tags SRS
// @Produce json
// @Success 200 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/srs/status [get]
func getSRSStatus(c *gin.Context) {
	requestID := c.GetString("request_id")
	
	status := map[string]interface{}{
		"service":     "srs",
		"status":      "operational",
		"version":     "1.0.0",
		"uptime":      "24h",
		"queue_depth": 0,
		"avg_solve_time": "120ms",
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(status, requestID))
}

// generateMockTelemetry creates sample telemetry data
func generateMockTelemetry(steps int) []types.TelemetryPoint {
	telemetry := make([]types.TelemetryPoint, 0, steps/10)
	
	for i := 0; i < steps; i += 10 {
		entropy := 1.5 - float64(i)/float64(steps)*1.4
		lyapunov := 0.5 - float64(i)/float64(steps)*0.4
		satRate := float64(i) / float64(steps)
		
		telemetry = append(telemetry, types.TelemetryPoint{
			Step:              i,
			SymbolicEntropy:   entropy,
			LyapunovMetric:    lyapunov,
			SatisfactionRate:  satRate,
			ResonanceStrength: 0.8 + satRate*0.2,
			Timestamp:         time.Now().Add(-time.Duration(steps-i) * time.Millisecond),
		})
	}
	
	return telemetry
}