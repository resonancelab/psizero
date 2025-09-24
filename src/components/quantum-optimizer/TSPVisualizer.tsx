import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  MapPin,
  Route,
  Settings,
  Eye,
  EyeOff
} from "lucide-react";
import { City, TSPInstance, calculateDistance, calculateTourDistance } from "@/lib/optimization/tsp-generator";

interface TSPVisualizerProps {
  instance: TSPInstance;
  solution?: number[] | null;
  isOptimizing?: boolean;
  className?: string;
  onCityClick?: (city: City) => void;
}

interface ViewSettings {
  showCityNames: boolean;
  showDistances: boolean;
  showAllConnections: boolean;
  showSolutionTour: boolean;
  animationSpeed: number;
}

interface ViewState {
  scale: number;
  offsetX: number;
  offsetY: number;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

const TSPVisualizer: React.FC<TSPVisualizerProps> = ({
  instance,
  solution,
  isOptimizing = false,
  className = "",
  onCityClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredCity, setHoveredCity] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    showCityNames: true,
    showDistances: false,
    showAllConnections: false,
    showSolutionTour: true,
    animationSpeed: 1
  });

  // Calculate view bounds and initial scale
  const [viewState, setViewState] = useState<ViewState>(() => {
    const cities = instance.cities;
    if (cities.length === 0) {
      return {
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        bounds: { minX: 0, maxX: 800, minY: 0, maxY: 600 }
      };
    }

    const xs = cities.map(c => c.x);
    const ys = cities.map(c => c.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const padding = 50;
    const width = 800;
    const height = 600;

    const dataWidth = maxX - minX || 1;
    const dataHeight = maxY - minY || 1;
    const scaleX = (width - 2 * padding) / dataWidth;
    const scaleY = (height - 2 * padding) / dataHeight;
    const scale = Math.min(scaleX, scaleY, 2); // Limit max scale

    return {
      scale,
      offsetX: padding + (width - 2 * padding - dataWidth * scale) / 2 - minX * scale,
      offsetY: padding + (height - 2 * padding - dataHeight * scale) / 2 - minY * scale,
      bounds: { minX, maxX, minY, maxY }
    };
  });

  // Transform coordinates
  const transformX = (x: number) => x * viewState.scale + viewState.offsetX;
  const transformY = (y: number) => y * viewState.scale + viewState.offsetY;

  // Handle city click
  const handleCityClick = (city: City) => {
    setSelectedCity(selectedCity === city.id ? null : city.id);
    onCityClick?.(city);
  };

  // Animation control
  const startAnimation = () => {
    if (!solution) return;
    
    setIsAnimating(true);
    setAnimationProgress(0);
    
    const duration = 3000 / viewSettings.animationSpeed; // 3 seconds base duration
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setAnimationProgress(progress);
      
      if (progress < 1 && isAnimating) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    
    requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setAnimationProgress(0);
  };

  // Zoom controls
  const zoomIn = () => {
    setViewState(prev => ({
      ...prev,
      scale: Math.min(prev.scale * 1.2, 5)
    }));
  };

  const zoomOut = () => {
    setViewState(prev => ({
      ...prev,
      scale: Math.max(prev.scale / 1.2, 0.1)
    }));
  };

  // Render city connections (all edges)
  const renderAllConnections = () => {
    if (!viewSettings.showAllConnections) return null;

    const lines = [];
    for (let i = 0; i < instance.cities.length; i++) {
      for (let j = i + 1; j < instance.cities.length; j++) {
        const city1 = instance.cities[i];
        const city2 = instance.cities[j];
        const distance = instance.distanceMatrix[i][j];
        
        // Color based on distance (shorter = darker)
        const maxDistance = Math.max(...instance.distanceMatrix.flat());
        const opacity = 0.1 + (0.3 * (1 - distance / maxDistance));
        
        lines.push(
          <line
            key={`edge-${i}-${j}`}
            x1={transformX(city1.x)}
            y1={transformY(city1.y)}
            x2={transformX(city2.x)}
            y2={transformY(city2.y)}
            stroke="#cbd5e1"
            strokeWidth="1"
            opacity={opacity}
          />
        );
      }
    }
    return <g>{lines}</g>;
  };

  // Render solution tour
  const renderSolutionTour = () => {
    if (!solution || !viewSettings.showSolutionTour) return null;

    const tourLines = [];
    const animatedIndex = Math.floor(animationProgress * solution.length);
    
    for (let i = 0; i < solution.length; i++) {
      const fromIndex = solution[i];
      const toIndex = solution[(i + 1) % solution.length];
      const from = instance.cities[fromIndex];
      const to = instance.cities[toIndex];
      
      const isAnimated = isAnimating && i <= animatedIndex;
      const opacity = isAnimating ? (i <= animatedIndex ? 1 : 0.3) : 1;
      
      tourLines.push(
        <line
          key={`tour-${i}`}
          x1={transformX(from.x)}
          y1={transformY(from.y)}
          x2={transformX(to.x)}
          y2={transformY(to.y)}
          stroke="#3b82f6"
          strokeWidth="3"
          opacity={opacity}
          className={isAnimated ? "animate-pulse" : ""}
        />
      );
      
      // Add arrow markers for direction
      const midX = (transformX(from.x) + transformX(to.x)) / 2;
      const midY = (transformY(from.y) + transformY(to.y)) / 2;
      const angle = Math.atan2(transformY(to.y) - transformY(from.y), transformX(to.x) - transformX(from.x));
      
      tourLines.push(
        <polygon
          key={`arrow-${i}`}
          points={`${midX},${midY} ${midX - 8 * Math.cos(angle - 0.5)},${midY - 8 * Math.sin(angle - 0.5)} ${midX - 8 * Math.cos(angle + 0.5)},${midY - 8 * Math.sin(angle + 0.5)}`}
          fill="#3b82f6"
          opacity={opacity * 0.7}
        />
      );
    }
    
    return <g>{tourLines}</g>;
  };

  // Render cities
  const renderCities = () => {
    return instance.cities.map((city, index) => {
      const isHovered = hoveredCity === city.id;
      const isSelected = selectedCity === city.id;
      const isSolutionCity = solution?.includes(city.id);
      
      const radius = isSelected ? 12 : isHovered ? 10 : 8;
      const fill = isSelected ? "#ef4444" : isSolutionCity ? "#3b82f6" : "#64748b";
      const stroke = isHovered ? "#1e293b" : "#ffffff";
      const strokeWidth = isSelected ? 3 : 2;
      
      return (
        <g key={`city-${city.id}`}>
          <circle
            cx={transformX(city.x)}
            cy={transformY(city.y)}
            r={radius}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredCity(city.id)}
            onMouseLeave={() => setHoveredCity(null)}
            onClick={() => handleCityClick(city)}
          />
          
          {viewSettings.showCityNames && (
            <text
              x={transformX(city.x)}
              y={transformY(city.y) - radius - 5}
              textAnchor="middle"
              className="text-xs font-medium fill-gray-700 pointer-events-none"
              opacity={isHovered || isSelected ? 1 : 0.7}
            >
              {city.name}
            </text>
          )}
          
          {isHovered && viewSettings.showDistances && selectedCity !== null && selectedCity !== city.id && (
            <text
              x={transformX(city.x)}
              y={transformY(city.y) + radius + 15}
              textAnchor="middle"
              className="text-xs fill-gray-600 pointer-events-none"
            >
              {Math.round(instance.distanceMatrix[selectedCity][city.id])}
            </text>
          )}
        </g>
      );
    });
  };

  // Calculate tour statistics
  const tourStats = solution ? {
    distance: calculateTourDistance(solution, instance.distanceMatrix),
    cities: solution.length
  } : null;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {instance.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {instance.cities.length} cities
            </Badge>
            {tourStats && (
              <Badge className="bg-blue-100 text-blue-800">
                Distance: {Math.round(tourStats.distance)}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {/* Animation Controls */}
          {solution && (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={startAnimation}
                disabled={isOptimizing || isAnimating}
              >
                <Play className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={stopAnimation}
                disabled={!isAnimating}
              >
                <Pause className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={resetAnimation}
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" onClick={zoomIn}>
              <ZoomIn className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={zoomOut}>
              <ZoomOut className="h-3 w-3" />
            </Button>
          </div>
          
          {/* View Toggles */}
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={viewSettings.showCityNames ? "default" : "outline"}
              onClick={() => setViewSettings(prev => ({ ...prev, showCityNames: !prev.showCityNames }))}
            >
              Names
            </Button>
            <Button
              size="sm"
              variant={viewSettings.showAllConnections ? "default" : "outline"}
              onClick={() => setViewSettings(prev => ({ ...prev, showAllConnections: !prev.showAllConnections }))}
            >
              <Route className="h-3 w-3" />
            </Button>
            {solution && (
              <Button
                size="sm"
                variant={viewSettings.showSolutionTour ? "default" : "outline"}
                onClick={() => setViewSettings(prev => ({ ...prev, showSolutionTour: !prev.showSolutionTour }))}
              >
                Tour
              </Button>
            )}
          </div>
        </div>
        
        {/* Animation Speed Slider */}
        {solution && (
          <div className="flex items-center gap-4 mt-2">
            <span className="text-sm text-gray-600">Speed:</span>
            <Slider
              value={[viewSettings.animationSpeed]}
              onValueChange={([value]) => setViewSettings(prev => ({ ...prev, animationSpeed: value }))}
              min={0.5}
              max={3}
              step={0.5}
              className="w-24"
            />
            <span className="text-xs text-gray-500">{viewSettings.animationSpeed}x</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="relative bg-gray-50 rounded-lg overflow-hidden">
          <svg
            ref={svgRef}
            width="800"
            height="600"
            viewBox="0 0 800 600"
            className="w-full h-auto border"
          >
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* All connections */}
            {renderAllConnections()}
            
            {/* Solution tour */}
            {renderSolutionTour()}
            
            {/* Cities */}
            {renderCities()}
            
            {/* Loading overlay */}
            {isOptimizing && (
              <rect width="100%" height="100%" fill="rgba(255,255,255,0.8)">
                <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2s" repeatCount="indefinite" />
              </rect>
            )}
          </svg>
          
          {/* Info panel */}
          {(hoveredCity !== null || selectedCity !== null) && (
            <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border">
              {selectedCity !== null && (
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">
                    {instance.cities[selectedCity].name}
                  </h4>
                  <p className="text-xs text-gray-600">
                    Position: ({instance.cities[selectedCity].x}, {instance.cities[selectedCity].y})
                  </p>
                  {instance.cities[selectedCity].latitude && (
                    <p className="text-xs text-gray-600">
                      Coords: {instance.cities[selectedCity].latitude?.toFixed(2)}, {instance.cities[selectedCity].longitude?.toFixed(2)}
                    </p>
                  )}
                </div>
              )}
              
              {hoveredCity !== null && hoveredCity !== selectedCity && (
                <div className="text-xs text-gray-600">
                  Hover: {instance.cities[hoveredCity].name}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Statistics */}
        {tourStats && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-sm text-blue-900 mb-2">Tour Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Total Distance:</span>
                <span className="font-mono ml-2">{Math.round(tourStats.distance)}</span>
              </div>
              <div>
                <span className="text-blue-700">Cities Visited:</span>
                <span className="font-mono ml-2">{tourStats.cities}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TSPVisualizer;