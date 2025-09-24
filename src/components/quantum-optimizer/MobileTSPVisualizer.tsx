/**
 * Mobile-Optimized TSP Visualizer Component
 * Provides touch-friendly TSP visualization with responsive design
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Move,
  Maximize2,
  Info,
  MapPin,
  Route,
  Target
} from 'lucide-react';

import { 
  useDeviceInfo,
  useTouchGestures,
  useResponsiveCanvas,
  useMobilePerformance,
  type TouchGesture
} from '@/lib/quantum-optimizer/responsive-utils';

import type { TSPProblem, TSPSolution, City } from '@/lib/quantum-optimizer/types';

interface MobileTSPVisualizerProps {
  problem: TSPProblem;
  solution?: TSPSolution;
  onCitySelect?: (cityId: number) => void;
  onTourComplete?: (tour: number[]) => void;
  className?: string;
}

interface ViewState {
  zoom: number;
  panX: number;
  panY: number;
  rotation: number;
}

export const MobileTSPVisualizer: React.FC<MobileTSPVisualizerProps> = ({
  problem,
  solution,
  onCitySelect,
  onTourComplete,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const deviceInfo = useDeviceInfo();
  const canvasSize = useResponsiveCanvas(containerRef, 4/3); // Square-ish for mobile
  const { shouldReduceAnimations, throttle } = useMobilePerformance();

  const [viewState, setViewState] = useState<ViewState>({
    zoom: 1,
    panX: 0,
    panY: 0,
    rotation: 0
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [showTourInfo, setShowTourInfo] = useState(false);

  // Touch gesture handling for mobile interaction
  const { isGesturing } = useTouchGestures(canvasRef, handleGesture);

  function handleGesture(gesture: TouchGesture) {
    switch (gesture.type) {
      case 'tap':
        handleCanvasTap(gesture.currentPoint.x, gesture.currentPoint.y);
        break;
      case 'double-tap':
        handleZoomToFit();
        break;
      case 'pan':
        handlePan(gesture.deltaX, gesture.deltaY);
        break;
      case 'pinch':
        if (gesture.scale) {
          handleZoom(gesture.scale);
        }
        break;
      case 'long-press':
        handleLongPress(gesture.currentPoint.x, gesture.currentPoint.y);
        break;
    }
  }

  const handleCanvasTap = useCallback((x: number, y: number) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const canvasX = x - rect.left;
    const canvasY = y - rect.top;

    // Transform screen coordinates to world coordinates
    const worldX = (canvasX - viewState.panX) / viewState.zoom;
    const worldY = (canvasY - viewState.panY) / viewState.zoom;

    // Find closest city
    let closestCity = -1;
    let closestDistance = Infinity;
    const touchRadius = 30 / viewState.zoom; // Adjust touch target for zoom

    problem.cities.forEach((city, index) => {
      const distance = Math.sqrt(
        Math.pow(worldX - city.x, 2) + Math.pow(worldY - city.y, 2)
      );
      if (distance < touchRadius && distance < closestDistance) {
        closestDistance = distance;
        closestCity = index;
      }
    });

    if (closestCity !== -1) {
      setSelectedCity(closestCity);
      onCitySelect?.(closestCity);
    } else {
      setSelectedCity(null);
    }
  }, [viewState, problem.cities, onCitySelect]);

  const handleLongPress = useCallback((x: number, y: number) => {
    setShowTourInfo(true);
    setTimeout(() => setShowTourInfo(false), 2000);
  }, []);

  const handlePan = throttle((deltaX: number, deltaY: number) => {
    setViewState(prev => ({
      ...prev,
      panX: prev.panX + deltaX,
      panY: prev.panY + deltaY
    }));
  }, 16); // ~60fps

  const handleZoom = (scale: number) => {
    setViewState(prev => ({
      ...prev,
      zoom: Math.max(0.5, Math.min(5, prev.zoom * scale))
    }));
  };

  const handleZoomToFit = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const padding = 40;
    
    // Calculate bounding box of all cities
    const minX = Math.min(...problem.cities.map(c => c.x));
    const maxX = Math.max(...problem.cities.map(c => c.x));
    const minY = Math.min(...problem.cities.map(c => c.y));
    const maxY = Math.max(...problem.cities.map(c => c.y));
    
    const width = maxX - minX;
    const height = maxY - minY;
    
    const zoomX = (canvas.width - padding * 2) / width;
    const zoomY = (canvas.height - padding * 2) / height;
    const zoom = Math.min(zoomX, zoomY);
    
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    setViewState({
      zoom,
      panX: canvas.width / 2 - centerX * zoom,
      panY: canvas.height / 2 - centerY * zoom,
      rotation: 0
    });
  };

  // Rendering logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply transforms
    ctx.save();
    ctx.translate(viewState.panX, viewState.panY);
    ctx.scale(viewState.zoom, viewState.zoom);
    ctx.rotate(viewState.rotation);

    // Draw tour path if solution exists
    if (solution && solution.tour.length > 0) {
      ctx.strokeStyle = deviceInfo.type === 'mobile' ? '#3b82f6' : '#2563eb';
      ctx.lineWidth = deviceInfo.type === 'mobile' ? 3 : 2;
      ctx.setLineDash([]);
      ctx.beginPath();

      for (let i = 0; i < solution.tour.length; i++) {
        const cityIndex = solution.tour[i];
        const city = problem.cities[cityIndex];
        
        if (i === 0) {
          ctx.moveTo(city.x, city.y);
        } else {
          ctx.lineTo(city.x, city.y);
        }
      }

      // Close the tour
      if (solution.tour.length > 0) {
        const firstCity = problem.cities[solution.tour[0]];
        ctx.lineTo(firstCity.x, firstCity.y);
      }

      ctx.stroke();
    }

    // Draw cities
    problem.cities.forEach((city, index) => {
      const isSelected = selectedCity === index;
      const isStart = solution && solution.tour[0] === index;
      
      // City circle
      ctx.beginPath();
      ctx.arc(city.x, city.y, isSelected ? 12 : 8, 0, 2 * Math.PI);
      
      if (isStart) {
        ctx.fillStyle = '#10b981';
      } else if (isSelected) {
        ctx.fillStyle = '#f59e0b';
      } else {
        ctx.fillStyle = '#6b7280';
      }
      
      ctx.fill();
      
      // City border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // City label for mobile (only show if not too zoomed out)
      if (deviceInfo.type === 'mobile' && viewState.zoom > 0.8) {
        ctx.fillStyle = '#1f2937';
        ctx.font = '12px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(city.name, city.x, city.y - 15);
      }
    });

    ctx.restore();
  }, [problem, solution, viewState, selectedCity, deviceInfo, canvasSize]);

  // Auto-fit on mount
  useEffect(() => {
    setTimeout(handleZoomToFit, 100);
  }, [problem]);

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
    // Animation logic would go here
  };

  const resetView = () => {
    handleZoomToFit();
    setSelectedCity(null);
  };

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg">
              TSP Visualization
            </CardTitle>
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="text-xs">
                {problem.cities.length} cities
              </Badge>
              {deviceInfo.type === 'mobile' && (
                <Badge variant="outline" className="text-xs">
                  Touch
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Mobile-optimized controls */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAnimation}
              className="flex-1 min-w-0"
            >
              {isPlaying ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetView}
              className="flex-1 min-w-0"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoom(1.2)}
              className="px-3"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoom(0.8)}
              className="px-3"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Canvas container */}
          <div className="relative bg-white rounded-lg border overflow-hidden">
            <canvas
              ref={canvasRef}
              className="block touch-none"
              style={{
                width: '100%',
                height: 'auto',
                cursor: isGesturing ? 'grabbing' : 'grab'
              }}
            />
            
            {/* Touch instructions overlay */}
            {deviceInfo.type === 'mobile' && !isGesturing && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="bg-black/50 text-white text-xs px-3 py-2 rounded-full backdrop-blur-sm">
                  Tap cities • Double-tap to zoom • Pinch to zoom • Drag to pan
                </div>
              </div>
            )}

            {/* Tour info overlay */}
            {showTourInfo && solution && (
              <div className="absolute top-4 left-4 right-4 bg-black/80 text-white p-3 rounded-lg">
                <div className="text-sm font-medium">Tour Information</div>
                <div className="text-xs mt-1">
                  Distance: {solution.distance.toFixed(2)} units
                </div>
                <div className="text-xs">
                  Method: {solution.method}
                </div>
              </div>
            )}

            {/* Selected city info */}
            {selectedCity !== null && (
              <div className="absolute bottom-4 left-4 right-4 bg-white border rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {problem.cities[selectedCity].name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Position: ({problem.cities[selectedCity].x.toFixed(0)}, {problem.cities[selectedCity].y.toFixed(0)})
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCity(null)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile-specific solution info */}
          {solution && (
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Distance</div>
                  <div className="font-semibold">{solution.distance.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Method</div>
                  <div className="font-semibold capitalize">{solution.method}</div>
                </div>
              </div>
            </div>
          )}

          {/* Touch gesture instructions for mobile */}
          {deviceInfo.type === 'mobile' && (
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Tap a city to select it</div>
              <div>• Double-tap to zoom to fit</div>
              <div>• Pinch to zoom in/out</div>
              <div>• Drag to pan around</div>
              <div>• Long press for tour info</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileTSPVisualizer;