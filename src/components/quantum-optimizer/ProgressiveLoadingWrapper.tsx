/**
 * Progressive Loading Wrapper Component
 * Provides smooth transitions between skeleton states and actual content
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { 
  useLoadingState, 
  LoadingPhase, 
  LoadingConfig,
  DEFAULT_LOADING_MESSAGES 
} from '@/lib/quantum-optimizer/loading-states';
import { LoadingDots } from './SkeletonLoaders';

// Animation variants for transitions
const transitionVariants = {
  fadeIn: 'animate-in fade-in duration-300',
  fadeOut: 'animate-out fade-out duration-200',
  slideUp: 'animate-in slide-in-from-bottom-4 duration-300',
  slideDown: 'animate-out slide-out-to-bottom-4 duration-200',
  scaleIn: 'animate-in zoom-in-95 duration-300',
  scaleOut: 'animate-out zoom-out-95 duration-200'
};

export interface ProgressiveLoadingWrapperProps {
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  loadingConfig?: LoadingConfig;
  className?: string;
  
  // Loading control
  isLoading?: boolean;
  phase?: LoadingPhase;
  progress?: number;
  message?: string;
  error?: string;
  
  // Animation options
  transitionType?: keyof typeof transitionVariants;
  showProgress?: boolean;
  showPhaseIndicator?: boolean;
  showTimeEstimate?: boolean;
  
  // Advanced options
  minLoadingTime?: number;
  gracePeriod?: number;
  enableSkeletonTransition?: boolean;
  onLoadingStateChange?: (isLoading: boolean, phase: LoadingPhase) => void;
}

/**
 * Progressive Loading Wrapper with smooth skeleton transitions
 */
