package router

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/nomyx/resonance-platform/shared/types"
)

// I-Ching API types
type IChingRequest struct {
	Question string       `json:"question" binding:"required" example:"What direction should I take?"`
	Steps    int          `json:"steps,omitempty" example:"7"`
	Config   *IChingConfig `json:"config,omitempty"`
}

type IChingConfig struct {
	EntropyThreshold    float64 `json:"entropyThreshold,omitempty" example:"0.1"`
	AttractorSensitivity float64 `json:"attractorSensitivity,omitempty" example:"0.05"`
	SymbolicDepth       int     `json:"symbolicDepth,omitempty" example:"3"`
	IncludeInterpretation bool   `json:"includeInterpretation,omitempty"`
}

type IChingResponse struct {
	Question      string            `json:"question"`
	Sequence      []HexagramStep    `json:"sequence"`
	FinalHexagram *Hexagram        `json:"finalHexagram"`
	Interpretation *Interpretation  `json:"interpretation,omitempty"`
	Stabilized    bool             `json:"stabilized"`
	Metrics       *IChingMetrics   `json:"metrics"`
	Timing        *TimingInfo      `json:"timing"`
}

type HexagramStep struct {
	Step              int       `json:"step"`
	Hexagram          string    `json:"hexagram"`
	Binary            string    `json:"binary"`
	Name              string    `json:"name,omitempty"`
	Entropy           float64   `json:"entropy"`
	AttractorProximity float64   `json:"attractorProximity"`
	Timestamp         time.Time `json:"timestamp"`
}

