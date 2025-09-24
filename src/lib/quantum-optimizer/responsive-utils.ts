/**
 * Responsive Design Utilities for Quantum Optimization Components
 * Provides responsive layouts, touch handling, and mobile-optimized interactions
 */

import { useCallback, useEffect, useState } from 'react';

// Breakpoint definitions following Tailwind CSS conventions
export const BREAKPOINTS = {
  sm: 640,   // Small devices (landscape phones)
  md: 768,   // Medium devices (tablets)
  lg: 1024,  // Large devices (laptops)
  xl: 1280,  // Extra large devices (desktops)
  '2xl': 1536 // 2X large devices (large desktops)
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

// Device type detection
export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  isTouch: boolean;
  pixelRatio: number;
}

/**
 * Hook for responsive breakpoint detection
 */
export const useBreakpoint = (breakpoint: BreakpointKey): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${BREAKPOINTS[breakpoint]}px)`);
    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [breakpoint]);

  return matches;
};

/**
 * Hook for device information detection
 */
export const useDeviceInfo = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: 'desktop',
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    orientation: 'landscape',
    isTouch: false,
    pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const orientation = width > height ? 'landscape' : 'portrait';
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      let type: DeviceInfo['type'] = 'desktop';
      if (width < BREAKPOINTS.md) {
        type = 'mobile';
      } else if (width < BREAKPOINTS.lg) {
        type = 'tablet';
      }

      setDeviceInfo({
        type,
        width,
        height,
        orientation,
        isTouch,
        pixelRatio: window.devicePixelRatio
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
};

/**
 * Hook for responsive canvas sizing
 */
export const useResponsiveCanvas = (
  containerRef: React.RefObject<HTMLElement>,
  aspectRatio: number = 16 / 9
) => {
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 450 });
  const deviceInfo = useDeviceInfo();

  useEffect(() => {
    const updateCanvasSize = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const maxWidth = containerRect.width - 32; // Account for padding
      
      let width: number;
      let height: number;

      if (deviceInfo.type === 'mobile') {
        // On mobile, use full container width with adjusted aspect ratio
        width = Math.min(maxWidth, 400);
        height = deviceInfo.orientation === 'portrait' 
          ? width / (4 / 3) // More square for portrait
          : width / aspectRatio;
      } else if (deviceInfo.type === 'tablet') {
        width = Math.min(maxWidth, 600);
        height = width / aspectRatio;
      } else {
        width = Math.min(maxWidth, 800);
        height = width / aspectRatio;
      }

      // Ensure minimum sizes for usability
      width = Math.max(width, 300);
      height = Math.max(height, 200);

      setCanvasSize({ width: Math.floor(width), height: Math.floor(height) });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [containerRef, aspectRatio, deviceInfo]);

  return canvasSize;
};

/**
 * Touch gesture handling utilities
 */
export interface TouchGesture {
  type: 'tap' | 'double-tap' | 'long-press' | 'swipe' | 'pinch' | 'pan';
  startPoint: { x: number; y: number };
  currentPoint: { x: number; y: number };
  deltaX: number;
  deltaY: number;
  distance: number;
  scale?: number;
  velocity?: number;
}

export const useTouchGestures = (
  elementRef: React.RefObject<HTMLElement>,
  onGesture?: (gesture: TouchGesture) => void
) => {
  const [isGesturing, setIsGesturing] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !onGesture) return;

    let touchStartTime = 0;
    let touchStartPoint = { x: 0, y: 0 };
    let lastTouchPoint = { x: 0, y: 0 };
    let tapCount = 0;
    let tapTimer: NodeJS.Timeout;

    const getTouchPoint = (touch: Touch) => ({
      x: touch.clientX,
      y: touch.clientY
    });

    const calculateDistance = (point1: { x: number; y: number }, point2: { x: number; y: number }) => {
      const dx = point2.x - point1.x;
      const dy = point2.y - point1.y;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        touchStartTime = Date.now();
        touchStartPoint = getTouchPoint(event.touches[0]);
        lastTouchPoint = touchStartPoint;
        setIsGesturing(true);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 1 && isGesturing) {
        const currentPoint = getTouchPoint(event.touches[0]);
        const deltaX = currentPoint.x - touchStartPoint.x;
        const deltaY = currentPoint.y - touchStartPoint.y;
        const distance = calculateDistance(touchStartPoint, currentPoint);

        if (distance > 10) { // Minimum distance for pan/swipe
          onGesture({
            type: 'pan',
            startPoint: touchStartPoint,
            currentPoint,
            deltaX,
            deltaY,
            distance
          });
        }

        lastTouchPoint = currentPoint;
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (event.changedTouches.length === 1) {
        const touchDuration = Date.now() - touchStartTime;
        const endPoint = getTouchPoint(event.changedTouches[0]);
        const distance = calculateDistance(touchStartPoint, endPoint);
        
        setIsGesturing(false);

        if (distance < 10) { // Considered a tap
          if (touchDuration > 500) {
            // Long press
            onGesture({
              type: 'long-press',
              startPoint: touchStartPoint,
              currentPoint: endPoint,
              deltaX: 0,
              deltaY: 0,
              distance
            });
          } else {
            // Tap or double tap
            tapCount++;
            
            if (tapCount === 1) {
              tapTimer = setTimeout(() => {
                onGesture({
                  type: 'tap',
                  startPoint: touchStartPoint,
                  currentPoint: endPoint,
                  deltaX: 0,
                  deltaY: 0,
                  distance
                });
                tapCount = 0;
              }, 300);
            } else if (tapCount === 2) {
              clearTimeout(tapTimer);
              onGesture({
                type: 'double-tap',
                startPoint: touchStartPoint,
                currentPoint: endPoint,
                deltaX: 0,
                deltaY: 0,
                distance
              });
              tapCount = 0;
            }
          }
        } else if (touchDuration < 300) {
          // Swipe gesture
          const deltaX = endPoint.x - touchStartPoint.x;
          const deltaY = endPoint.y - touchStartPoint.y;
          const velocity = distance / touchDuration;

          onGesture({
            type: 'swipe',
            startPoint: touchStartPoint,
            currentPoint: endPoint,
            deltaX,
            deltaY,
            distance,
            velocity
          });
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      if (tapTimer) clearTimeout(tapTimer);
    };
  }, [elementRef, onGesture, isGesturing]);

  return { isGesturing };
};

/**
 * Responsive grid utilities
 */
export const getResponsiveGridCols = (deviceType: DeviceInfo['type']): number => {
  switch (deviceType) {
    case 'mobile': return 1;
    case 'tablet': return 2;
    default: return 3;
  }
};

export const getResponsiveSpacing = (deviceType: DeviceInfo['type']): string => {
  switch (deviceType) {
    case 'mobile': return 'space-y-3';
    case 'tablet': return 'space-y-4';
    default: return 'space-y-6';
  }
};

/**
 * Mobile-optimized component sizing
 */
export const getMobileOptimizedSize = (
  baseSize: number,
  deviceType: DeviceInfo['type'],
  sizeType: 'font' | 'padding' | 'margin' | 'width' | 'height' = 'width'
): number => {
  const scaleFactor = deviceType === 'mobile' ? 0.8 : deviceType === 'tablet' ? 0.9 : 1;
  
  if (sizeType === 'font') {
    return Math.max(baseSize * scaleFactor, 12); // Minimum readable font size
  }
  
  if (sizeType === 'padding' || sizeType === 'margin') {
    return Math.max(baseSize * scaleFactor, 8); // Minimum touch target
  }
  
  return baseSize * scaleFactor;
};

/**
 * Adaptive layout utilities
 */
export const useAdaptiveLayout = () => {
  const deviceInfo = useDeviceInfo();
  const isMobile = deviceInfo.type === 'mobile';
  const isTablet = deviceInfo.type === 'tablet';
  const isDesktop = deviceInfo.type === 'desktop';

  const getLayoutClasses = useCallback((
    mobileClasses: string,
    tabletClasses: string,
    desktopClasses: string
  ): string => {
    if (isMobile) return mobileClasses;
    if (isTablet) return tabletClasses;
    return desktopClasses;
  }, [isMobile, isTablet, isDesktop]);

  const getCardLayout = useCallback(() => {
    return getLayoutClasses(
      'grid grid-cols-1 gap-3 p-3', // Mobile: single column, compact
      'grid grid-cols-2 gap-4 p-4', // Tablet: two columns
      'grid grid-cols-3 gap-6 p-6'  // Desktop: three columns
    );
  }, [getLayoutClasses]);

  const getButtonSize = useCallback(() => {
    return getLayoutClasses(
      'h-12 px-4 text-sm', // Mobile: larger touch targets
      'h-10 px-4 text-sm', // Tablet: medium
      'h-9 px-3 text-sm'   // Desktop: compact
    );
  }, [getLayoutClasses]);

  const getModalSize = useCallback(() => {
    return getLayoutClasses(
      'max-w-sm mx-4',     // Mobile: smaller, with margins
      'max-w-md mx-6',     // Tablet: medium
      'max-w-2xl mx-auto'  // Desktop: large, centered
    );
  }, [getLayoutClasses]);

  return {
    deviceInfo,
    isMobile,
    isTablet,
    isDesktop,
    getLayoutClasses,
    getCardLayout,
    getButtonSize,
    getModalSize
  };
};

/**
 * Performance utilities for mobile devices
 */
export const useMobilePerformance = () => {
  const deviceInfo = useDeviceInfo();
  
  // Reduce animation complexity on mobile devices
  const shouldReduceAnimations = deviceInfo.type === 'mobile' || deviceInfo.pixelRatio > 2;
  
  // Throttle functions for better mobile performance
  const throttle = useCallback(<T extends (...args: Parameters<T>) => ReturnType<T>>(
    func: T,
    limit: number
  ): T => {
    let inThrottle: boolean;
    return ((...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  }, []);

  // Debounce functions for mobile input handling
  const debounce = useCallback(<T extends (...args: Parameters<T>) => ReturnType<T>>(
    func: T,
    delay: number
  ): T => {
    let timeoutId: NodeJS.Timeout;
    return ((...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    }) as T;
  }, []);

  return {
    shouldReduceAnimations,
    throttle,
    debounce,
    isMobile: deviceInfo.type === 'mobile',
    isHighDPI: deviceInfo.pixelRatio > 1.5
  };
};

/**
 * Responsive text utilities
 */
export const getResponsiveTextSize = (deviceType: DeviceInfo['type']) => {
  switch (deviceType) {
    case 'mobile':
      return {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl'
      };
    case 'tablet':
      return {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl'
      };
    default:
      return {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-3xl'
      };
  }
};

export default {
  BREAKPOINTS,
  useBreakpoint,
  useDeviceInfo,
  useResponsiveCanvas,
  useTouchGestures,
  useAdaptiveLayout,
  useMobilePerformance,
  getResponsiveGridCols,
  getResponsiveSpacing,
  getMobileOptimizedSize,
  getResponsiveTextSize
};