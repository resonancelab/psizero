/**
 * Animated Quality Metrics Component
 * Displays real-time solution quality improvements with engaging animations
 */

import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Zap, 
  Target, 
  Clock,
  Award,
  Activity,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { 
  QualityAnimator,
  CSSAnimations,
  useAnimation,
  AnimationPresets
} from '@/lib/quantum-optimizer/animations';
import type { SolutionQuality } from '@/lib/quantum-optimizer/types';

interface QualityMetric {
  label: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  unit?: string;
  format?: 'percentage' | 'number' | 'time';
}

interface AnimatedQualityMetricsProps {
  quality?: SolutionQuality;
  metrics?: QualityMetric[];
  isOptimizing?: boolean;
  onMetricClick?: (metric: QualityMetric) => void;
  className?: string;
}

export const AnimatedQualityMetrics: React.FC<AnimatedQualityMetricsProps> = ({
  quality,
  metrics = [],
  isOptimizing = false,
  onMetricClick,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const [animatedScore, setAnimatedScore] = useState(0);
  const [previousQuality, setPreviousQuality] = useState<SolutionQuality | null>(null);
  const [improvements, setImprovements] = useState<string[]>([]);
  
  const scoreAnimation = useAnimation({
    duration: 1500,
    easing: 'ease-out'
  });

  const pulseAnimation = useAnimation({
    duration: 800,
    easing: 'bounce'
  });

  // Animate score changes
  useEffect(() => {
    if (quality && scoreRef.current) {
      const newScore = quality.score;
      const prevScore = previousQuality?.score || 0;
      
      if (newScore !== prevScore) {
        QualityAnimator.animateScoreChange(
          scoreRef.current,
          prevScore,
          newScore,
          1000
        ).then(() => {
          setAnimatedScore(newScore);
        });

        // Add improvement notifications
        if (newScore > prevScore && quality.details.improvements.length > 0) {
          setImprovements(prev => [
            ...prev.slice(-2), // Keep last 2
            ...quality.details.improvements
          ]);
        }

        setPreviousQuality(quality);
      }
    }
  }, [quality, previousQuality]);

  // Animate progress bar
  useEffect(() => {
    if (progressRef.current && quality) {
      QualityAnimator.animateProgress(
        progressRef.current,
        previousQuality?.optimality || 0,
        quality.optimality,
        800
      );
    }
  }, [quality, previousQuality]);

  const formatMetricValue = (value: number, format?: string, unit?: string): string => {
    let formatted: string;
    
    switch (format) {
      case 'percentage':
        formatted = `${(value * 100).toFixed(1)}%`;
        break;
      case 'time':
        formatted = `${value.toFixed(2)}ms`;
        break;
      default:
        formatted = value.toLocaleString();
    }
    
    return unit ? `${formatted} ${unit}` : formatted;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default:
        return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string): string => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className={`w-full ${className}`} ref={containerRef}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Solution Quality Metrics
          {isOptimizing && (
            <Badge variant="secondary" className="animate-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              Optimizing
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Primary Quality Score */}
        {quality && (
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Award className="h-6 w-6 text-yellow-500" />
              <span className="text-lg font-medium">Overall Quality</span>
            </div>
            
            <div 
              ref={scoreRef}
              className="text-4xl font-bold text-blue-600"
              data-value={quality.score}
            >
              {(animatedScore * 100).toFixed(1)}%
            </div>
            
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>Optimality: {(quality.optimality * 100).toFixed(1)}%</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                <span>Confidence: {(quality.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div 
                ref={progressRef}
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${quality.optimality * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Additional Metrics Grid */}
        {metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-muted/30 rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onMetricClick?.(metric)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                  {getTrendIcon(metric.trend)}
                </div>
                
                <div className="text-lg font-semibold">
                  {formatMetricValue(metric.value, metric.format, metric.unit)}
                </div>
                
                {metric.change !== 0 && (
                  <div className={`text-xs ${getTrendColor(metric.trend)}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}
                    {metric.format === 'percentage' ? '%' : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quality Status */}
        {quality && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Validation Status</span>
              <Badge variant={quality.isValid ? 'default' : 'destructive'}>
                {quality.isValid ? 'Valid' : 'Invalid'}
              </Badge>
            </div>

            {/* Violations */}
            {quality.details.violations.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-medium text-red-600">Violations:</span>
                {quality.details.violations.map((violation, index) => (
                  <div key={index} className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
                    {violation}
                  </div>
                ))}
              </div>
            )}

            {/* Recent Improvements */}
            {improvements.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-medium text-green-600">Recent Improvements:</span>
                {improvements.slice(-3).map((improvement, index) => (
                  <div 
                    key={index} 
                    className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded animate-slide-in"
                  >
                    {improvement}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Detailed Metrics */}
        {quality?.details.metrics && Object.keys(quality.details.metrics).length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Detailed Metrics</span>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(quality.details.metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-mono">
                    {typeof value === 'number' ? value.toFixed(3) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isOptimizing && !quality && (
          <div className="text-center py-8">
            <Clock className="h-8 w-8 mx-auto mb-3 animate-spin text-blue-500" />
            <p className="text-sm text-muted-foreground">Computing solution quality...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnimatedQualityMetrics;