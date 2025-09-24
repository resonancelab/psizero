/**
 * Skeleton Loading States for Quantum Optimization Components
 * Provides smooth loading experiences while components initialize and process data
 */

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Base skeleton animation classes
const skeletonBase = "animate-pulse bg-muted";
const skeletonContent = "bg-muted/60";

/**
 * TSP Visualizer Skeleton
 */
export const TSPVisualizerSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={cn("w-full", className)}>
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
    </CardHeader>
    
    <CardContent className="space-y-4">
      {/* Controls */}
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-12" />
        <Skeleton className="h-9 w-12" />
      </div>
      
      {/* Canvas Area */}
      <div className="relative bg-muted/30 rounded-lg">
        <Skeleton className="w-full h-80 rounded-lg" />
        
        {/* Simulated city dots */}
        <div className="absolute inset-0 p-8">
          <div className="relative w-full h-full">
            {[...Array(8)].map((_, i) => (
              <Skeleton
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: `${15 + (i * 12)}%`,
                  top: `${20 + (i % 3) * 25}%`,
                }}
              />
            ))}
            
            {/* Simulated route lines */}
            <div className="absolute inset-0">
              <Skeleton className="absolute h-0.5 w-16 rotate-12" style={{ left: '20%', top: '30%' }} />
              <Skeleton className="absolute h-0.5 w-12 -rotate-45" style={{ left: '35%', top: '25%' }} />
              <Skeleton className="absolute h-0.5 w-20 rotate-90" style={{ left: '50%', top: '40%' }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Info Panel */}
      <div className="bg-muted/30 rounded-lg p-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

/**
 * Quality Metrics Skeleton
 */
export const QualityMetricsSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={cn("w-full", className)}>
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-20" />
      </div>
    </CardHeader>
    
    <CardContent className="space-y-4">
      {/* Main Score */}
      <div className="text-center space-y-2">
        <Skeleton className="h-6 w-32 mx-auto" />
        <Skeleton className="h-12 w-24 mx-auto" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-muted/30 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-3" />
            </div>
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
      
      {/* Status Section */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <div className="space-y-1">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

/**
 * Problem Gallery Skeleton
 */
export const ProblemGallerySkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("space-y-6", className)}>
    {/* Header */}
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-96" />
    </div>
    
    {/* Filter Tabs */}
    <div className="flex gap-2">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-24" />
      ))}
    </div>
    
    {/* Problem Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-8" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

/**
 * Solution Comparison Skeleton
 */
export const SolutionComparisonSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={cn("w-full", className)}>
    <CardHeader>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-5 w-24" />
      </div>
    </CardHeader>
    
    <CardContent className="space-y-6">
      {/* Comparison Table */}
      <div className="space-y-3">
        {/* Header */}
        <div className="grid grid-cols-4 gap-4 pb-2 border-b">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-18" />
          <Skeleton className="h-4 w-14" />
        </div>
        
        {/* Rows */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 py-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-10" />
          </div>
        ))}
      </div>
      
      {/* Performance Chart */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <div className="h-48 bg-muted/30 rounded-lg p-4">
          <div className="h-full flex items-end justify-around">
            {[...Array(5)].map((_, i) => (
              <Skeleton
                key={i}
                className="w-8 bg-muted/60"
                style={{ height: `${30 + (i * 15)}%` }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Analysis Summary */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-28" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </CardContent>
  </Card>
);

/**
 * Performance Dashboard Skeleton
 */
export const PerformanceDashboardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("space-y-6", className)}>
    {/* Header Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    
    {/* Main Chart */}
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-5 w-32" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 bg-muted/30 rounded-lg p-4">
          <div className="h-full flex items-end justify-between">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <Skeleton
                  className="w-4 bg-muted/60"
                  style={{ height: `${20 + Math.random() * 60}%` }}
                />
                <Skeleton className="h-3 w-6" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
    
    {/* Side Metrics */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-28" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="flex justify-between text-sm">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="flex justify-between text-sm">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

/**
 * Algorithm Explainer Skeleton
 */
export const AlgorithmExplainerSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={cn("w-full", className)}>
    <CardHeader>
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </CardHeader>
    
    <CardContent className="space-y-6">
      {/* Introduction */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
      
      {/* Steps */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="ml-11 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            
            {/* Code block */}
            <div className="ml-11 bg-muted/30 rounded-lg p-3">
              <div className="space-y-1">
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-56" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Complexity Analysis */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-36" />
        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

/**
 * Configuration Panel Skeleton
 */
export const ConfigurationPanelSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={cn("w-full", className)}>
    <CardHeader>
      <Skeleton className="h-6 w-36" />
    </CardHeader>
    
    <CardContent className="space-y-6">
      {/* Form Sections */}
      {[...Array(3)].map((_, sectionIndex) => (
        <div key={sectionIndex} className="space-y-4">
          <Skeleton className="h-5 w-32" />
          
          {/* Form Fields */}
          {[...Array(2)].map((_, fieldIndex) => (
            <div key={fieldIndex} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-48" />
            </div>
          ))}
          
          {/* Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        </div>
      ))}
      
      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
      </div>
    </CardContent>
  </Card>
);

/**
 * Generic Loading Overlay
 */
export const LoadingOverlay: React.FC<{
  children: React.ReactNode;
  isLoading: boolean;
  skeleton?: React.ReactNode;
  className?: string;
}> = ({ children, isLoading, skeleton, className }) => {
  if (isLoading) {
    return (
      <div className={cn("relative", className)}>
        {skeleton || (
          <div className="animate-pulse">
            <div className="h-64 bg-muted rounded-lg" />
          </div>
        )}
      </div>
    );
  }
  
  return <>{children}</>;
};

/**
 * Pulsing dots animation for inline loading
 */
export const LoadingDots: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("flex space-x-1", className)}>
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
        style={{
          animationDelay: `${i * 0.2}s`,
          animationDuration: '1s'
        }}
      />
    ))}
  </div>
);

export default {
  TSPVisualizerSkeleton,
  QualityMetricsSkeleton,
  ProblemGallerySkeleton,
  SolutionComparisonSkeleton,
  PerformanceDashboardSkeleton,
  AlgorithmExplainerSkeleton,
  ConfigurationPanelSkeleton,
  LoadingOverlay,
  LoadingDots
};