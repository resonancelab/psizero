package router

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/nomyx/resonance-platform/shared/types"
)

// NLC API types
type NLCSessionRequest struct {
	Primes      []int      `json:"primes" binding:"required" example:"[2,3,5]"`
	GoldenPhase bool       `json:"goldenPhase,omitempty"`
	Config      *NLCConfig `json:"config,omitempty"`
}

type NLCMessageRequest struct {
	SessionID string `json:"session_id" binding:"required"`
	Content   string `json:"content" binding:"required"`
	Metadata  map[string]interface{} `json:"metadata,omitempty"`
}

type NLCConfig struct {
	ChannelStability float64 `json:"channelStability,omitempty" example:"0.85"`
	MaxMessageSize   int     `json:"maxMessageSize,omitempty" example:"1024"`
	EncryptionLevel  string  `json:"encryptionLevel,omitempty" example:"quantum"`
	SessionTimeout   int     `json:"sessionTimeout,omitempty" example:"3600"`
}

type NLCSessionResponse struct {
	ID       string             `json:"id"`
	Status   string             `json:"status"`
	Primes   []int             `json:"primes"`
	Metrics  *NLCMetrics       `json:"metrics"`
	Config   *NLCConfig        `json:"config"`
	Created  time.Time         `json:"created"`
	Expires  time.Time         `json:"expires"`
}

type NLCMessageResponse struct {
	MessageID   string                 `json:"message_id"`
	SessionID   string                 `json:"session_id"`
	Status      string                 `json:"status"`
	Transmitted bool                   `json:"transmitted"`
	Metrics     *NLCTransmissionMetrics `json:"metrics"`
	Timestamp   time.Time              `json:"timestamp"`
}

type NLCMetrics struct {
	Entropy           float64 `json:"entropy"`
	ResonanceStrength float64 `json:"resonanceStrength"`
	ChannelQuality    float64 `json:"channelQuality"`
	PhaseCoherence    float64 `json:"phaseCoherence"`
	NoiseLevel        float64 `json:"noiseLevel"`
}

type NLCTransmissionMetrics struct {
	TransmissionTime  float64 `json:"transmissionTime"`
	QuantumFidelity   float64 `json:"quantumFidelity"`
	ErrorCorrection   bool    `json:"errorCorrection"`
	SignalStrength    float64 `json:"signalStrength"`
	DecoherenceRate   float64 `json:"decoherenceRate"`
}

type NLCChannelInfo struct {
	Active     int      `json:"active"`
	Total      int      `json:"total"`
	AvgQuality float64  `json:"avgQuality"`
	Primes     []int    `json:"supportedPrimes"`
}

// SetupNLCRoutes configures NLC service routes
func SetupNLCRoutes(rg *gin.RouterGroup) {
	nlc := rg.Group("/nlc")
	{
		nlc.POST("/sessions", createSession)
		nlc.GET("/sessions/:id", getSession)
		nlc.DELETE("/sessions/:id", closeSession)
		nlc.POST("/sessions/:id/messages", sendMessage)
		nlc.GET("/sessions/:id/messages", getMessages)
		nlc.GET("/channels", getChannelInfo)
		nlc.GET("/status", getNLCStatus)
	}
}

// createSession handles NLC quantum session creation
// @Summary Create quantum communication session
// @Description Establish a new quantum communication channel using prime eigenstate resonance
// @Tags NLC
// @Accept json
// @Produce json
// @Param request body NLCSessionRequest true "Session parameters"
// @Success 201 {object} types.APIResponse{data=NLCSessionResponse}
// @Failure 400 {object} types.APIResponse
// @Failure 401 {object} types.APIResponse
// @Failure 500 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/nlc/sessions [post]
func createSession(c *gin.Context) {
	requestID := c.GetString("request_id")
	var req NLCSessionRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, types.NewAPIError(
			"NLC_001",
			"Invalid request format",
			err.Error(),
			requestID,
		))
		return
	}

	if len(req.Primes) == 0 {
		c.JSON(http.StatusBadRequest, types.NewAPIError(
			"NLC_002",
			"No primes provided",
			"At least one prime number is required for channel establishment",
			requestID,
		))
		return
	}

	sessionID := "nlc_" + uuid.New().String()[:8]
	now := time.Now()
	expiresAt := now.Add(time.Hour) // Default 1 hour session
	
	if req.Config != nil && req.Config.SessionTimeout > 0 {
		expiresAt = now.Add(time.Duration(req.Config.SessionTimeout) * time.Second)
	}

	// Mock quantum channel establishment
	channelQuality := 0.75 + (float64(len(req.Primes))/10.0)*0.2
	if channelQuality > 0.95 {
		channelQuality = 0.95
	}

	response := NLCSessionResponse{
		ID:     sessionID,
		Status: "syncing",
		Primes: req.Primes,
		Metrics: &NLCMetrics{
			Entropy:           0.23,
			ResonanceStrength: channelQuality,
			ChannelQuality:    channelQuality,
			PhaseCoherence:    0.88,
			NoiseLevel:        0.05,
		},
		Config: &NLCConfig{
			ChannelStability: 0.85,
			MaxMessageSize:   1024,
			EncryptionLevel:  "quantum",
			SessionTimeout:   3600,
		},
		Created: now,
		Expires: expiresAt,
	}

	c.JSON(http.StatusCreated, types.NewAPIResponse(response, requestID))
}