export const ProgressiveLoadingWrapper: React.FC<ProgressiveLoadingWrapperProps> = ({
  children,
  skeleton,
  loadingConfig = {},
  className,
  isLoading: externalIsLoading,
  phase: externalPhase,
  progress: externalProgress,
  message: externalMessage,
  error: externalError,
  transitionType = 'fadeIn',
  showProgress = true,
  showPhaseIndicator = true,
  showTimeEstimate = false,
  minLoadingTime = 300,
  gracePeriod = 100,
  enableSkeletonTransition = true,
  onLoadingStateChange
}) => {
  // Internal loading state (if not externally controlled)
  const internalLoading = useLoadingState({
    minDisplayTime: minLoadingTime,
    gracePeriod,
    ...loadingConfig
  });

  // Use external or internal loading state
  const loadingState = useMemo(() => {
    if (externalIsLoading !== undefined) {
      return {
        isLoading: externalIsLoading,
        phase: externalPhase || 'initializing',
        progress: externalProgress || 0,
        message: externalMessage,
        error: externalError,
        startLoading: () => {},
        updateLoading: () => {},
        completeLoading: () => {},
        setError: () => {}
      };
    }
    return internalLoading;
  }, [
    externalIsLoading,
    externalPhase,
    externalProgress,
    externalMessage,
    externalError,
    internalLoading
  ]);

  // Track transition state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(loadingState.isLoading);

  // Handle loading state changes
  useEffect(() => {
    onLoadingStateChange?.(loadingState.isLoading, loadingState.phase);
  }, [loadingState.isLoading, loadingState.phase, onLoadingStateChange]);

  // Handle skeleton transition
  useEffect(() => {
    if (!enableSkeletonTransition) {
      setShowSkeleton(loadingState.isLoading);
      return;
    }

    if (loadingState.isLoading && !showSkeleton) {
      // Show skeleton immediately when loading starts
      setShowSkeleton(true);
    } else if (!loadingState.isLoading && showSkeleton) {
      // Delay hiding skeleton to allow content to render
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setShowSkeleton(false);
        setIsTransitioning(false);
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [loadingState.isLoading, showSkeleton, enableSkeletonTransition]);

  // Get loading message
  const displayMessage = useMemo(() => {
    if (loadingState.error) return `Error: ${loadingState.error}`;
    if (loadingState.message) return loadingState.message;
    return DEFAULT_LOADING_MESSAGES[loadingState.phase] || 'Loading...';
  }, [loadingState.message, loadingState.error, loadingState.phase]);

  // Format time estimate
  const timeEstimate = useMemo(() => {
    if (!showTimeEstimate || !internalLoading.estimatedTimeRemaining) return null;
    
    const seconds = Math.ceil(internalLoading.estimatedTimeRemaining / 1000);
    if (seconds < 60) return `~${seconds}s remaining`;
    const minutes = Math.ceil(seconds / 60);
    return `~${minutes}m remaining`;
  }, [showTimeEstimate, internalLoading.estimatedTimeRemaining]);

  // Render loading overlay
  const renderLoadingOverlay = () => (
    <div className={cn(
      "absolute inset-0 bg-background/80 backdrop-blur-sm",
      "flex items-center justify-center z-10",
      transitionVariants[loadingState.isLoading ? transitionType : 'fadeOut']
    )}>
      <div className="text-center space-y-4 max-w-xs">
        {/* Phase indicator */}
        {showPhaseIndicator && (
          <div className="flex items-center justify-center gap-2">
            <LoadingDots className="h-4" />
            <span className="text-sm font-medium">
              {loadingState.phase.charAt(0).toUpperCase() + loadingState.phase.slice(1)}
            </span>
          </div>
        )}
        
        {/* Progress bar */}
        {showProgress && (
          <div className="space-y-2">
            <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${Math.max(5, loadingState.progress)}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {Math.round(loadingState.progress)}%
            </div>
          </div>
        )}
        
        {/* Message */}
        <p className="text-sm text-muted-foreground">{displayMessage}</p>
        
        {/* Time estimate */}
        {timeEstimate && (
          <p className="text-xs text-muted-foreground/70">{timeEstimate}</p>
        )}
      </div>
    </div>
  );

  // Main render logic
  if (showSkeleton && skeleton) {
    return (
      <div className={cn("relative", className)}>
        <div className={cn(
          "transition-opacity duration-300",
          isTransitioning ? "opacity-50" : "opacity-100"
        )}>
          {skeleton}
        </div>
        {loadingState.isLoading && renderLoadingOverlay()}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "transition-opacity duration-300",
        loadingState.isLoading ? "opacity-50" : "opacity-100"
      )}>
        {children}
      </div>
      {loadingState.isLoading && renderLoadingOverlay()}
    </div>
  );
};

/**
 * Higher-order component for automatic skeleton wrapping
 */
export function withProgressiveLoading<P extends object>(
  Component: React.ComponentType<P>,
  skeleton?: React.ReactNode,
  defaultConfig?: Partial<ProgressiveLoadingWrapperProps>
) {
  return React.forwardRef<HTMLElement, P & { loadingProps?: Partial<ProgressiveLoadingWrapperProps> }>(
    function WrappedComponent(props, ref) {
      const { loadingProps, ...componentProps } = props;
      
      return (
        <ProgressiveLoadingWrapper
          skeleton={skeleton}
          {...defaultConfig}
          {...loadingProps}
        >
          <Component {...(componentProps as P)} ref={ref} />
        </ProgressiveLoadingWrapper>
      );
    }
  );
}

/**
 * Composite loading indicator for multiple phases
 */
export const MultiPhaseLoadingIndicator: React.FC<{
  phases: Array<{
    phase: LoadingPhase;
    label: string;
    isActive: boolean;
    isComplete: boolean;
  }>;
  className?: string;
}> = ({ phases, className }) => (
  <div className={cn("space-y-3", className)}>
    {phases.map((phaseInfo, index) => (
      <div
        key={phaseInfo.phase}
        className={cn(
          "flex items-center gap-3 p-2 rounded-lg transition-colors",
          phaseInfo.isActive && "bg-muted",
          phaseInfo.isComplete && "bg-green-50 dark:bg-green-950"
        )}
      >
        {/* Status icon */}
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
          phaseInfo.isComplete
            ? "bg-green-500 text-white"
            : phaseInfo.isActive
            ? "bg-primary text-primary-foreground animate-pulse"
            : "bg-muted-foreground/20 text-muted-foreground"
        )}>
          {phaseInfo.isComplete ? "✓" : index + 1}
        </div>
        
        {/* Label */}
        <span className={cn(
          "font-medium",
          phaseInfo.isActive
            ? "text-foreground"
            : phaseInfo.isComplete
            ? "text-green-700 dark:text-green-300"
            : "text-muted-foreground"
        )}>
          {phaseInfo.label}
        </span>
        
        {/* Loading dots for active phase */}
        {phaseInfo.isActive && (
          <LoadingDots className="ml-auto" />
        )}
      </div>
    ))}
  </div>
);

/**
 * Skeleton-aware content placeholder
 */
export const SkeletonAwareContent: React.FC<{
  children: React.ReactNode;
  skeleton: React.ReactNode;
  isLoading: boolean;
  fadeTransition?: boolean;
  className?: string;
}> = ({ children, skeleton, isLoading, fadeTransition = true, className }) => {
  const [shouldShowSkeleton, setShouldShowSkeleton] = useState(isLoading);
  
  useEffect(() => {
    if (isLoading) {
      setShouldShowSkeleton(true);
    } else {
      // Small delay to prevent flashing
      const timer = setTimeout(() => setShouldShowSkeleton(false), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div className={cn("relative", className)}>
      {shouldShowSkeleton ? (
        <div className={cn(
          fadeTransition && "transition-opacity duration-200",
          isLoading ? "opacity-100" : "opacity-0"
        )}>
          {skeleton}
        </div>
      ) : (
        <div className={cn(
          fadeTransition && "animate-in fade-in duration-300"
        )}>
          {children}
        </div>
      )}
    </div>
  );
};

export default ProgressiveLoadingWrapper;