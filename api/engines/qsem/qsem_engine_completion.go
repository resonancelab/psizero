package qsem

import (
	"time"

	"github.com/psizero/resonance-platform/shared/types"
)

// Complete the generateAnalysisResult function and add remaining methods
func (qsem *QSEMEngine) generateAnalysisResult() *SemanticAnalysisResult {
	// Calculate final metrics
	totalEntropy := 0.0
	avgCoherence := 0.0
	
	for _, semanticVector := range qsem.semanticVectors {
		totalEntropy += semanticVector.Entropy
		avgCoherence += semanticVector.Coherence
	}
	
	if len(qsem.semanticVectors) > 0 {
		avgCoherence /= float64(len(qsem.semanticVectors))
	}
	
	// Generate similarity matrix
	similarityMatrix := qsem.generateSimilarityMatrix()
	
	// Generate relationship matrix
	relationshipMatrix := qsem.generateRelationshipMatrix()
	
	// Extract cluster assignments
	clusterAssignments := make(map[string]string)
	for concept, node := range qsem.conceptualGraph.Nodes {
		clusterAssignments[concept] = node.ClusterID
	}
	
	convergence := qsem.calculateConvergenceMetric()
	
	result := &SemanticAnalysisResult{
		ConceptMap:          qsem.semanticVectors,
		RelationshipMatrix:  relationshipMatrix,
		ClusterAssignments:  clusterAssignments,
		SemanticSimilarity:  similarityMatrix,
		ContextualCoherence: avgCoherence,
		MeaningDensity:      qsem.meaningSpace.Density,
		ConceptualEntropy:   totalEntropy,
		LearningConvergence: convergence,
		ProcessingTime:      time.Since(qsem.startTime).Seconds(),
		Success:             convergence > 0.7,
	}
	
	return result
}

// generateSimilarityMatrix creates semantic similarity matrix
func (qsem *QSEMEngine) generateSimilarityMatrix() map[string]map[string]float64 {
	matrix := make(map[string]map[string]float64)
	
	for conceptA := range qsem.semanticVectors {
		matrix[conceptA] = make(map[string]float64)
		
		for conceptB := range qsem.semanticVectors {
			if conceptA == conceptB {
				matrix[conceptA][conceptB] = 1.0
			} else {
				similarity, err := qsem.calculateSemanticSimilarity(conceptA, conceptB)
				if err != nil {
					matrix[conceptA][conceptB] = 0.0
				} else {
					matrix[conceptA][conceptB] = similarity
				}
			}
		}
	}
	
	return matrix
}

// generateRelationshipMatrix creates conceptual relationship matrix
func (qsem *QSEMEngine) generateRelationshipMatrix() [][]float64 {
	concepts := make([]string, 0, len(qsem.semanticVectors))
	for concept := range qsem.semanticVectors {
		concepts = append(concepts, concept)
	}
	
	n := len(concepts)
	matrix := make([][]float64, n)
	for i := range matrix {
		matrix[i] = make([]float64, n)
	}
	
	// Create concept index map
	conceptIndex := make(map[string]int)
	for i, concept := range concepts {
		conceptIndex[concept] = i
	}
	
	// Fill matrix with relationship strengths
	for _, edge := range qsem.conceptualGraph.Edges {
		if indexA, existsA := conceptIndex[edge.FromConcept]; existsA {
			if indexB, existsB := conceptIndex[edge.ToConcept]; existsB {
				matrix[indexA][indexB] = edge.Strength
				matrix[indexB][indexA] = edge.Strength * edge.Symmetry
			}
		}
	}
	
	return matrix
}