// getSession retrieves session information
// @Summary Get quantum session information
// @Description Retrieve detailed information about an active quantum communication session
// @Tags NLC
// @Produce json
// @Param id path string true "Session ID"
// @Success 200 {object} types.APIResponse{data=NLCSessionResponse}
// @Failure 404 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/nlc/sessions/{id} [get]
func getSession(c *gin.Context) {
	requestID := c.GetString("request_id")
	sessionID := c.Param("id")
	
	// Mock session retrieval
	if sessionID == "" {
		c.JSON(http.StatusNotFound, types.NewAPIError(
			"NLC_003",
			"Session not found",
			"The specified session ID does not exist",
			requestID,
		))
		return
	}

	// Return mock session data
	response := NLCSessionResponse{
		ID:     sessionID,
		Status: "connected",
		Primes: []int{2, 3, 5},
		Metrics: &NLCMetrics{
			Entropy:           0.18,
			ResonanceStrength: 0.92,
			ChannelQuality:    0.89,
			PhaseCoherence:    0.94,
			NoiseLevel:        0.03,
		},
		Config: &NLCConfig{
			ChannelStability: 0.85,
			MaxMessageSize:   1024,
			EncryptionLevel:  "quantum",
			SessionTimeout:   3600,
		},
		Created: time.Now().Add(-10 * time.Minute),
		Expires: time.Now().Add(50 * time.Minute),
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(response, requestID))
}

// closeSession terminates a quantum session
// @Summary Close quantum communication session
// @Description Terminate an active quantum communication session and clean up resources
// @Tags NLC
// @Produce json
// @Param id path string true "Session ID"
// @Success 200 {object} types.APIResponse
// @Failure 404 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/nlc/sessions/{id} [delete]
func closeSession(c *gin.Context) {
	requestID := c.GetString("request_id")
	sessionID := c.Param("id")
	
	// Mock session closure
	result := map[string]interface{}{
		"session_id": sessionID,
		"status":     "closed",
		"closed_at":  time.Now(),
		"final_metrics": map[string]float64{
			"total_messages": 15,
			"avg_transmission_time": 23.5,
			"final_channel_quality": 0.87,
		},
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(result, requestID))
}

// sendMessage transmits a message through quantum channel
// @Summary Send message through quantum channel
// @Description Transmit a message through an established quantum communication channel
// @Tags NLC
// @Accept json
// @Produce json
// @Param id path string true "Session ID"
// @Param request body NLCMessageRequest true "Message data"
// @Success 200 {object} types.APIResponse{data=NLCMessageResponse}
// @Failure 400 {object} types.APIResponse
// @Failure 404 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/nlc/sessions/{id}/messages [post]
func sendMessage(c *gin.Context) {
	requestID := c.GetString("request_id")
	sessionID := c.Param("id")
	
	var req NLCMessageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, types.NewAPIError(
			"NLC_004",
			"Invalid message format",
			err.Error(),
			requestID,
		))
		return
	}

	// Mock message transmission
	messageID := "msg_" + uuid.New().String()[:8]
	transmissionTime := float64(len(req.Content)) * 2.3 // Mock calculation
	
	response := NLCMessageResponse{
		MessageID:   messageID,
		SessionID:   sessionID,
		Status:      "transmitted",
		Transmitted: true,
		Metrics: &NLCTransmissionMetrics{
			TransmissionTime: transmissionTime,
			QuantumFidelity:  0.94,
			ErrorCorrection:  true,
			SignalStrength:   0.87,
			DecoherenceRate:  0.02,
		},
		Timestamp: time.Now(),
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(response, requestID))
}

// getMessages retrieves session messages
// @Summary Get session messages
// @Description Retrieve all messages for a quantum communication session
// @Tags NLC
// @Produce json
// @Param id path string true "Session ID"
// @Success 200 {object} types.APIResponse
// @Failure 404 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/nlc/sessions/{id}/messages [get]
func getMessages(c *gin.Context) {
	requestID := c.GetString("request_id")
	sessionID := c.Param("id")
	
	// Mock message history
	messages := []map[string]interface{}{
		{
			"message_id": "msg_abc123",
			"content":    "Hello through the quantum channel",
			"timestamp":  time.Now().Add(-5 * time.Minute),
			"status":     "delivered",
			"fidelity":   0.95,
		},
		{
			"message_id": "msg_def456",
			"content":    "Quantum entanglement established successfully",
			"timestamp":  time.Now().Add(-3 * time.Minute),
			"status":     "delivered",
			"fidelity":   0.92,
		},
	}

	result := map[string]interface{}{
		"session_id": sessionID,
		"messages":   messages,
		"total":      len(messages),
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(result, requestID))
}

// getChannelInfo returns channel information
// @Summary Get quantum channel information
// @Description Get information about available quantum communication channels
// @Tags NLC
// @Produce json
// @Success 200 {object} types.APIResponse{data=NLCChannelInfo}
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/nlc/channels [get]
func getChannelInfo(c *gin.Context) {
	requestID := c.GetString("request_id")
	
	info := NLCChannelInfo{
		Active:     3,
		Total:      10,
		AvgQuality: 0.87,
		Primes:     []int{2, 3, 5, 7, 11, 13, 17, 19, 23, 29},
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(info, requestID))
}

// getNLCStatus returns NLC service status
// @Summary Get NLC service status
// @Description Check the health and status of the NLC service
// @Tags NLC
// @Produce json
// @Success 200 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/nlc/status [get]
func getNLCStatus(c *gin.Context) {
	requestID := c.GetString("request_id")
	
	status := map[string]interface{}{
		"service":              "nlc",
		"status":               "operational",
		"version":              "1.0.0",
		"uptime":               "24h",
		"active_sessions":      3,
		"total_sessions":       142,
		"avg_channel_quality":  0.87,
		"quantum_entanglement": "stable",
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(status, requestID))
}