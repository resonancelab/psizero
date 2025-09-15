package router

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nomyx/resonance-platform/shared/types"
)

// HQE API types
type HQERequest struct {
	Primes []int   `json:"primes" binding:"required" example:"[2,3,5,7]"`
	Steps  int     `json:"steps" binding:"required" example:"256"`
	Lambda float64 `json:"lambda" binding:"required" example:"0.02"`
	Config *HQEConfig `json:"config,omitempty"`
}

type HQEConfig struct {
	TrackAmplitudes bool    `json:"trackAmplitudes,omitempty"`
	SamplingRate    int     `json:"samplingRate,omitempty" example:"10"`
	MaxMemory       int64   `json:"maxMemory,omitempty"`
}

type HQEResponse struct {
	Snapshots     []HQESnapshot   `json:"snapshots"`
	FinalMetrics  *types.Metrics `json:"finalMetrics"`
	Configuration *HQEConfig     `json:"configuration"`
	Timing        *TimingInfo    `json:"timing"`
}

type HQESnapshot struct {
	Step       int       `json:"step"`
	Amplitudes []float64 `json:"amplitudes"`
	Metrics    *HQEMetrics `json:"metrics"`
	Timestamp  time.Time `json:"timestamp"`
}

type HQEMetrics struct {
	Entropy               float64 `json:"entropy"`
	AmplitudeVariance     float64 `json:"amplitudeVariance"`
	QuantumCoherence      float64 `json:"quantumCoherence"`
	PrimeResonanceStrength float64 `json:"primeResonanceStrength"`
}

// SetupHQERoutes configures HQE service routes
func SetupHQERoutes(rg *gin.RouterGroup) {
	hqe := rg.Group("/hqe")
	{
		hqe.POST("/simulate", simulateHolographic)
		hqe.GET("/primes", getSupportedPrimes)
		hqe.GET("/status", getHQEStatus)
	}
}

// simulateHolographic handles HQE quantum simulation requests
// @Summary Simulate holographic quantum systems
// @Description Run holographic quantum simulations with prime eigenstate evolution
// @Tags HQE
// @Accept json
// @Produce json
// @Param request body HQERequest true "Simulation parameters"
// @Success 200 {object} types.APIResponse{data=HQEResponse}
// @Failure 400 {object} types.APIResponse
// @Failure 401 {object} types.APIResponse
// @Failure 500 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/hqe/simulate [post]
func simulateHolographic(c *gin.Context) {
	requestID := c.GetString("request_id")
	var req HQERequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, types.NewAPIError(
			"HQE_001",
			"Invalid request format",
			err.Error(),
			requestID,
		))
		return
	}

	// Validate primes
	if len(req.Primes) == 0 {
		c.JSON(http.StatusBadRequest, types.NewAPIError(
			"HQE_002",
			"At least one prime number required",
			"Primes array cannot be empty",
			requestID,
		))
		return
	}

	startTime := time.Now()
	
	// Simulate quantum evolution with mock data
	snapshots := generateHQESnapshots(req.Primes, req.Steps, req.Lambda)
	
	endTime := time.Now()
	duration := float64(endTime.Sub(startTime).Nanoseconds()) / 1e6

	response := HQEResponse{
		Snapshots: snapshots,
		FinalMetrics: &types.Metrics{
			Entropy:           snapshots[len(snapshots)-1].Metrics.Entropy,
			PlateauDetected:   true,
			ResonanceStrength: snapshots[len(snapshots)-1].Metrics.PrimeResonanceStrength,
			ConvergenceTime:   duration,
			Iterations:        req.Steps,
		},
		Configuration: &HQEConfig{
			TrackAmplitudes: true,
			SamplingRate:    10,
		},
		Timing: &TimingInfo{
			StartTime:  startTime,
			EndTime:    endTime,
			Duration:   duration,
			Iterations: req.Steps,
		},
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(response, requestID))
}

// getSupportedPrimes returns information about supported prime ranges
// @Summary Get supported prime number ranges
// @Description Get information about prime number ranges supported by HQE
// @Tags HQE
// @Produce json
// @Success 200 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/hqe/primes [get]
func getSupportedPrimes(c *gin.Context) {
	requestID := c.GetString("request_id")
	
	primeInfo := map[string]interface{}{
		"max_primes":     100,
		"recommended":    []int{2, 3, 5, 7, 11, 13, 17, 19, 23, 29},
		"max_value":      1000,
		"optimal_count":  "5-10 primes for best performance",
		"special_sets": map[string][]int{
			"fibonacci":  {2, 3, 5, 13, 89},
			"twin":       {3, 5, 11, 13, 17, 19},
			"mersenne":   {3, 7, 31, 127},
		},
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(primeInfo, requestID))
}

// getHQEStatus returns HQE service status
// @Summary Get HQE service status
// @Description Check the health and status of the HQE service
// @Tags HQE
// @Produce json
// @Success 200 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/hqe/status [get]
func getHQEStatus(c *gin.Context) {
	requestID := c.GetString("request_id")
	
	status := map[string]interface{}{
		"service":          "hqe",
		"status":           "operational",
		"version":          "1.0.0",
		"uptime":           "24h",
		"active_simulations": 0,
		"avg_simulation_time": "2.5s",
		"quantum_coherence": "stable",
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(status, requestID))
}

// generateHQESnapshots creates mock quantum simulation data
func generateHQESnapshots(primes []int, steps int, lambda float64) []HQESnapshot {
	snapshots := make([]HQESnapshot, 0, steps/10+1)
	numPrimes := len(primes)
	
	// Initial state - equal amplitudes
	initialAmplitudes := make([]float64, numPrimes)
	for i := range initialAmplitudes {
		initialAmplitudes[i] = 1.0 / float64(numPrimes)
	}
	
	// Add initial snapshot
	snapshots = append(snapshots, HQESnapshot{
		Step:       0,
		Amplitudes: initialAmplitudes,
		Metrics: &HQEMetrics{
			Entropy:               1.5,
			AmplitudeVariance:     0.1,
			QuantumCoherence:      1.0,
			PrimeResonanceStrength: 0.5,
		},
		Timestamp: time.Now(),
	})
	
	// Generate evolution snapshots
	for step := 10; step <= steps; step += 10 {
		progress := float64(step) / float64(steps)
		
		// Simulate amplitude evolution
		amplitudes := make([]float64, numPrimes)
		for i := range amplitudes {
			// Mock evolution with some randomness and convergence
			base := 0.3 + 0.4*progress
			variation := 0.2 * (1.0 - progress) * (float64(i%2)*2 - 1)
			amplitudes[i] = base + variation
		}
		
		// Normalize amplitudes
		sum := 0.0
		for _, amp := range amplitudes {
			sum += amp * amp
		}
		for i := range amplitudes {
			amplitudes[i] /= sum
		}
		
		entropy := 1.5 - progress*1.3 // Decreasing entropy
		coherence := 0.5 + progress*0.4 // Increasing coherence
		
		snapshots = append(snapshots, HQESnapshot{
			Step:       step,
			Amplitudes: amplitudes,
			Metrics: &HQEMetrics{
				Entropy:               entropy,
				AmplitudeVariance:     0.1 * (1.0 - progress),
				QuantumCoherence:      coherence,
				PrimeResonanceStrength: 0.5 + progress*0.4,
			},
			Timestamp: time.Now().Add(-time.Duration(steps-step) * time.Millisecond),
		})
	}
	
	return snapshots
}