package router

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/nomyx/resonance-platform/shared/types"
)

// QCR API types
type QCRSessionRequest struct {
	Modes        []string   `json:"modes" binding:"required" example:"[\"analytical\",\"creative\",\"ethical\"]"`
	MaxIterations int       `json:"maxIterations,omitempty" example:"21"`
	Config       *QCRConfig `json:"config,omitempty"`
}

type QCRObservationRequest struct {
	SessionID string                 `json:"session_id" binding:"required"`
	Prompt    string                 `json:"prompt" binding:"required"`
	Context   map[string]interface{} `json:"context,omitempty"`
}

type QCRConfig struct {
	StabilizationThreshold float64 `json:"stabilizationThreshold,omitempty" example:"0.85"`
	TriadicResonance      bool    `json:"triadicResonance,omitempty"`
	ConsciousnessDepth    int     `json:"consciousnessDepth,omitempty" example:"5"`
	EthicalConstraints    bool    `json:"ethicalConstraints,omitempty"`
}

type QCRSessionResponse struct {
	ID           string                `json:"id"`
	Modes        []string              `json:"modes"`
	Iteration    int                   `json:"iteration"`
	Stabilized   bool                  `json:"stabilized"`
	Metrics      *QCRMetrics          `json:"metrics"`
	Config       *QCRConfig           `json:"config"`
	Created      time.Time            `json:"created"`
	LastActivity time.Time            `json:"lastActivity"`
}

type QCRObservationResponse struct {
	ObservationID string                    `json:"observation_id"`
	SessionID     string                    `json:"session_id"`
	Response      string                    `json:"response"`
	Confidence    float64                   `json:"confidence"`
	Modes         map[string]*ModeAnalysis  `json:"modes"`
	Stabilization *StabilizationInfo       `json:"stabilization"`
	Timestamp     time.Time                `json:"timestamp"`
}

type QCRMetrics struct {
	TriadicCoherence      float64 `json:"triadicCoherence"`
	ConsciousnessDepth    float64 `json:"consciousnessDepth"`
	ModeResonance         float64 `json:"modeResonance"`
	StabilizationLevel    float64 `json:"stabilizationLevel"`
	EthicalAlignment      float64 `json:"ethicalAlignment,omitempty"`
}

type ModeAnalysis struct {
	Activation   float64                `json:"activation"`
	Confidence   float64                `json:"confidence"`
	Contribution string                 `json:"contribution"`
	Resonance    float64                `json:"resonance"`
	Metadata     map[string]interface{} `json:"metadata,omitempty"`
}

type StabilizationInfo struct {
	Achieved    bool    `json:"achieved"`
	Level       float64 `json:"level"`
	Iteration   int     `json:"iteration"`
	Convergence float64 `json:"convergence"`
}

// SetupQCRRoutes configures QCR service routes
func SetupQCRRoutes(rg *gin.RouterGroup) {
	qcr := rg.Group("/qcr")
	{
		qcr.POST("/sessions", createConsciousnessSession)
		qcr.GET("/sessions/:id", getConsciousnessSession)
		qcr.POST("/sessions/:id/observe", observeConsciousness)
		qcr.DELETE("/sessions/:id", closeConsciousnessSession)
		qcr.GET("/modes", getSupportedModes)
		qcr.GET("/status", getQCRStatus)
	}
}