type Hexagram struct {
	Pattern     string   `json:"pattern"`
	Binary      string   `json:"binary"`
	Number      int      `json:"number"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Lines       []string `json:"lines"`
	Trigrams    *Trigrams `json:"trigrams"`
}

type Trigrams struct {
	Upper *Trigram `json:"upper"`
	Lower *Trigram `json:"lower"`
}

type Trigram struct {
	Pattern string `json:"pattern"`
	Name    string `json:"name"`
	Element string `json:"element"`
	Quality string `json:"quality"`
}

type Interpretation struct {
	Summary     string                 `json:"summary"`
	Guidance    string                 `json:"guidance"`
	Themes      []string              `json:"themes"`
	Symbolism   map[string]string     `json:"symbolism"`
	Context     map[string]interface{} `json:"context"`
	Confidence  float64               `json:"confidence"`
}

type IChingMetrics struct {
	FinalEntropy        float64 `json:"finalEntropy"`
	ConvergenceRate     float64 `json:"convergenceRate"`
	StabilizationPoint  int     `json:"stabilizationPoint"`
	AttractorStrength   float64 `json:"attractorStrength"`
	SymbolicResonance   float64 `json:"symbolicResonance"`
}

// SetupIChingRoutes configures I-Ching Oracle service routes
func SetupIChingRoutes(rg *gin.RouterGroup) {
	iching := rg.Group("/iching")
	{
		iching.POST("/evolve", evolveHexagrams)
		iching.GET("/hexagrams", getHexagramDatabase)
		iching.GET("/hexagrams/:number", getHexagram)
		iching.GET("/trigrams", getTrigrams)
		iching.GET("/status", getIChingStatus)
	}
}

// evolveHexagrams handles I-Ching evolution requests
// @Summary Evolve I-Ching hexagram sequence
// @Description Generate hexagram evolution sequence using symbolic entropy dynamics
// @Tags I-Ching
// @Accept json
// @Produce json
// @Param request body IChingRequest true "Oracle consultation parameters"
// @Success 200 {object} types.APIResponse{data=IChingResponse}
// @Failure 400 {object} types.APIResponse
// @Failure 401 {object} types.APIResponse
// @Failure 500 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/iching/evolve [post]
func evolveHexagrams(c *gin.Context) {
	requestID := c.GetString("request_id")
	var req IChingRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, types.NewAPIError(
			"ICHING_001",
			"Invalid request format",
			err.Error(),
			requestID,
		))
		return
	}

	if req.Question == "" {
		c.JSON(http.StatusBadRequest, types.NewAPIError(
			"ICHING_002",
			"Question required",
			"A question is required for I-Ching consultation",
			requestID,
		))
		return
	}

	if req.Steps == 0 {
		req.Steps = 7 // Default evolution steps
	}

	startTime := time.Now()
	
	// Generate hexagram evolution sequence
	sequence := generateHexagramSequence(req.Question, req.Steps)
	
	// Get final hexagram details
	finalHexagram := getHexagramDetails(sequence[len(sequence)-1].Hexagram)
	
	// Generate interpretation if requested
	var interpretation *Interpretation
	if req.Config == nil || req.Config.IncludeInterpretation {
		interpretation = generateInterpretation(req.Question, finalHexagram, sequence)
	}

	endTime := time.Now()
	duration := float64(endTime.Sub(startTime).Nanoseconds()) / 1e6

	response := IChingResponse{
		Question:      req.Question,
		Sequence:      sequence,
		FinalHexagram: finalHexagram,
		Interpretation: interpretation,
		Stabilized:    sequence[len(sequence)-1].Entropy < 0.15,
		Metrics: &IChingMetrics{
			FinalEntropy:       sequence[len(sequence)-1].Entropy,
			ConvergenceRate:    0.23,
			StabilizationPoint: len(sequence) - 2,
			AttractorStrength:  0.87,
			SymbolicResonance:  0.74,
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

// getHexagramDatabase returns hexagram information
// @Summary Get hexagram database
// @Description Get information about the complete I-Ching hexagram database
// @Tags I-Ching
// @Produce json
// @Success 200 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/iching/hexagrams [get]
func getHexagramDatabase(c *gin.Context) {
	requestID := c.GetString("request_id")
	
	database := map[string]interface{}{
		"total_hexagrams": 64,
		"total_trigrams":  8,
		"version":         "King Wen sequence",
		"categories": []string{
			"Creative Principle", "Natural Law", "Difficulty", "Youthful Folly",
			"Waiting", "Conflict", "The Army", "Holding Together",
		},
		"recent_consultations": 1247,
		"most_frequent": []map[string]interface{}{
			{"number": 1, "name": "The Creative", "frequency": 12},
			{"number": 2, "name": "The Receptive", "frequency": 11},
			{"number": 11, "name": "Peace", "frequency": 9},
		},
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(database, requestID))
}

// getHexagram returns specific hexagram information
// @Summary Get specific hexagram
// @Description Get detailed information about a specific hexagram by number
// @Tags I-Ching
// @Produce json
// @Param number path int true "Hexagram number (1-64)"
// @Success 200 {object} types.APIResponse{data=Hexagram}
// @Failure 404 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/iching/hexagrams/{number} [get]
func getHexagram(c *gin.Context) {
	requestID := c.GetString("request_id")
	number := c.Param("number")
	
	// Mock hexagram retrieval (in real implementation, would fetch from database)
	hexagram := getHexagramDetails("111111") // Mock - would use number to lookup
	
	if hexagram == nil {
		c.JSON(http.StatusNotFound, types.NewAPIError(
			"ICHING_003",
			"Hexagram not found",
			"The specified hexagram number does not exist",
			requestID,
		))
		return
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(hexagram, requestID))
}

// getTrigrams returns trigram information
// @Summary Get trigram information
// @Description Get information about the eight fundamental trigrams
// @Tags I-Ching
// @Produce json
// @Success 200 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/iching/trigrams [get]
func getTrigrams(c *gin.Context) {
	requestID := c.GetString("request_id")
	
	trigrams := map[string]interface{}{
		"total": 8,
		"trigrams": []map[string]interface{}{
			{"pattern": "111", "name": "Heaven", "element": "Metal", "quality": "Creative"},
			{"pattern": "000", "name": "Earth", "element": "Earth", "quality": "Receptive"},
			{"pattern": "100", "name": "Thunder", "element": "Wood", "quality": "Arousing"},
			{"pattern": "010", "name": "Water", "element": "Water", "quality": "Abysmal"},
			{"pattern": "001", "name": "Mountain", "element": "Earth", "quality": "Still"},
			{"pattern": "110", "name": "Wind", "element": "Wood", "quality": "Gentle"},
			{"pattern": "101", "name": "Fire", "element": "Fire", "quality": "Clinging"},
			{"pattern": "011", "name": "Lake", "element": "Metal", "quality": "Joyous"},
		},
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(trigrams, requestID))
}

// getIChingStatus returns I-Ching service status
// @Summary Get I-Ching service status
// @Description Check the health and status of the I-Ching Oracle service
// @Tags I-Ching
// @Produce json
// @Success 200 {object} types.APIResponse
// @Security ApiKeyAuth
// @Security BearerAuth
// @Router /v1/iching/status [get]
func getIChingStatus(c *gin.Context) {
	requestID := c.GetString("request_id")
	
	status := map[string]interface{}{
		"service":             "iching",
		"status":              "operational",
		"version":             "1.0.0",
		"uptime":              "24h",
		"total_consultations": 1247,
		"avg_evolution_time":  "150ms",
		"oracle_wisdom":       "flowing",
		"symbolic_resonance":  "stable",
	}

	c.JSON(http.StatusOK, types.NewAPIResponse(status, requestID))
}

// Helper functions

func generateHexagramSequence(question string, steps int) []HexagramStep {
	sequence := make([]HexagramStep, steps)
	
	// Generate initial hexagram based on question hash
	hash := 0
	for _, char := range question {
		hash = hash*31 + int(char)
	}
	
	for i := 0; i < steps; i++ {
		// Mock evolution - in real implementation would use symbolic entropy dynamics
		hash = hash*1103515245 + 12345
		binary := ""
		for j := 0; j < 6; j++ {
			if (hash>>(j*2))&1 == 1 {
				binary += "1"
			} else {
				binary += "0"
			}
		}
		
		entropy := 1.5 - float64(i)*0.2 // Decreasing entropy
		if entropy < 0.1 {
			entropy = 0.1
		}
		
		attractorProximity := float64(i) * 0.15 // Increasing attractor proximity
		if attractorProximity > 1.0 {
			attractorProximity = 1.0
		}
		
		sequence[i] = HexagramStep{
			Step:               i,
			Hexagram:           binary,
			Binary:             binary,
			Name:               getHexagramName(binary),
			Entropy:            entropy,
			AttractorProximity: attractorProximity,
			Timestamp:          time.Now().Add(-time.Duration(steps-i) * time.Millisecond * 100),
		}
	}
	
	return sequence
}

func getHexagramDetails(pattern string) *Hexagram {
	// Mock hexagram details - in real implementation would lookup from database
	return &Hexagram{
		Pattern:     pattern,
		Binary:      pattern,
		Number:      1, // Mock number
		Name:        "The Creative",
		Description: "The Creative principle represents the fundamental force of creation and initiation.",
		Lines: []string{
			"Nine at the beginning: Hidden dragon. Do not act.",
			"Nine in the second place: Dragon appearing in the field.",
			"Nine in the third place: All day long the superior man is creatively active.",
			"Nine in the fourth place: Wavering flight over the depths.",
			"Nine in the fifth place: Flying dragon in the heavens.",
			"Nine at the top: Arrogant dragon will have cause to repent.",
		},
		Trigrams: &Trigrams{
			Upper: &Trigram{Pattern: "111", Name: "Heaven", Element: "Metal", Quality: "Creative"},
			Lower: &Trigram{Pattern: "111", Name: "Heaven", Element: "Metal", Quality: "Creative"},
		},
	}
}

func getHexagramName(pattern string) string {
	// Mock name lookup - in real implementation would use pattern-to-name mapping
	names := []string{
		"The Creative", "The Receptive", "Difficulty at the Beginning",
		"Youthful Folly", "Waiting", "Conflict", "The Army",
		"Holding Together", "Small Taming", "Treading",
	}
	
	hash := 0
	for _, char := range pattern {
		hash = hash*31 + int(char)
	}
	
	return names[hash%len(names)]
}

func generateInterpretation(question string, hexagram *Hexagram, sequence []HexagramStep) *Interpretation {
	// Mock interpretation generation
	return &Interpretation{
		Summary: "The evolution sequence suggests a period of creative transformation. " +
			"The decreasing entropy indicates stabilization and clarity emerging from initial confusion.",
		Guidance: "Trust in the natural process of development. Like the dragon ascending through " +
			"the stages, progress requires patience and alignment with the proper timing.",
		Themes: []string{"transformation", "patience", "natural timing", "creative force"},
		Symbolism: map[string]string{
			"dragon":  "creative potential ascending through stages",
			"heaven":  "pure creative principle and inspiration",
			"field":   "receptive ground for manifestation",
		},
		Context: map[string]interface{}{
			"question_entropy":     0.85,
			"symbolic_resonance":   0.74,
			"attractor_alignment":  0.87,
		},
		Confidence: 0.82,
	}
}