// EncodeConcept encodes a single concept in the semantic space
func (qsem *QSEMEngine) EncodeConcept(concept string) (*SemanticVector, error) {
	qsem.mu.Lock()
	defer qsem.mu.Unlock()
	
	// Check if concept already exists
	if existing, exists := qsem.semanticVectors[concept]; exists {
		return existing, nil
	}
	
	// Create new semantic vector
	semanticVector, err := qsem.createSemanticVector(concept, len(qsem.semanticVectors))
	if err != nil {
		return nil, err
	}
	
	qsem.semanticVectors[concept] = semanticVector
	
	// Update conceptual graph if needed
	if qsem.conceptualGraph != nil {
		node := &ConceptNode{
			ConceptID:      concept,
			SemanticVector: semanticVector,
			Neighbors:      make([]string, 0),
			Centrality:     0.0,
			Importance:     semanticVector.ContextWeight,
			Abstraction:    qsem.calculateAbstractionLevel(semanticVector),
		}
		qsem.conceptualGraph.Nodes[concept] = node
	}
	
	return semanticVector, nil
}

// GetSemanticSimilarity computes similarity between two concepts
func (qsem *QSEMEngine) GetSemanticSimilarity(conceptA, conceptB string) (float64, error) {
	qsem.mu.RLock()
	defer qsem.mu.RUnlock()
	
	return qsem.calculateSemanticSimilarity(conceptA, conceptB)
}

// GetConceptualNeighbors returns the most similar concepts to a given concept
func (qsem *QSEMEngine) GetConceptualNeighbors(concept string, maxNeighbors int) ([]string, []float64, error) {
	qsem.mu.RLock()
	defer qsem.mu.RUnlock()
	
	if _, exists := qsem.semanticVectors[concept]; !exists {
		return nil, nil, fmt.Errorf("concept not found: %s", concept)
	}
	
	type neighborSimilarity struct {
		concept    string
		similarity float64
	}
	
	neighbors := make([]neighborSimilarity, 0)
	
	for otherConcept := range qsem.semanticVectors {
		if otherConcept == concept {
			continue
		}
		
		similarity, err := qsem.calculateSemanticSimilarity(concept, otherConcept)
		if err != nil {
			continue
		}
		
		neighbors = append(neighbors, neighborSimilarity{
			concept:    otherConcept,
			similarity: similarity,
		})
	}
	
	// Sort by similarity (descending)
	for i := 0; i < len(neighbors)-1; i++ {
		for j := i + 1; j < len(neighbors); j++ {
			if neighbors[i].similarity < neighbors[j].similarity {
				neighbors[i], neighbors[j] = neighbors[j], neighbors[i]
			}
		}
	}
	
	// Extract top neighbors
	resultCount := maxNeighbors
	if resultCount > len(neighbors) {
		resultCount = len(neighbors)
	}
	
	concepts := make([]string, resultCount)
	similarities := make([]float64, resultCount)
	
	for i := 0; i < resultCount; i++ {
		concepts[i] = neighbors[i].concept
		similarities[i] = neighbors[i].similarity
	}
	
	return concepts, similarities, nil
}

// UpdateContextStack adds or updates a context layer
func (qsem *QSEMEngine) UpdateContextStack(stackID string, context string, weight float64, concepts []string) error {
	qsem.mu.Lock()
	defer qsem.mu.Unlock()
	
	// Find existing stack or create new one
	var contextStack *ContextStack
	for _, stack := range qsem.contextStacks {
		if stack.ID == stackID {
			contextStack = stack
			break
		}
	}
	
	if contextStack == nil {
		contextStack = &ContextStack{
			ID:             stackID,
			Layers:         make([]*ContextLayer, 0),
			ActiveConcepts: make([]string, 0),
			Coherence:      0.0,
			Depth:          0,
		}
		qsem.contextStacks = append(qsem.contextStacks, contextStack)
	}
	
	// Add new context layer
	layer := &ContextLayer{
		Level:      len(contextStack.Layers),
		Context:    context,
		Weight:     weight,
		Concepts:   concepts,
		Influences: make(map[string]float64),
	}
	
	// Calculate influences on existing concepts
	for _, concept := range concepts {
		if semanticVector, exists := qsem.semanticVectors[concept]; exists {
			// Update context weight based on layer weight
			semanticVector.ContextWeight = (semanticVector.ContextWeight + weight) / 2.0
			layer.Influences[concept] = weight
		}
	}
	
	contextStack.Layers = append(contextStack.Layers, layer)
	contextStack.ActiveConcepts = concepts
	contextStack.Depth = len(contextStack.Layers)
	
	// Calculate stack coherence
	contextStack.Coherence = qsem.calculateContextCoherence(contextStack)
	
	return nil
}

