package router

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nomyx/resonance-platform/shared/types"
)

// QSEM API types
type QSEMEncodeRequest struct {
	Concepts []string    `json:"concepts" binding:"required" example:"[\"love\",\"entropy\",\"pattern\"]"`
	Basis    string      `json:"basis" example:"prime"`
	Config   *QSEMConfig `json:"config,omitempty"`
}

type QSEMResonanceRequest struct {
	Vectors []QuantumVector `json:"vectors" binding:"required"`
	Config  *QSEMConfig     `json:"config,omitempty"`
}

type QSEMConfig struct {
	MaxDimensions int     `json:"maxDimensions,omitempty" example:"100"`
	Threshold     float64 `json:"threshold,omitempty" example:"0.1"`
	Normalize     bool    `json:"normalize,omitempty"`
}

type QuantumVector struct {
	Concept string    `json:"concept"`
	Alpha   []float64 `json:"alpha"`
}

type QSEMEncodeResponse struct {
	Vectors []QuantumVector `json:"vectors"`
	Basis   string          `json:"basis"`
	Stats   *EncodingStats  `json:"stats"`
	Timing  *TimingInfo     `json:"timing"`
}

type QSEMResonanceResponse struct {
	Coherence float64              `json:"coherence"`
	Pairwise  []ResonancePair      `json:"pairwise"`
	Matrix    [][]float64          `json:"matrix,omitempty"`
	Analysis  *ResonanceAnalysis   `json:"analysis"`
	Timing    *TimingInfo          `json:"timing"`
}

type EncodingStats struct {
	TotalConcepts    int     `json:"totalConcepts"`
	VectorDimensions int     `json:"vectorDimensions"`
	AvgMagnitude     float64 `json:"avgMagnitude"`
	Sparsity         float64 `json:"sparsity"`
}

type ResonancePair struct {
	A         int     `json:"a"`
	B         int     `json:"b"`
	Resonance float64 `json:"resonance"`
	Type      string  `json:"type"`
}

type ResonanceAnalysis struct {
	StrongestPair    *ResonancePair `json:"strongestPair"`
	WeakestPair      *ResonancePair `json:"weakestPair"`
	AvgResonance     float64        `json:"avgResonance"`
	ClusterCount     int            `json:"clusterCount"`
	SemanticGroups   []SemanticGroup `json:"semanticGroups,omitempty"`
}

type SemanticGroup struct {
	Concepts   []string `json:"concepts"`
	Centroid   []float64 `json:"centroid"`
	Coherence  float64   `json:"coherence"`
	Label      string    `json:"label,omitempty"`
}

// SetupQSEMRoutes configures QSEM service routes
func SetupQSEMRoutes(rg *gin.RouterGroup) {
	qsem := rg.Group("/qsem")
	{
		qsem.POST("/encode", encodeConcepts)
		qsem.POST("/resonance", computeResonance)
		qsem.GET("/basis", getSupportedBasis)
		qsem.GET("/status", getQSEMStatus)
	}
}

// encodeConcepts handles concept encoding requests
// @Summary Encode concepts into quantum semantic vectors
// @Description Transform natural language concepts into prime-basis quantum vectors
// @Tags QSEM
// @Accept json
// @Produce json
// @Param request body QSEMEncodeRequest true "Encoding parameters"
// @Success 200 {object} types.APIResponse{data=QSEMEncodeResponse}
// @Failure 400 {object} types.APIResponse
// @Failure 401 {object} types.APIResponse
// @Failure 500 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/qsem/encode [post]
func encodeConcepts(c *gin.Context) {
	requestID := c.GetString("request_id")
	var req QSEMEncodeRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, types.NewAPIError(
			"QSEM_001",
			"Invalid request format",
			err.Error(),
			requestID,
		))
		return
	}

	if len(req.Concepts) == 0 {
		c.JSON(http.StatusBadRequest, types.NewAPIError(
			"QSEM_002",
			"No concepts provided",
			"At least one concept is required for encoding",
			requestID,
		))
		return
	}

	startTime := time.Now()
	
	// Generate mock quantum vectors for concepts
	vectors := make([]QuantumVector, len(req.Concepts))
	totalMagnitude := 0.0
	dimensions := 20 // Mock dimension count
	
	for i, concept := range req.Concepts {
		alpha := generateMockVector(concept, dimensions)
		vectors[i] = QuantumVector{
			Concept: concept,
			Alpha:   alpha,
		}
		
		// Calculate magnitude
		magnitude := 0.0
		for _, val := range alpha {
			magnitude += val * val
		}
		totalMagnitude += magnitude
	}
	
	endTime := time.Now()
	duration := float64(endTime.Sub(startTime).Nanoseconds()) / 1e6

	response := QSEMEncodeResponse{
		Vectors: vectors,
		Basis:   "prime",
		Stats: &EncodingStats{
			TotalConcepts:    len(req.Concepts),
			VectorDimensions: dimensions,
			AvgMagnitude:     totalMagnitude / float64(len(req.Concepts)),
			Sparsity:         0.15, // Mock sparsity
		},
		Timing: &TimingInfo{
			StartTime:  startTime,
			EndTime:    endTime,
			Duration:   duration,
			Iterations: len(req.Concepts),
		},
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(response, requestID))
}