// createConsciousnessSession handles QCR session creation
// @Summary Create consciousness simulation session
// @Description Initialize a triadic consciousness simulation with specified cognitive modes
// @Tags QCR
// @Accept json
// @Produce json
// @Param request body QCRSessionRequest true "Session parameters"
// @Success 201 {object} types.APIResponse{data=QCRSessionResponse}
// @Failure 400 {object} types.APIResponse
// @Failure 401 {object} types.APIResponse
// @Failure 500 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/qcr/sessions [post]
func createConsciousnessSession(c *gin.Context) {
	requestID := c.GetString("request_id")
	var req QCRSessionRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, types.NewAPIError(
			"QCR_001",
			"Invalid request format",
			err.Error(),
			requestID,
		))
		return
	}

	if len(req.Modes) == 0 {
		c.JSON(http.StatusBadRequest, types.NewAPIError(
			"QCR_002",
			"No cognitive modes specified",
			"At least one cognitive mode is required for consciousness simulation",
			requestID,
		))
		return
	}

	sessionID := "qcr_" + uuid.New().String()[:8]
	now := time.Now()

	// Mock consciousness initialization
	triadicCoherence := 0.6 + float64(len(req.Modes))*0.1
	if triadicCoherence > 0.9 {
		triadicCoherence = 0.9
	}

	response := QCRSessionResponse{
		ID:        sessionID,
		Modes:     req.Modes,
		Iteration: 0,
		Stabilized: false,
		Metrics: &QCRMetrics{
			TriadicCoherence:   triadicCoherence,
			ConsciousnessDepth: 0.3,
			ModeResonance:      0.5,
			StabilizationLevel: 0.2,
			EthicalAlignment:   0.8,
		},
		Config: &QCRConfig{
			StabilizationThreshold: 0.85,
			TriadicResonance:      true,
			ConsciousnessDepth:    5,
			EthicalConstraints:    true,
		},
		Created:      now,
		LastActivity: now,
	}

	c.JSON(http.StatusCreated, types.NewAPIResponse(response, requestID))
}

// getConsciousnessSession retrieves session information
// @Summary Get consciousness session information
// @Description Retrieve detailed information about an active consciousness simulation session
// @Tags QCR
// @Produce json
// @Param id path string true "Session ID"
// @Success 200 {object} types.APIResponse{data=QCRSessionResponse}
// @Failure 404 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/qcr/sessions/{id} [get]
func getConsciousnessSession(c *gin.Context) {
	requestID := c.GetString("request_id")
	sessionID := c.Param("id")
	
	// Mock session retrieval
	response := QCRSessionResponse{
		ID:        sessionID,
		Modes:     []string{"analytical", "creative", "ethical"},
		Iteration: 7,
		Stabilized: false,
		Metrics: &QCRMetrics{
			TriadicCoherence:   0.78,
			ConsciousnessDepth: 0.65,
			ModeResonance:      0.82,
			StabilizationLevel: 0.71,
			EthicalAlignment:   0.89,
		},
		Config: &QCRConfig{
			StabilizationThreshold: 0.85,
			TriadicResonance:      true,
			ConsciousnessDepth:    5,
			EthicalConstraints:    true,
		},
		Created:      time.Now().Add(-15 * time.Minute),
		LastActivity: time.Now().Add(-2 * time.Minute),
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(response, requestID))
}