// calculateContextCoherence computes coherence of a context stack
func (qsem *QSEMEngine) calculateContextCoherence(stack *ContextStack) float64 {
	if len(stack.Layers) == 0 {
		return 0.0
	}
	
	totalCoherence := 0.0
	
	for _, layer := range stack.Layers {
		layerCoherence := 0.0
		conceptCount := 0
		
		for _, concept := range layer.Concepts {
			if semanticVector, exists := qsem.semanticVectors[concept]; exists {
				layerCoherence += semanticVector.Coherence
				conceptCount++
			}
		}
		
		if conceptCount > 0 {
			layerCoherence /= float64(conceptCount)
		}
		
		totalCoherence += layer.Weight * layerCoherence
	}
	
	// Normalize by total weight
	totalWeight := 0.0
	for _, layer := range stack.Layers {
		totalWeight += layer.Weight
	}
	
	if totalWeight > 0 {
		totalCoherence /= totalWeight
	}
	
	return totalCoherence
}

// GetTelemetry returns current telemetry data
func (qsem *QSEMEngine) GetTelemetry() []types.TelemetryPoint {
	qsem.mu.RLock()
	defer qsem.mu.RUnlock()
	
	telemetry := make([]types.TelemetryPoint, len(qsem.telemetryPoints))
	copy(telemetry, qsem.telemetryPoints)
	return telemetry
}

// GetCurrentState returns the current state of the QSEM engine
func (qsem *QSEMEngine) GetCurrentState() map[string]interface{} {
	qsem.mu.RLock()
	defer qsem.mu.RUnlock()
	
	state := map[string]interface{}{
		"epoch":         qsem.currentEpoch,
		"concept_count": len(qsem.semanticVectors),
		"elapsed_time":  time.Since(qsem.startTime).Seconds(),
	}
	
	if qsem.conceptualGraph != nil {
		state["conceptual_graph"] = map[string]interface{}{
			"node_count":       len(qsem.conceptualGraph.Nodes),
			"edge_count":       len(qsem.conceptualGraph.Edges),
			"total_coherence":  qsem.conceptualGraph.TotalCoherence,
			"connectivity":     qsem.conceptualGraph.Connectivity,
			"cluster_count":    len(qsem.conceptualGraph.ClusterMap),
		}
	}
	
	if qsem.meaningSpace != nil {
		state["meaning_space"] = map[string]interface{}{
			"dimensions": qsem.meaningSpace.Dimensions,
			"density":    qsem.meaningSpace.Density,
			"volume":     qsem.meaningSpace.Volume,
			"curvature":  qsem.meaningSpace.Curvature,
		}
	}
	
	if qsem.ontologyTree != nil {
		state["ontology_tree"] = map[string]interface{}{
			"max_depth":         qsem.ontologyTree.MaxDepth,
			"branching_factor":  qsem.ontologyTree.BranchingFactor,
			"category_count":    len(qsem.ontologyTree.Categories),
		}
	}
	
	state["context_stacks"] = len(qsem.contextStacks)
	state["learning_metrics"] = qsem.learningMetrics
	
	return state
}

// Reset resets the QSEM engine to initial state
func (qsem *QSEMEngine) Reset() {
	qsem.mu.Lock()
	defer qsem.mu.Unlock()
	
	qsem.semanticVectors = make(map[string]*SemanticVector)
	qsem.conceptualGraph = nil
	qsem.ontologyTree = nil
	qsem.meaningSpace = nil
	qsem.contextStacks = make([]*ContextStack, 0)
	qsem.currentEpoch = 0
	qsem.telemetryPoints = make([]types.TelemetryPoint, 0)
	qsem.learningMetrics = make(map[string]float64)
}

