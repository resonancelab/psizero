/**
 * Accessible TSP Visualizer Component
 * Enhanced TSP visualization with comprehensive accessibility features
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  useKeyboardNavigation, 
  AriaLabels, 
  ScreenReader,
  KeyboardShortcuts 
} from '../../lib/quantum-optimizer/accessibility-utils';
import { useAccessibility } from './AccessibilityProvider';
import { TSPProblem, TSPSolution, City } from '../../lib/quantum-optimizer/types';

interface AccessibleTSPVisualizerProps {
  problem: TSPProblem;
  solution?: TSPSolution;
  isLoading?: boolean;
  onCitySelect?: (cityId: number) => void;
  onRouteSelect?: (route: number[]) => void;
  className?: string;
}

export function AccessibleTSPVisualizer({
  problem,
  solution,
  isLoading = false,
  onCitySelect,
  onRouteSelect,
  className = ''
}: AccessibleTSPVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [focusedCity, setFocusedCity] = useState<number | null>(null);
  const [showRoute, setShowRoute] = useState(true);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  
  const { config, announce } = useAccessibility();

  // Keyboard navigation for cities
  useKeyboardNavigation(containerRef, {
    enableArrowKeys: true,
    enableTabTrapping: false,
    onKeyAction: handleKeyAction
  });

  function handleKeyAction(key: string, element: HTMLElement) {
    const cityButtons = containerRef.current?.querySelectorAll('[data-city-id]') as NodeListOf<HTMLElement>;
    const currentIndex = Array.from(cityButtons).findIndex(btn => btn === element);
    
    switch (key) {
      case 'Enter':
      case ' ':
        if (element.dataset.cityId) {
          const cityId = parseInt(element.dataset.cityId);
          handleCityInteraction(cityId);
        }
        break;
        
      case 'r':
      case 'R':
        toggleRouteVisibility();
        break;
        
      case '+':
      case '=':
        handleZoom(1.2);
        break;
        
      case '-':
      case '_':
        handleZoom(0.8);
        break;
        
      case '0':
        resetView();
        break;
        
      case 'h':
      case 'H':
      case '?':
        announceHelp();
        break;
    }
  }

  const handleCityInteraction = useCallback((cityId: number) => {
    setSelectedCity(cityId);
    setFocusedCity(cityId);
    onCitySelect?.(cityId);
    
    const city = problem.cities.find(c => c.id === cityId);
    if (city) {
      announce(
        `Selected ${city.name} at coordinates ${city.x.toFixed(0)}, ${city.y.toFixed(0)}`,
        'polite'
      );
    }
  }, [problem.cities, onCitySelect, announce]);

  const toggleRouteVisibility = useCallback(() => {
    setShowRoute(prev => {
      const newValue = !prev;
      announce(newValue ? 'Route visibility enabled' : 'Route visibility disabled', 'polite');
      return newValue;
    });
  }, [announce]);

  const handleZoom = useCallback((factor: number) => {
    setScale(prev => {
      const newScale = Math.max(0.5, Math.min(3, prev * factor));
      announce(`Zoom level: ${(newScale * 100).toFixed(0)}%`, 'polite');
      return newScale;
    });
  }, [announce]);

  const resetView = useCallback(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    announce('View reset to default', 'polite');
  }, [announce]);

  const announceHelp = useCallback(() => {
    const helpText = `
      TSP Visualizer Keyboard Shortcuts:
      Arrow keys to navigate between cities,
      Enter or Space to select city,
      R to toggle route visibility,
      Plus to zoom in, Minus to zoom out,
      Zero to reset view,
      H for help
    `;
    announce(helpText, 'polite');
  }, [announce]);

  // Canvas drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Apply transformations
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(scale, scale);

    // Draw cities
    problem.cities.forEach((city, index) => {
      const isSelected = city.id === selectedCity;
      const isFocused = city.id === focusedCity;
      
      // City circle
      ctx.beginPath();
      ctx.arc(city.x, city.y, isSelected ? 8 : 6, 0, 2 * Math.PI);
      ctx.fillStyle = isSelected ? '#ff6b6b' : isFocused ? '#4ecdc4' : '#45b7d1';
      ctx.fill();
      
      if (isFocused) {
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // City label
      ctx.fillStyle = '#2c3e50';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(city.name, city.x, city.y - 12);
    });

    // Draw route if available and visible
    if (solution && showRoute && solution.tour.length > 1) {
      ctx.strokeStyle = config.enableHighContrast ? '#ffff00' : '#e74c3c';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);

      ctx.beginPath();
      for (let i = 0; i < solution.tour.length; i++) {
        const cityId = solution.tour[i];
        const city = problem.cities.find(c => c.id === cityId);
        if (city) {
          if (i === 0) {
            ctx.moveTo(city.x, city.y);
          } else {
            ctx.lineTo(city.x, city.y);
          }
        }
      }
      
      // Close the route
      const firstCity = problem.cities.find(c => c.id === solution.tour[0]);
      if (firstCity) {
        ctx.lineTo(firstCity.x, firstCity.y);
      }
      
      ctx.stroke();
    }

    ctx.restore();
  }, [problem, solution, selectedCity, focusedCity, showRoute, scale, pan, config.enableHighContrast]);

  // Announce solution changes
  useEffect(() => {
    if (solution && config.enableScreenReaderSupport) {
      const routeDescription = `
        New route found with distance ${solution.distance.toFixed(1)} units,
        visiting ${solution.tour.length} cities
      `;
      announce(routeDescription, 'polite');
    }
  }, [solution, config.enableScreenReaderSupport, announce]);

  return (
    <Card className={`tsp-visualizer ${className}`}>
      <CardHeader>
        <CardTitle>
          TSP Visualization
          <span className="sr-only">
            {ScreenReader.describeVisualization('tsp', {
              cityCount: problem.cities.length,
              routeLength: solution?.tour.length
            })}
          </span>
        </CardTitle>
        <div className="tsp-controls">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleRouteVisibility}
            aria-pressed={showRoute}
            aria-label={`${showRoute ? 'Hide' : 'Show'} route visualization`}
          >
            {showRoute ? 'Hide Route' : 'Show Route'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom(1.2)}
            aria-label="Zoom in"
          >
            Zoom In (+)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom(0.8)}
            aria-label="Zoom out"
          >
            Zoom Out (-)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetView}
            aria-label="Reset view to default"
          >
            Reset View (0)
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div 
          ref={containerRef}
          className="tsp-container"
          role="application"
          aria-label={AriaLabels.tspCanvas(problem.cities.length, solution?.tour)}
          tabIndex={0}
        >
          {/* Canvas for visual representation */}
          <canvas
            ref={canvasRef}
            className="tsp-canvas"
            style={{ 
              width: '100%', 
              height: '400px',
              border: '1px solid #e1e5e9',
              borderRadius: '8px'
            }}
            aria-hidden="true"
          />
          
          {/* Accessible city buttons overlay */}
          <div className="city-buttons-overlay" aria-hidden={!config.enableKeyboardNavigation}>
            {problem.cities.map((city) => (
              <button
                key={city.id}
                data-city-id={city.id}
                className={`city-button ${selectedCity === city.id ? 'selected' : ''} ${focusedCity === city.id ? 'focused' : ''}`}
                style={{
                  position: 'absolute',
                  left: `${(city.x / 600) * 100}%`,
                  top: `${(city.y / 400) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: selectedCity === city.id ? '2px solid #e74c3c' : '1px solid #bdc3c7',
                  background: selectedCity === city.id ? '#e74c3c' : '#ecf0f1',
                  cursor: 'pointer',
                  zIndex: 10
                }}
                onClick={() => handleCityInteraction(city.id)}
                onFocus={() => setFocusedCity(city.id)}
                onBlur={() => setFocusedCity(null)}
                aria-label={AriaLabels.tspCity(city.id, city.name, city.x, city.y)}
                aria-pressed={selectedCity === city.id}
              >
                <span className="sr-only">{city.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Route information */}
        {solution && (
          <div className="route-info" role="region" aria-labelledby="route-info-title">
            <h3 id="route-info-title" className="sr-only">Route Information</h3>
            <div className="route-stats">
              <div className="stat">
                <span className="stat-label">Total Distance:</span>
                <span
                  className="stat-value"
                  aria-label={`Total route distance: ${solution.distance.toFixed(1)} units`}
                >
                  {solution.distance.toFixed(1)} units
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Cities Visited:</span>
                <span
                  className="stat-value"
                  aria-label={`Number of cities visited: ${solution.tour.length}`}
                >
                  {solution.tour.length}
                </span>
              </div>
            </div>
            
            {/* Route sequence */}
            <details className="route-sequence">
              <summary>Route Sequence</summary>
              <ol aria-label="City visit order">
                {solution.tour.map((cityId, index) => {
                  const city = problem.cities.find(c => c.id === cityId);
                  return (
                    <li key={index}>
                      <span aria-label={`Step ${index + 1}: ${city?.name}`}>
                        {city?.name}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </details>
          </div>
        )}
        
        {/* Loading state */}
        {isLoading && (
          <div 
            className="loading-overlay"
            role="status"
            aria-label={AriaLabels.loadingSpinner('TSP optimization')}
          >
            <div className="loading-spinner" aria-hidden="true" />
            <span className="loading-text">Optimizing route...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// CSS Styles for TSP Visualizer
export const tspVisualizerStyles = `
.tsp-visualizer {
  position: relative;
}

.tsp-controls {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.tsp-container {
  position: relative;
  width: 100%;
  height: 400px;
  outline: none;
}

.tsp-container:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

.tsp-canvas {
  display: block;
  touch-action: none;
}

.city-buttons-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.city-button {
  pointer-events: all;
  transition: all 0.2s ease;
}

.city-button:hover {
  transform: translate(-50%, -50%) scale(1.2);
}

.city-button:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.25);
}

.city-button.selected {
  background: #e74c3c !important;
  border-color: #c0392b !important;
  transform: translate(-50%, -50%) scale(1.3);
}

.city-button.focused {
  box-shadow: 0 0 0 4px rgba(78, 205, 196, 0.4);
}

.route-info {
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.route-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.route-sequence {
  margin-top: 16px;
}

.route-sequence summary {
  cursor: pointer;
  font-weight: 500;
  padding: 8px 0;
}

.route-sequence ol {
  margin: 8px 0 0 20px;
  padding: 0;
}

.route-sequence li {
  margin: 4px 0;
  padding: 4px 0;
  border-bottom: 1px solid #e9ecef;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e9ecef;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

.loading-text {
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* High contrast adjustments */
.high-contrast .tsp-canvas {
  border-color: var(--hc-fg, #fff) !important;
}

.high-contrast .city-button {
  background: var(--hc-bg, #000) !important;
  border-color: var(--hc-fg, #fff) !important;
  color: var(--hc-fg, #fff) !important;
}

.high-contrast .city-button.selected {
  background: var(--hc-primary, #ffff00) !important;
  color: var(--hc-bg, #000) !important;
}

.high-contrast .route-info {
  background: var(--hc-bg, #000) !important;
  border: 1px solid var(--hc-fg, #fff) !important;
}

/* Reduced motion adjustments */
.reduced-motion .city-button {
  transition: none !important;
}

.reduced-motion .loading-spinner {
  animation: none !important;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .tsp-controls {
    justify-content: center;
  }
  
  .route-stats {
    flex-direction: column;
    gap: 12px;
  }
  
  .city-button {
    width: 32px;
    height: 32px;
  }
}
`;