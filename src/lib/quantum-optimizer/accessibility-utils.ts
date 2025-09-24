/**
 * Accessibility Utilities for Quantum Optimization Components
 * Provides ARIA labels, keyboard navigation, and screen reader support
 */

import { useEffect, useState, useCallback, useRef } from 'react';

// Type definitions for visualization data
export interface TSPVisualizationData {
  cityCount: number;
  routeLength?: number;
}

export interface ChartVisualizationData {
  chartType: string;
  dataPoints: number;
  xAxis: string;
  yAxis: string;
}

export interface QualityGaugeData {
  current: number;
  maximum: number;
}

export interface ProgressData {
  percentage: number;
  status: string;
}

export type VisualizationData =
  | TSPVisualizationData
  | ChartVisualizationData
  | QualityGaugeData
  | ProgressData;

// ARIA live region announcements
export type AnnouncementType = 'polite' | 'assertive' | 'off';

export interface AccessibilityConfig {
  enableKeyboardNavigation: boolean;
  enableScreenReaderSupport: boolean;
  enableHighContrast: boolean;
  enableReducedMotion: boolean;
  announcements: AnnouncementType;
}

/**
 * Hook for managing accessibility announcements
 */
export function useAnnouncements() {
  const [announcement, setAnnouncement] = useState('');
  const [announcementType, setAnnouncementType] = useState<AnnouncementType>('polite');

  const announce = useCallback((message: string, type: AnnouncementType = 'polite') => {
    setAnnouncement(message);
    setAnnouncementType(type);
    
    // Clear announcement after a short delay to allow for re-announcement of same message
    setTimeout(() => setAnnouncement(''), 100);
  }, []);

  return {
    announcement,
    announcementType,
    announce
  };
}

/**
 * Hook for keyboard navigation support
 */
export function useKeyboardNavigation(
  containerRef: React.RefObject<HTMLElement>,
  options: {
    enableArrowKeys?: boolean;
    enableTabTrapping?: boolean;
    onKeyAction?: (key: string, element: HTMLElement) => void;
  } = {}
) {
  const { enableArrowKeys = true, enableTabTrapping = false, onKeyAction } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const currentIndex = Array.from(focusableElements).indexOf(target);

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          if (enableArrowKeys && currentIndex < focusableElements.length - 1) {
            event.preventDefault();
            focusableElements[currentIndex + 1].focus();
            onKeyAction?.(event.key, focusableElements[currentIndex + 1]);
          }
          break;

        case 'ArrowUp':
        case 'ArrowLeft':
          if (enableArrowKeys && currentIndex > 0) {
            event.preventDefault();
            focusableElements[currentIndex - 1].focus();
            onKeyAction?.(event.key, focusableElements[currentIndex - 1]);
          }
          break;

        case 'Home':
          if (enableArrowKeys && focusableElements.length > 0) {
            event.preventDefault();
            focusableElements[0].focus();
            onKeyAction?.(event.key, focusableElements[0]);
          }
          break;

        case 'End':
          if (enableArrowKeys && focusableElements.length > 0) {
            event.preventDefault();
            focusableElements[focusableElements.length - 1].focus();
            onKeyAction?.(event.key, focusableElements[focusableElements.length - 1]);
          }
          break;

        case 'Tab':
          if (enableTabTrapping) {
            if (event.shiftKey) {
              if (currentIndex === 0) {
                event.preventDefault();
                focusableElements[focusableElements.length - 1].focus();
              }
            } else {
              if (currentIndex === focusableElements.length - 1) {
                event.preventDefault();
                focusableElements[0].focus();
              }
            }
          }
          break;

        case 'Escape':
          target.blur();
          onKeyAction?.(event.key, target);
          break;

        default:
          onKeyAction?.(event.key, target);
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, enableArrowKeys, enableTabTrapping, onKeyAction]);
}

/**
 * Hook for focus management
 */
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const trapFocus = useCallback((element: HTMLElement) => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    element.focus();
    setFocusedElement(element);
  }, []);

  const releaseFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
    setFocusedElement(null);
  }, []);

  const moveFocus = useCallback((direction: 'next' | 'previous' | 'first' | 'last') => {
    const focusableElements = document.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as HTMLElement);

    let nextIndex = currentIndex;
    switch (direction) {
      case 'next':
        nextIndex = (currentIndex + 1) % focusableElements.length;
        break;
      case 'previous':
        nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
        break;
      case 'first':
        nextIndex = 0;
        break;
      case 'last':
        nextIndex = focusableElements.length - 1;
        break;
    }

    if (focusableElements[nextIndex]) {
      focusableElements[nextIndex].focus();
      setFocusedElement(focusableElements[nextIndex]);
    }
  }, []);

  return {
    focusedElement,
    trapFocus,
    releaseFocus,
    moveFocus
  };
}

