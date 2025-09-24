/**
 * Animation and Transition Effects for Solution Visualization
 * Provides smooth animations for optimization processes and solution visualization
 */

import { useEffect, useRef, useState } from 'react';

// Animation configuration types
export interface AnimationConfig {
  duration: number; // milliseconds
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce' | 'elastic';
  delay?: number;
  loop?: boolean | number; // true for infinite, number for specific count
}

export interface TransitionConfig {
  property: string;
  duration: number;
  easing: string;
  delay?: number;
}

// Animation state management
export interface AnimationState {
  isAnimating: boolean;
  progress: number; // 0-1
  currentFrame: number;
  direction: 'forward' | 'backward';
}

// Easing functions
export const EasingFunctions = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  bounce: (t: number) => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  },
  elastic: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    const p = 0.3;
    const s = p / 4;
    return -(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
  }
};

/**
 * Custom hook for managing animations
 */
export const useAnimation = (config: AnimationConfig) => {
  const [state, setState] = useState<AnimationState>({
    isAnimating: false,
    progress: 0,
    currentFrame: 0,
    direction: 'forward'
  });

  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const start = () => {
    if (state.isAnimating) return;

    setState(prev => ({ ...prev, isAnimating: true, progress: 0, currentFrame: 0 }));
    startTimeRef.current = performance.now();
    
    const animate = (currentTime: number) => {
      if (!startTimeRef.current) return;
      
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / config.duration, 1);
      const easedProgress = EasingFunctions[config.easing](progress);

      setState(prev => ({
        ...prev,
        progress: easedProgress,
        currentFrame: prev.currentFrame + 1
      }));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setState(prev => ({ ...prev, isAnimating: false, progress: 1 }));
      }
    };

    if (config.delay) {
      setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate);
      }, config.delay);
    } else {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const stop = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setState(prev => ({ ...prev, isAnimating: false }));
  };

  const reset = () => {
    stop();
    setState({
      isAnimating: false,
      progress: 0,
      currentFrame: 0,
      direction: 'forward'
    });
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return { state, start, stop, reset };
};

/**
 * TSP Tour Animation Utilities
 */