// computeResonance handles resonance computation requests
// @Summary Compute semantic resonance between quantum vectors
// @Description Calculate resonance patterns and coherence between encoded concept vectors
// @Tags QSEM
// @Accept json
// @Produce json
// @Param request body QSEMResonanceRequest true "Resonance computation parameters"
// @Success 200 {object} types.APIResponse{data=QSEMResonanceResponse}
// @Failure 400 {object} types.APIResponse
// @Failure 401 {object} types.APIResponse
// @Failure 500 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/qsem/resonance [post]
func computeResonance(c *gin.Context) {
	requestID := c.GetString("request_id")
	var req QSEMResonanceRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, types.NewAPIError(
			"QSEM_003",
			"Invalid request format",
			err.Error(),
			requestID,
		))
		return
	}

	if len(req.Vectors) < 2 {
		c.JSON(http.StatusBadRequest, types.NewAPIError(
			"QSEM_004",
			"Insufficient vectors",
			"At least 2 vectors required for resonance computation",
			requestID,
		))
		return
	}

	startTime := time.Now()
	
	// Compute mock resonance matrix
	n := len(req.Vectors)
	matrix := make([][]float64, n)
	pairwise := make([]ResonancePair, 0, n*(n-1)/2)
	
	totalResonance := 0.0
	strongestPair := &ResonancePair{Resonance: -1}
	weakestPair := &ResonancePair{Resonance: 2}
	
	for i := 0; i < n; i++ {
		matrix[i] = make([]float64, n)
		for j := i; j < n; j++ {
			var resonance float64
			if i == j {
				resonance = 1.0 // Self-resonance
			} else {
				// Mock resonance calculation
				resonance = mockResonanceCalculation(req.Vectors[i], req.Vectors[j])
				
				// Determine resonance type
				resonanceType := "neutral"
				if resonance > 0.7 {
					resonanceType = "synonymous"
				} else if resonance < 0.3 {
					resonanceType = "orthogonal"
				}
				
				pair := ResonancePair{
					A:         i,
					B:         j,
					Resonance: resonance,
					Type:      resonanceType,
				}
				pairwise = append(pairwise, pair)
				
				if resonance > strongestPair.Resonance {
					strongestPair = &pair
				}
				if resonance < weakestPair.Resonance {
					weakestPair = &pair
				}
				
				totalResonance += resonance
			}
			
			matrix[i][j] = resonance
			matrix[j][i] = resonance
		}
	}
	
	avgResonance := totalResonance / float64(len(pairwise))
	coherence := avgResonance * 0.8 // Mock coherence calculation
	
	endTime := time.Now()
	duration := float64(endTime.Sub(startTime).Nanoseconds()) / 1e6

	response := QSEMResonanceResponse{
		Coherence: coherence,
		Pairwise:  pairwise,
		Matrix:    matrix,
		Analysis: &ResonanceAnalysis{
			StrongestPair: strongestPair,
			WeakestPair:   weakestPair,
			AvgResonance:  avgResonance,
			ClusterCount:  2, // Mock cluster count
		},
		Timing: &TimingInfo{
			StartTime:  startTime,
			EndTime:    endTime,
			Duration:   duration,
			Iterations: len(pairwise),
		},
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(response, requestID))
}

// getSupportedBasis returns supported vector basis types
// @Summary Get supported vector basis types
// @Description Get information about vector basis types supported by QSEM
// @Tags QSEM
// @Produce json
// @Success 200 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/qsem/basis [get]
func getSupportedBasis(c *gin.Context) {
	requestID := c.GetString("request_id")
	
	basisInfo := map[string]interface{}{
		"supported": []string{"prime", "fourier", "wavelet"},
		"default":   "prime",
		"prime": map[string]interface{}{
			"description": "Prime number eigenstate basis",
			"dimensions":  "2-1000",
			"advantages":  []string{"quantum coherence", "semantic stability"},
		},
		"fourier": map[string]interface{}{
			"description": "Fourier transform basis",
			"dimensions":  "8-512",
			"advantages":  []string{"frequency analysis", "periodic patterns"},
		},
		"wavelet": map[string]interface{}{
			"description": "Wavelet transform basis",
			"dimensions":  "16-256",
			"advantages":  []string{"multi-resolution", "localized features"},
		},
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(basisInfo, requestID))
}

// getQSEMStatus returns QSEM service status
// @Summary Get QSEM service status
// @Description Check the health and status of the QSEM service
// @Tags QSEM
// @Produce json
// @Success 200 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/qsem/status [get]
func getQSEMStatus(c *gin.Context) {
	requestID := c.GetString("request_id")
	
	status := map[string]interface{}{
		"service":           "qsem",
		"status":            "operational",
		"version":           "1.0.0",
		"uptime":            "24h",
		"concepts_encoded":  15420,
		"avg_encoding_time": "45ms",
		"vector_database":   "connected",
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(status, requestID))
}

// generateMockVector creates a mock quantum vector for a concept
func generateMockVector(concept string, dimensions int) []float64 {
	vector := make([]float64, dimensions)
	
	// Use concept hash for reproducible "random" values
	hash := 0
	for _, char := range concept {
		hash = hash*31 + int(char)
	}
	
	// Generate mock vector based on concept
	for i := 0; i < dimensions; i++ {
		hash = hash*1103515245 + 12345
		vector[i] = float64((hash>>16)&0x7fff) / 32767.0 * 0.5
	}
	
	// Normalize
	magnitude := 0.0
	for _, val := range vector {
		magnitude += val * val
	}
	magnitude = 1.0 / (magnitude + 1e-10)
	
	for i := range vector {
		vector[i] *= magnitude
	}
	
	return vector
}

// mockResonanceCalculation computes mock resonance between two vectors
func mockResonanceCalculation(v1, v2 QuantumVector) float64 {
	if len(v1.Alpha) != len(v2.Alpha) {
		return 0.0
	}
	
	// Compute dot product
	dotProduct := 0.0
	for i := range v1.Alpha {
		dotProduct += v1.Alpha[i] * v2.Alpha[i]
	}
	
	// Return absolute value as resonance strength
	if dotProduct < 0 {
		return -dotProduct
	}
	return dotProduct
}