/**
 * Hook for detecting user accessibility preferences
 */
export function useAccessibilityPreferences(): AccessibilityConfig {
  const [config, setConfig] = useState<AccessibilityConfig>({
    enableKeyboardNavigation: true,
    enableScreenReaderSupport: true,
    enableHighContrast: false,
    enableReducedMotion: false,
    announcements: 'polite'
  });

  useEffect(() => {
    // Detect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Detect high contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

    setConfig(prev => ({
      ...prev,
      enableReducedMotion: prefersReducedMotion,
      enableHighContrast: prefersHighContrast
    }));

    // Listen for changes
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setConfig(prev => ({ ...prev, enableReducedMotion: e.matches }));
    };

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setConfig(prev => ({ ...prev, enableHighContrast: e.matches }));
    };

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
    highContrastQuery.addEventListener('change', handleHighContrastChange);

    return () => {
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      highContrastQuery.removeEventListener('change', handleHighContrastChange);
    };
  }, []);

  return config;
}

/**
 * ARIA label generators for different component types
 */
export const AriaLabels = {
  // TSP Visualizer
  tspCanvas: (cityCount: number, currentTour?: number[]) => 
    `TSP visualization with ${cityCount} cities${currentTour ? `, current tour length ${currentTour.length}` : ''}`,
  
  tspCity: (cityId: number, cityName: string, x: number, y: number) =>
    `City ${cityName} (ID: ${cityId}) at coordinates ${x.toFixed(0)}, ${y.toFixed(0)}`,
  
  tspRoute: (from: string, to: string, distance: number) =>
    `Route from ${from} to ${to}, distance ${distance.toFixed(1)}`,

  // Problem Configuration
  problemTypeSelector: (currentType: string) =>
    `Problem type selector, currently selected: ${currentType}`,
  
  difficultySlider: (difficulty: string, value: number) =>
    `Difficulty slider: ${difficulty} level, value ${value}`,
  
  parameterInput: (parameter: string, value: number | string, unit?: string) =>
    `${parameter} input, current value: ${value}${unit ? ` ${unit}` : ''}`,

  // Performance Dashboard
  performanceChart: (chartType: string, dataPoints: number) =>
    `${chartType} chart with ${dataPoints} data points showing algorithm performance comparison`,
  
  performanceMetric: (metric: string, value: number, unit?: string) =>
    `${metric}: ${value.toFixed(2)}${unit ? ` ${unit}` : ''}`,
  
  benchmarkProgress: (current: number, total: number, percentage: number) =>
    `Benchmark progress: ${current} of ${total} tests completed, ${percentage.toFixed(1)}% done`,

  // Solution Quality
  qualityGauge: (quality: number, maxQuality: number) =>
    `Solution quality gauge: ${quality.toFixed(1)} out of ${maxQuality.toFixed(1)}`,
  
  qualityHistory: (historyLength: number, trend: 'improving' | 'declining' | 'stable') =>
    `Quality history with ${historyLength} data points, trend: ${trend}`,

  // Algorithm Status
  algorithmStatus: (algorithm: string, status: 'running' | 'completed' | 'failed' | 'idle') =>
    `${algorithm} algorithm status: ${status}`,
  
  iterationCounter: (current: number, total?: number) =>
    `Iteration ${current}${total ? ` of ${total}` : ''}`,

  // Data Export
  exportButton: (format: string, itemCount: number) =>
    `Export ${itemCount} items as ${format.toUpperCase()} format`,
  
  downloadProgress: (percentage: number) =>
    `Download progress: ${percentage.toFixed(1)}% complete`,

  // Error States
  errorMessage: (error: string, recovery?: string) =>
    `Error: ${error}${recovery ? `. ${recovery}` : ''}`,
  
  retryButton: (attemptNumber: number) =>
    `Retry operation, attempt ${attemptNumber}`,

  // Loading States
  loadingSpinner: (operation: string, progress?: number) =>
    `Loading ${operation}${progress ? `, ${progress.toFixed(1)}% complete` : ''}`,
  
  skeletonLoader: (contentType: string) =>
    `Loading ${contentType}, please wait...`
};

/**
 * Screen reader utilities
 */