export class TSPAnimator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cities: Array<{ x: number; y: number; name: string }>;
  private tour: number[];
  private animationConfig: AnimationConfig;

  constructor(
    canvas: HTMLCanvasElement,
    cities: Array<{ x: number; y: number; name: string }>,
    tour: number[],
    config: AnimationConfig = { duration: 3000, easing: 'ease-in-out' }
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.cities = cities;
    this.tour = tour;
    this.animationConfig = config;
  }

  /**
   * Animate tour construction step by step
   */
  animateTourConstruction(onProgress?: (step: number, total: number) => void): Promise<void> {
    return new Promise((resolve) => {
      let currentStep = 0;
      const totalSteps = this.tour.length;
      
      const drawStep = () => {
        this.clearCanvas();
        this.drawCities();
        
        // Draw tour up to current step
        if (currentStep > 0) {
          this.drawPartialTour(currentStep);
        }
        
        // Highlight current connection being added
        if (currentStep < totalSteps) {
          this.highlightConnection(currentStep);
        }

        onProgress?.(currentStep, totalSteps);
        currentStep++;

        if (currentStep <= totalSteps) {
          setTimeout(drawStep, this.animationConfig.duration / totalSteps);
        } else {
          resolve();
        }
      };

      drawStep();
    });
  }

  /**
   * Animate tour optimization (2-opt improvement)
   */
  animate2OptImprovement(
    oldTour: number[],
    newTour: number[],
    swapIndices: [number, number]
  ): Promise<void> {
    return new Promise((resolve) => {
      const steps = 30; // Number of animation frames
      let currentStep = 0;

      const animate = () => {
        const progress = currentStep / steps;
        const easedProgress = EasingFunctions[this.animationConfig.easing](progress);

        this.clearCanvas();
        this.drawCities();
        
        // Interpolate between old and new tour
        this.drawInterpolatedTour(oldTour, newTour, swapIndices, easedProgress);
        
        currentStep++;
        if (currentStep <= steps) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      animate();
    });
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawCities(): void {
    this.ctx.fillStyle = '#3b82f6';
    this.ctx.strokeStyle = '#1d4ed8';
    this.ctx.lineWidth = 2;

    this.cities.forEach((city, index) => {
      this.ctx.beginPath();
      this.ctx.arc(city.x, city.y, 6, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.stroke();

      // City name
      this.ctx.fillStyle = '#1f2937';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(city.name, city.x, city.y - 10);
      this.ctx.fillStyle = '#3b82f6';
    });
  }

  private drawPartialTour(steps: number): void {
    this.ctx.strokeStyle = '#10b981';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();

    for (let i = 0; i < Math.min(steps, this.tour.length); i++) {
      const fromCity = this.cities[this.tour[i]];
      const toCity = this.cities[this.tour[(i + 1) % this.tour.length]];

      if (i === 0) {
        this.ctx.moveTo(fromCity.x, fromCity.y);
      }
      this.ctx.lineTo(toCity.x, toCity.y);
    }

    this.ctx.stroke();
  }

  private highlightConnection(step: number): void {
    if (step >= this.tour.length) return;

    const fromCity = this.cities[this.tour[step]];
    const toCity = this.cities[this.tour[(step + 1) % this.tour.length]];

    this.ctx.strokeStyle = '#ef4444';
    this.ctx.lineWidth = 4;
    this.ctx.setLineDash([5, 5]);
    
    this.ctx.beginPath();
    this.ctx.moveTo(fromCity.x, fromCity.y);
    this.ctx.lineTo(toCity.x, toCity.y);
    this.ctx.stroke();
    
    this.ctx.setLineDash([]);
  }

  private drawInterpolatedTour(
    oldTour: number[],
    newTour: number[],
    swapIndices: [number, number],
    progress: number
  ): void {
    this.ctx.strokeStyle = '#10b981';
    this.ctx.lineWidth = 3;
    this.ctx.globalAlpha = 0.7 + progress * 0.3;

    // Draw the tour with animated edge swapping
    this.ctx.beginPath();
    
    for (let i = 0; i < oldTour.length; i++) {
      const isSwapEdge = i === swapIndices[0] || i === swapIndices[1];
      
      let fromIndex: number, toIndex: number;
      
      if (isSwapEdge && progress > 0) {
        // Interpolate the swapped edges
        const factor = Math.sin(progress * Math.PI); // Smooth arc interpolation
        fromIndex = oldTour[i];
        toIndex = progress < 0.5 ? oldTour[(i + 1) % oldTour.length] : newTour[(i + 1) % newTour.length];
      } else {
        fromIndex = oldTour[i];
        toIndex = oldTour[(i + 1) % oldTour.length];
      }

      const fromCity = this.cities[fromIndex];
      const toCity = this.cities[toIndex];

      if (i === 0) {
        this.ctx.moveTo(fromCity.x, fromCity.y);
      }
      this.ctx.lineTo(toCity.x, toCity.y);
    }

    this.ctx.stroke();
    this.ctx.globalAlpha = 1;
  }
}

/**
 * Solution Quality Animation
 */
export class QualityAnimator {
  /**
   * Animate score improvement
   */
  static animateScoreChange(
    element: HTMLElement,
    fromScore: number,
    toScore: number,
    duration: number = 1000
  ): Promise<void> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const scoreDiff = toScore - fromScore;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = EasingFunctions.easeOut(progress);
        
        const currentScore = fromScore + scoreDiff * easedProgress;
        element.textContent = `${(currentScore * 100).toFixed(1)}%`;
        
        // Add visual feedback
        element.style.transform = `scale(${1 + Math.sin(progress * Math.PI) * 0.1})`;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.style.transform = 'scale(1)';
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  /**
   * Animate progress bar
   */
  static animateProgress(
    progressBar: HTMLElement,
    fromPercent: number,
    toPercent: number,
    duration: number = 800
  ): Promise<void> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const percentDiff = toPercent - fromPercent;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = EasingFunctions.easeInOut(progress);
        
        const currentPercent = fromPercent + percentDiff * easedProgress;
        progressBar.style.width = `${currentPercent}%`;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }
}

/**
 * Particle System for Visual Effects
 */
export class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
  }>;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.particles = [];
  }

  /**
   * Create explosion effect at specific coordinates
   */
  createExplosion(x: number, y: number, color: string = '#10b981', particleCount: number = 20): void {
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 2 + Math.random() * 3;
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
        maxLife: 60 + Math.random() * 40,
        color,
        size: 2 + Math.random() * 3
      });
    }
  }

  /**
   * Update and render particles
   */
  update(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles = this.particles.filter(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Apply gravity and friction
      particle.vy += 0.1;
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      
      // Update life
      particle.life--;
      
      // Render particle
      const alpha = particle.life / particle.maxLife;
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size * alpha, 0, 2 * Math.PI);
      this.ctx.fill();
      
      return particle.life > 0;
    });

    this.ctx.globalAlpha = 1;
  }

  /**
   * Start animation loop
   */
  start(): void {
    const animate = () => {
      this.update();
      if (this.particles.length > 0) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }
}