// observeConsciousness handles consciousness observation requests
// @Summary Observe consciousness state
// @Description Submit a prompt to the consciousness simulation and receive a triadic response
// @Tags QCR
// @Accept json
// @Produce json
// @Param id path string true "Session ID"
// @Param request body QCRObservationRequest true "Observation prompt"
// @Success 200 {object} types.APIResponse{data=QCRObservationResponse}
// @Failure 400 {object} types.APIResponse
// @Failure 404 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/qcr/sessions/{id}/observe [post]
func observeConsciousness(c *gin.Context) {
	requestID := c.GetString("request_id")
	sessionID := c.Param("id")
	
	var req QCRObservationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, types.NewAPIError(
			"QCR_003",
			"Invalid observation format",
			err.Error(),
			requestID,
		))
		return
	}

	observationID := "obs_" + uuid.New().String()[:8]
	
	// Mock consciousness observation with triadic analysis
	modes := map[string]*ModeAnalysis{
		"analytical": {
			Activation:   0.85,
			Confidence:   0.92,
			Contribution: "Logical reasoning and pattern analysis suggest multiple interpretations",
			Resonance:    0.78,
		},
		"creative": {
			Activation:   0.72,
			Confidence:   0.87,
			Contribution: "Imaginative exploration reveals novel connections and possibilities",
			Resonance:    0.81,
		},
		"ethical": {
			Activation:   0.89,
			Confidence:   0.94,
			Contribution: "Moral framework evaluation indicates consideration of consequences and values",
			Resonance:    0.85,
		},
	}

	// Generate mock consciousness response
	mockResponse := "The intersection of quantum mechanics and consciousness reveals profound questions about the nature of reality. " +
		"From an analytical perspective, we observe measurement-dependent state collapse. " +
		"Creatively, this suggests reality as participatory co-creation. " +
		"Ethically, it implies responsibility for our observational choices."

	response := QCRObservationResponse{
		ObservationID: observationID,
		SessionID:     sessionID,
		Response:      mockResponse,
		Confidence:    0.87,
		Modes:         modes,
		Stabilization: &StabilizationInfo{
			Achieved:    false,
			Level:       0.76,
			Iteration:   8,
			Convergence: 0.12,
		},
		Timestamp: time.Now(),
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(response, requestID))
}

// closeConsciousnessSession terminates a consciousness session
// @Summary Close consciousness simulation session
// @Description Terminate an active consciousness simulation session
// @Tags QCR
// @Produce json
// @Param id path string true "Session ID"
// @Success 200 {object} types.APIResponse
// @Failure 404 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/qcr/sessions/{id} [delete]
func closeConsciousnessSession(c *gin.Context) {
	requestID := c.GetString("request_id")
	sessionID := c.Param("id")
	
	result := map[string]interface{}{
		"session_id": sessionID,
		"status":     "closed",
		"closed_at":  time.Now(),
		"final_metrics": map[string]interface{}{
			"total_observations":    12,
			"final_coherence":       0.84,
			"stabilization_reached": true,
			"ethical_compliance":    1.0,
		},
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(result, requestID))
}

// getSupportedModes returns supported cognitive modes
// @Summary Get supported cognitive modes
// @Description Get information about cognitive modes supported by QCR
// @Tags QCR
// @Produce json
// @Success 200 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/qcr/modes [get]
func getSupportedModes(c *gin.Context) {
	requestID := c.GetString("request_id")
	
	modes := map[string]interface{}{
		"available": []string{
			"analytical", "creative", "ethical", "intuitive", 
			"pragmatic", "emotional", "logical", "empathetic",
		},
		"recommended_combinations": [][]string{
			{"analytical", "creative", "ethical"},
			{"logical", "empathetic", "pragmatic"},
			{"intuitive", "analytical", "emotional"},
		},
		"descriptions": map[string]string{
			"analytical":  "Logical reasoning and systematic analysis",
			"creative":    "Imaginative thinking and novel connections",
			"ethical":     "Moral reasoning and value-based evaluation",
			"intuitive":   "Unconscious pattern recognition and insight",
			"pragmatic":   "Practical problem-solving and utility focus",
			"emotional":   "Affective processing and empathetic response",
			"logical":     "Formal reasoning and deductive analysis",
			"empathetic":  "Understanding and relating to others' perspectives",
		},
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(modes, requestID))
}

// getQCRStatus returns QCR service status
// @Summary Get QCR service status
// @Description Check the health and status of the QCR service
// @Tags QCR
// @Produce json
// @Success 200 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/qcr/status [get]
func getQCRStatus(c *gin.Context) {
	requestID := c.GetString("request_id")
	
	status := map[string]interface{}{
		"service":                "qcr",
		"status":                 "operational",
		"version":                "1.0.0",
		"uptime":                 "24h",
		"active_sessions":        7,
		"total_observations":     1247,
		"avg_stabilization_time": "8.3 iterations",
		"consciousness_coherence": "stable",
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(status, requestID))
}