export const ScreenReader = {
  announceChange: (message: string, priority: AnnouncementType = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  },

  describeVisualization: (type: string, data: VisualizationData) => {
    switch (type) {
      case 'tsp': {
        const tspData = data as TSPVisualizationData;
        return `TSP visualization showing ${tspData.cityCount} cities with ${tspData.routeLength ? `current route connecting ${tspData.routeLength} cities` : 'no route selected'}`;
      }
      
      case 'chart': {
        const chartData = data as ChartVisualizationData;
        return `Chart showing ${chartData.chartType} with ${chartData.dataPoints} data points, X-axis: ${chartData.xAxis}, Y-axis: ${chartData.yAxis}`;
      }
      
      case 'quality-gauge': {
        const qualityData = data as QualityGaugeData;
        return `Quality gauge displaying ${qualityData.current} out of ${qualityData.maximum}, which is ${((qualityData.current / qualityData.maximum) * 100).toFixed(1)}% quality`;
      }
      
      case 'progress': {
        const progressData = data as ProgressData;
        return `Progress indicator at ${progressData.percentage}% completion, ${progressData.status}`;
      }
      
      default:
        return `Visualization of type ${type}`;
    }
  },

  describeDataTable: (columns: string[], rowCount: number, sortColumn?: string, sortDirection?: 'asc' | 'desc') => {
    let description = `Data table with ${rowCount} rows and ${columns.length} columns: ${columns.join(', ')}`;
    if (sortColumn) {
      description += `. Sorted by ${sortColumn} in ${sortDirection === 'asc' ? 'ascending' : 'descending'} order`;
    }
    return description;
  }
};

/**
 * Keyboard shortcut definitions
 */
export const KeyboardShortcuts = {
  // Global shortcuts
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  SPACE: ' ',
  TAB: 'Tab',
  
  // Navigation
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
  
  // Actions
  DELETE: 'Delete',
  BACKSPACE: 'Backspace',
  
  // Modifiers
  CTRL: 'Control',
  ALT: 'Alt',
  SHIFT: 'Shift',
  META: 'Meta', // Cmd on Mac, Windows key on PC

  // Application-specific shortcuts
  shortcuts: {
    RUN_ALGORITHM: ['r', 'R'],
    STOP_ALGORITHM: ['s', 'S'],
    RESET_PROBLEM: ['Ctrl+r', 'Cmd+r'],
    EXPORT_DATA: ['Ctrl+e', 'Cmd+e'],
    TOGGLE_QUALITY_VIEW: ['q', 'Q'],
    TOGGLE_PERFORMANCE_VIEW: ['p', 'P'],
    ZOOM_IN: ['+', '='],
    ZOOM_OUT: ['-', '_'],
    RESET_ZOOM: ['0'],
    NEXT_PROBLEM: ['n', 'N'],
    PREVIOUS_PROBLEM: ['Shift+n', 'Shift+N'],
    TOGGLE_HELP: ['?', 'h', 'H'],
    FOCUS_SEARCH: ['/', 'Ctrl+f', 'Cmd+f']
  }
};

/**
 * High contrast theme utilities
 */
export const HighContrastTheme = {
  colors: {
    background: '#000000',
    foreground: '#ffffff',
    primary: '#ffff00',
    secondary: '#00ffff',
    accent: '#ff00ff',
    success: '#00ff00',
    warning: '#ffaa00',
    error: '#ff0000',
    border: '#ffffff',
    focus: '#ffff00'
  },

  apply: () => {
    document.documentElement.classList.add('high-contrast');
    document.documentElement.style.setProperty('--hc-bg', HighContrastTheme.colors.background);
    document.documentElement.style.setProperty('--hc-fg', HighContrastTheme.colors.foreground);
    document.documentElement.style.setProperty('--hc-primary', HighContrastTheme.colors.primary);
    document.documentElement.style.setProperty('--hc-focus', HighContrastTheme.colors.focus);
  },

  remove: () => {
    document.documentElement.classList.remove('high-contrast');
  }
};

/**
 * Reduced motion utilities
 */
export const ReducedMotion = {
  apply: () => {
    document.documentElement.classList.add('reduced-motion');
    // Disable transitions and animations
    const style = document.createElement('style');
    style.textContent = `
      .reduced-motion *,
      .reduced-motion *:before,
      .reduced-motion *:after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `;
    document.head.appendChild(style);
  },

  remove: () => {
    document.documentElement.classList.remove('reduced-motion');
  }
};

export default {
  useAnnouncements,
  useKeyboardNavigation,
  useFocusManagement,
  useAccessibilityPreferences,
  AriaLabels,
  ScreenReader,
  KeyboardShortcuts,
  HighContrastTheme,
  ReducedMotion
};