/**
 * CSS Animation Utilities
 */
export const CSSAnimations = {
  /**
   * Create smooth slide-in animation
   */
  slideIn: (element: HTMLElement, direction: 'left' | 'right' | 'up' | 'down' = 'up'): void => {
    const transforms = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      up: 'translateY(-100%)',
      down: 'translateY(100%)'
    };

    element.style.transform = transforms[direction];
    element.style.opacity = '0';
    element.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';

    // Trigger animation
    requestAnimationFrame(() => {
      element.style.transform = 'translate(0, 0)';
      element.style.opacity = '1';
    });
  },

  /**
   * Create pulse animation for highlighting
   */
  pulse: (element: HTMLElement, color: string = '#10b981', duration: number = 600): void => {
    const originalBoxShadow = element.style.boxShadow;
    
    element.style.transition = `box-shadow ${duration}ms ease-in-out`;
    element.style.boxShadow = `0 0 20px ${color}`;

    setTimeout(() => {
      element.style.boxShadow = originalBoxShadow;
    }, duration);
  },

  /**
   * Create typewriter effect for text
   */
  typeWriter: (element: HTMLElement, text: string, speed: number = 50): Promise<void> => {
    return new Promise((resolve) => {
      element.textContent = '';
      let index = 0;

      const type = () => {
        if (index < text.length) {
          element.textContent += text.charAt(index);
          index++;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      };

      type();
    });
  },

  /**
   * Create counting animation for numbers
   */
  countUp: (element: HTMLElement, from: number, to: number, duration: number = 1000): Promise<void> => {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const difference = to - from;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = EasingFunctions.easeOut(progress);
        
        const currentValue = from + difference * easedProgress;
        element.textContent = Math.round(currentValue).toString();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.textContent = to.toString();
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }
};

/**
 * Animation presets for common optimization scenarios
 */
export const AnimationPresets = {
  solutionFound: {
    duration: 1200,
    easing: 'bounce' as const,
    effects: ['pulse', 'scale', 'colorChange']
  },
  
  optimizing: {
    duration: 2000,
    easing: 'ease-in-out' as const,
    effects: ['rotate', 'pulse'],
    loop: true
  },
  
  convergence: {
    duration: 800,
    easing: 'ease-out' as const,
    effects: ['fadeIn', 'slideUp']
  },
  
  error: {
    duration: 400,
    easing: 'ease-in-out' as const,
    effects: ['shake', 'colorFlash']
  }
};

export default {
  useAnimation,
  TSPAnimator,
  QualityAnimator,
  ParticleSystem,
  CSSAnimations,
  AnimationPresets,
  EasingFunctions
};