// SetConfig updates the QSEM configuration
func (qsem *QSEMEngine) SetConfig(config *QSEMConfig) {
	qsem.mu.Lock()
	defer qsem.mu.Unlock()
	
	if config != nil {
		qsem.config = config
	}
}

// GetConfig returns the current QSEM configuration
func (qsem *QSEMEngine) GetConfig() *QSEMConfig {
	qsem.mu.RLock()
	defer qsem.mu.RUnlock()
	
	configCopy := *qsem.config
	return &configCopy
}

// ExportSemanticSpace exports the semantic space for external analysis
func (qsem *QSEMEngine) ExportSemanticSpace() map[string]interface{} {
	qsem.mu.RLock()
	defer qsem.mu.RUnlock()
	
	export := map[string]interface{}{
		"concepts":         make(map[string]interface{}),
		"relationships":    make([]map[string]interface{}, 0),
		"clusters":         qsem.conceptualGraph.ClusterMap,
		"meaning_space":    qsem.meaningSpace,
		"ontology_tree":    qsem.ontologyTree,
		"context_stacks":   qsem.contextStacks,
	}
	
	// Export concept information
	concepts := export["concepts"].(map[string]interface{})
	for conceptID, semanticVector := range qsem.semanticVectors {
		concepts[conceptID] = map[string]interface{}{
			"id":               semanticVector.ID,
			"concept":          semanticVector.Concept,
			"prime_basis":      semanticVector.PrimeBasis,
			"semantic_fields":  semanticVector.SemanticFields,
			"related_concepts": semanticVector.RelatedConcepts,
			"context_weight":   semanticVector.ContextWeight,
			"coherence":        semanticVector.Coherence,
			"entropy":          semanticVector.Entropy,
			"activation":       semanticVector.Activation,
		}
	}
	
	// Export relationships
	relationships := export["relationships"].([]map[string]interface{})
	for _, edge := range qsem.conceptualGraph.Edges {
		relationship := map[string]interface{}{
			"from_concept":   edge.FromConcept,
			"to_concept":     edge.ToConcept,
			"relation_type":  edge.RelationType,
			"strength":       edge.Strength,
			"symmetry":       edge.Symmetry,
		}
		relationships = append(relationships, relationship)
	}
	export["relationships"] = relationships
	
	return export
}

// ImportSemanticSpace imports semantic space from external data
func (qsem *QSEMEngine) ImportSemanticSpace(data map[string]interface{}) error {
	qsem.mu.Lock()
	defer qsem.mu.Unlock()
	
	// Import concepts
	if conceptsData, exists := data["concepts"].(map[string]interface{}); exists {
		for conceptID, conceptInfo := range conceptsData {
			if conceptMap, ok := conceptInfo.(map[string]interface{}); ok {
				concept := conceptMap["concept"].(string)
				
				// Create semantic vector
				semanticVector, err := qsem.createSemanticVector(concept, len(qsem.semanticVectors))
				if err != nil {
					continue
				}
				
				// Update from imported data
				if contextWeight, ok := conceptMap["context_weight"].(float64); ok {
					semanticVector.ContextWeight = contextWeight
				}
				if coherence, ok := conceptMap["coherence"].(float64); ok {
					semanticVector.Coherence = coherence
				}
				if activation, ok := conceptMap["activation"].(float64); ok {
					semanticVector.Activation = activation
				}
				
				qsem.semanticVectors[conceptID] = semanticVector
			}
		}
	}
	
	// Import meaning space
	if meaningSpaceData, exists := data["meaning_space"]; exists {
		// Would deserialize meaning space data
		// Simplified for now
	}
	
	return nil
}