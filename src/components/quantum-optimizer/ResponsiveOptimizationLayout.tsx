/**
 * Responsive Optimization Layout Component
 * Provides adaptive layouts for quantum optimization visualization on all device sizes
 */

import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Menu, 
  X, 
  Maximize2, 
  Minimize2,
  RotateCcw,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';

import { 
  useAdaptiveLayout,
  useDeviceInfo,
  useTouchGestures,
  useResponsiveCanvas,
  useMobilePerformance,
  getResponsiveGridCols,
  getResponsiveSpacing
} from '@/lib/quantum-optimizer/responsive-utils';

import type { OptimizationProblem, OptimizationSolution, SolutionQuality } from '@/lib/quantum-optimizer/types';

interface ResponsiveOptimizationLayoutProps {
  problem?: OptimizationProblem;
  solution?: OptimizationSolution;
  quality?: SolutionQuality;
  children: React.ReactNode;
  sidePanel?: React.ReactNode;
  controls?: React.ReactNode;
  onLayoutChange?: (layout: 'mobile' | 'tablet' | 'desktop') => void;
  className?: string;
}

type ViewMode = 'grid' | 'list' | 'fullscreen';
type PanelPosition = 'left' | 'right' | 'bottom';

export const ResponsiveOptimizationLayout: React.FC<ResponsiveOptimizationLayoutProps> = ({
  problem,
  solution,
  quality,
  children,
  sidePanel,
  controls,
  onLayoutChange,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { 
    deviceInfo, 
    isMobile, 
    isTablet, 
    isDesktop,
    getLayoutClasses,
    getCardLayout,
    getButtonSize,
    getModalSize
  } = useAdaptiveLayout();
  
  const { shouldReduceAnimations, throttle, debounce } = useMobilePerformance();
  const canvasSize = useResponsiveCanvas(containerRef);
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [panelPosition, setPanelPosition] = useState<PanelPosition>('right');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('visualization');

  // Adapt layout based on device changes
  useEffect(() => {
    if (isMobile) {
      setViewMode('list');
      setPanelPosition('bottom');
      onLayoutChange?.('mobile');
    } else if (isTablet) {
      setViewMode('grid');
      setPanelPosition('bottom');
      onLayoutChange?.('tablet');
    } else {
      setViewMode('grid');
      setPanelPosition('right');
      onLayoutChange?.('desktop');
    }
  }, [isMobile, isTablet, isDesktop, onLayoutChange]);

  // Touch gestures for mobile navigation
  const { isGesturing } = useTouchGestures(containerRef, (gesture) => {
    if (gesture.type === 'swipe' && Math.abs(gesture.deltaX) > 50) {
      if (gesture.deltaX > 0 && activeTab !== 'visualization') {
        // Swipe right - go to previous tab
        const tabs = ['visualization', 'metrics', 'controls'];
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex > 0) {
          setActiveTab(tabs[currentIndex - 1]);
        }
      } else if (gesture.deltaX < 0 && activeTab !== 'controls') {
        // Swipe left - go to next tab
        const tabs = ['visualization', 'metrics', 'controls'];
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex < tabs.length - 1) {
          setActiveTab(tabs[currentIndex + 1]);
        }
      }
    }
  });

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleViewMode = () => {
    if (isMobile) return; // Fixed view mode on mobile
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  const getDeviceIcon = () => {
    if (isMobile) return <Smartphone className="h-4 w-4" />;
    if (isTablet) return <Tablet className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  const throttledLayoutUpdate = throttle(() => {
    // Handle layout updates for better mobile performance
  }, 100);

  const debouncedResize = debounce(() => {
    throttledLayoutUpdate();
  }, 250);

  useEffect(() => {
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, [debouncedResize]);

  // Mobile layout
  if (isMobile) {
    return (
      <div className={`min-h-screen bg-background ${className}`} ref={containerRef}>
        {/* Mobile Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              {getDeviceIcon()}
              <Badge variant="secondary" className="text-xs">
                {deviceInfo.width}x{deviceInfo.height}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="h-8 w-8 p-0"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              
              <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Controls</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowMobileMenu(false)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <ScrollArea className="h-[calc(100vh-120px)]">
                      <div className="space-y-4">
                        {controls && (
                          <div>
                            <h4 className="font-medium mb-2">Problem Controls</h4>
                            {controls}
                          </div>
                        )}
                        
                        {sidePanel && (
                          <div>
                            <h4 className="font-medium mb-2">Information</h4>
                            {sidePanel}
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className={`${isFullscreen ? 'fixed inset-0 z-40 bg-background' : ''}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 sticky top-[73px] z-30 bg-background m-2">
              <TabsTrigger value="visualization" className="text-xs">
                Visualization
              </TabsTrigger>
              <TabsTrigger value="metrics" className="text-xs">
                Metrics
              </TabsTrigger>
              <TabsTrigger value="controls" className="text-xs">
                Controls
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="visualization" className="p-4 mt-0">
              <Card>
                <CardContent className="p-4">
                  <div 
                    style={{ 
                      width: canvasSize.width, 
                      height: canvasSize.height,
                      maxWidth: '100%'
                    }}
                  >
                    {children}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="metrics" className="p-4 mt-0">
              {quality && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Solution Quality</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-muted-foreground">Score</div>
                        <div className="font-semibold">{(quality.score * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Valid</div>
                        <div className="font-semibold">{quality.isValid ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {problem && (
                <Card className="mt-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Problem Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <div><span className="text-muted-foreground">Name:</span> {problem.name}</div>
                      <div><span className="text-muted-foreground">Difficulty:</span> {problem.difficulty}</div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="controls" className="p-4 mt-0">
              <div className="space-y-4">
                {controls || (
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center text-muted-foreground">
                        No controls available
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Tablet layout
  if (isTablet) {
    return (
      <div className={`min-h-screen bg-background ${className}`} ref={containerRef}>
        {/* Tablet Header */}
        <div className="border-b bg-background">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {getDeviceIcon()}
              <Badge variant="secondary">
                Tablet Mode ({deviceInfo.width}x{deviceInfo.height})
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleViewMode}
                className="flex items-center gap-2"
              >
                {viewMode === 'grid' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
                {viewMode === 'grid' ? 'Grid' : 'List'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="flex items-center gap-2"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                {isFullscreen ? 'Exit' : 'Fullscreen'}
              </Button>
            </div>
          </div>
        </div>

        {/* Tablet Content */}
        <div className={`${isFullscreen ? 'fixed inset-0 z-40 bg-background pt-16' : 'p-4'}`}>
          <div className={getLayoutClasses(
            'flex flex-col space-y-4',
            'grid grid-cols-1 gap-4',
            'grid grid-cols-2 gap-6'
          )}>
            {/* Main visualization */}
            <Card className="col-span-full">
              <CardContent className="p-4">
                <div 
                  style={{ 
                    width: canvasSize.width, 
                    height: canvasSize.height,
                    margin: '0 auto'
                  }}
                >
                  {children}
                </div>
              </CardContent>
            </Card>

            {/* Side panels in tablet grid */}
            {(controls || sidePanel) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-full">
                {controls && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Controls</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {controls}
                    </CardContent>
                  </Card>
                )}
                
                {sidePanel && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {sidePanel}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className={`min-h-screen bg-background ${className}`} ref={containerRef}>
      {/* Desktop Header */}
      <div className="border-b bg-background">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {getDeviceIcon()}
            <Badge variant="secondary">
              Desktop Mode ({deviceInfo.width}x{deviceInfo.height})
            </Badge>
            {shouldReduceAnimations && (
              <Badge variant="outline" className="text-xs">
                Reduced Animations
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleViewMode}
              className="flex items-center gap-2"
            >
              {viewMode === 'grid' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
              {viewMode}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="flex items-center gap-2"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Content */}
      <div className={`${isFullscreen ? 'fixed inset-0 z-40 bg-background pt-16' : 'p-6'}`}>
        <div className="grid grid-cols-12 gap-6 h-full">
          {/* Main visualization area */}
          <div className={sidePanel ? 'col-span-8' : 'col-span-12'}>
            <Card className="h-full">
              <CardContent className="p-6">
                <div 
                  style={{ 
                    width: canvasSize.width, 
                    height: canvasSize.height,
                    margin: '0 auto'
                  }}
                >
                  {children}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side panel */}
          {sidePanel && (
            <div className="col-span-4 space-y-4">
              {controls && (
                <Card>
                  <CardHeader>
                    <CardTitle>Controls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {controls}
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    {sidePanel}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveOptimizationLayout;