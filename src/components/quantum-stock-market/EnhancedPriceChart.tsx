
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  CandlestickChart,
  TrendingUp,
  TrendingDown,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Activity,
  BarChart3,
  Settings
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";

interface PriceData {
  time: Date;
  price: number;
  volume?: number;
  high?: number;
  low?: number;
  open?: number;
}

interface EvolutionData {
  time: Date;
  price: number;
  confidence: number;
}

interface EnhancedPriceChartProps {
  data: PriceData[];
  prediction: { direction: 'UP' | 'DOWN'; target: number } | null;
  asset: string;
  evolutionData?: EvolutionData[];
  showVolume?: boolean;
  showIndicators?: boolean;
}

type ChartType = 'line' | 'candlestick';
type Indicator = 'ma20' | 'ma50' | 'rsi' | 'bollinger';

const EnhancedPriceChart: React.FC<EnhancedPriceChartProps> = ({ 
  data, 
  prediction, 
  asset,
  evolutionData = [],
  showVolume = true,
  showIndicators = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartType, setChartType] = useState<ChartType>('line');
  const [activeIndicators, setActiveIndicators] = useState<Set<Indicator>>(new Set(['ma20']));
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; data: PriceData } | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // Calculate technical indicators
  const calculateMA = useCallback((period: number): number[] => {
    const ma: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        ma.push(data[i].price);
      } else {
        const sum = data.slice(i - period + 1, i + 1).reduce((acc, d) => acc + d.price, 0);
        ma.push(sum / period);
      }
    }
    return ma;
  }, [data]);

  const calculateRSI = useCallback((period: number = 14): number[] => {
    const rsi: number[] = [];
    let gains = 0;
    let losses = 0;

    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        rsi.push(50);
        continue;
      }

      const change = data[i].price - data[i - 1].price;
      if (i < period) {
        if (change > 0) gains += change;
        else losses -= change;
        rsi.push(50);
      } else {
        if (change > 0) {
          gains = (gains * (period - 1) + change) / period;
          losses = (losses * (period - 1)) / period;
        } else {
          gains = (gains * (period - 1)) / period;
          losses = (losses * (period - 1) - change) / period;
        }
        const rs = gains / losses;
        rsi.push(100 - (100 / (1 + rs)));
      }
    }
    return rsi;
  }, [data]);

  const calculateBollingerBands = useCallback((period: number = 20, stdDev: number = 2) => {
    const ma = calculateMA(period);
    const upper: number[] = [];
    const lower: number[] = [];

    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        upper.push(data[i].price);
        lower.push(data[i].price);
      } else {
        const slice = data.slice(i - period + 1, i + 1).map(d => d.price);
        const mean = ma[i];
        const variance = slice.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / period;
        const std = Math.sqrt(variance);
        upper.push(mean + stdDev * std);
        lower.push(mean - stdDev * std);
      }
    }
    return { upper, lower, middle: ma };
  }, [data, calculateMA]);

  // Handle mouse interactions
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const margin = 80;
    const chartWidth = canvas.width - 2 * margin;
    const dataIndex = Math.round(((x - margin) / chartWidth) * (data.length - 1));

    if (dataIndex >= 0 && dataIndex < data.length) {
      setHoveredPoint({ x, y, data: data[dataIndex] });
    } else {
      setHoveredPoint(null);
    }
  }, [data]);

  const handleMouseLeave = useCallback(() => {
    setHoveredPoint(null);
  }, []);

  // Toggle indicator
  const toggleIndicator = (indicator: Indicator) => {
    setActiveIndicators(prev => {
      const newSet = new Set(prev);
      if (newSet.has(indicator)) {
        newSet.delete(indicator);
      } else {
        newSet.add(indicator);
      }
      return newSet;
    });
  };

  // Main drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const margin = 80;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin - (showVolume ? 80 : 0);
    const volumeHeight = showVolume ? 60 : 0;

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0f0f1f');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    if (data.length < 2) return;

    // Apply zoom and pan
    const visibleDataStart = Math.max(0, Math.floor(pan * data.length));
    const visibleDataEnd = Math.min(data.length, Math.floor(visibleDataStart + data.length / zoom));
    const visibleData = data.slice(visibleDataStart, visibleDataEnd);

    // Calculate price range
    const prices = visibleData.map(d => d.price);
    const allPrices = [...prices];
    
    // Include indicator values in price range
    if (activeIndicators.has('bollinger')) {
      const bands = calculateBollingerBands();
      allPrices.push(...bands.upper.slice(visibleDataStart, visibleDataEnd));
      allPrices.push(...bands.lower.slice(visibleDataStart, visibleDataEnd));
    }

    const minPrice = Math.min(...allPrices) * 0.998;
    const maxPrice = Math.max(...allPrices) * 1.002;
    const priceRange = maxPrice - minPrice;

    // Draw grid with glow effect
    ctx.strokeStyle = '#2a2a3e';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#4a4a6e';

    // Horizontal grid lines
    for (let i = 0; i <= 8; i++) {
      const y = margin + (i * chartHeight) / 8;
      ctx.beginPath();
      ctx.moveTo(margin, y);
      ctx.lineTo(width - margin, y);
      ctx.stroke();

      // Price labels with better formatting
      const price = maxPrice - (i * priceRange) / 8;
      ctx.fillStyle = '#a0a0b0';
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      ctx.shadowBlur = 0;
      ctx.fillText(`$${price.toFixed(2)}`, margin - 10, y + 3);
      ctx.shadowBlur = 5;
    }

    // Vertical grid lines with time labels
    const timeSteps = Math.min(8, visibleData.length);
    for (let i = 0; i <= timeSteps; i++) {
      const x = margin + (i * chartWidth) / timeSteps;
      ctx.beginPath();
      ctx.moveTo(x, margin);
      ctx.lineTo(x, height - margin + volumeHeight);
      ctx.stroke();

      // Time labels
      if (i < timeSteps && visibleData[Math.floor(i * visibleData.length / timeSteps)]) {
        const dataPoint = visibleData[Math.floor(i * visibleData.length / timeSteps)];
        ctx.fillStyle = '#a0a0b0';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.shadowBlur = 0;
        ctx.fillText(
          dataPoint.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          x,
          height - margin + volumeHeight + 20
        );
        ctx.shadowBlur = 5;
      }
    }

    ctx.shadowBlur = 0;

    // Draw Bollinger Bands if active
    if (activeIndicators.has('bollinger')) {
      const bands = calculateBollingerBands();
      
      // Fill between bands
      ctx.fillStyle = 'rgba(100, 100, 255, 0.1)';
      ctx.beginPath();
      visibleData.forEach((_, index) => {
        const dataIndex = visibleDataStart + index;
        const x = margin + (index * chartWidth) / Math.max(visibleData.length - 1, 1);
        const yUpper = margin + chartHeight - ((bands.upper[dataIndex] - minPrice) * chartHeight) / priceRange;
        const yLower = margin + chartHeight - ((bands.lower[dataIndex] - minPrice) * chartHeight) / priceRange;
        
        if (index === 0) {
          ctx.moveTo(x, yUpper);
        } else {
          ctx.lineTo(x, yUpper);
        }
      });
      
      for (let i = visibleData.length - 1; i >= 0; i--) {
        const dataIndex = visibleDataStart + i;
        const x = margin + (i * chartWidth) / Math.max(visibleData.length - 1, 1);
        const yLower = margin + chartHeight - ((bands.lower[dataIndex] - minPrice) * chartHeight) / priceRange;
        ctx.lineTo(x, yLower);
      }
      ctx.closePath();
      ctx.fill();

      // Draw band lines
      ctx.strokeStyle = 'rgba(100, 100, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      // Upper band
      ctx.beginPath();
      visibleData.forEach((_, index) => {
        const dataIndex = visibleDataStart + index;
        const x = margin + (index * chartWidth) / Math.max(visibleData.length - 1, 1);
        const y = margin + chartHeight - ((bands.upper[dataIndex] - minPrice) * chartHeight) / priceRange;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Lower band
      ctx.beginPath();
      visibleData.forEach((_, index) => {
        const dataIndex = visibleDataStart + index;
        const x = margin + (index * chartWidth) / Math.max(visibleData.length - 1, 1);
        const y = margin + chartHeight - ((bands.lower[dataIndex] - minPrice) * chartHeight) / priceRange;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw moving averages
    if (activeIndicators.has('ma20')) {
      const ma20 = calculateMA(20);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      visibleData.forEach((_, index) => {
        const dataIndex = visibleDataStart + index;
        const x = margin + (index * chartWidth) / Math.max(visibleData.length - 1, 1);
        const y = margin + chartHeight - ((ma20[dataIndex] - minPrice) * chartHeight) / priceRange;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    if (activeIndicators.has('ma50')) {
      const ma50 = calculateMA(50);
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      visibleData.forEach((_, index) => {
        const dataIndex = visibleDataStart + index;
        if (dataIndex < 50) return;
        const x = margin + (index * chartWidth) / Math.max(visibleData.length - 1, 1);
        const y = margin + chartHeight - ((ma50[dataIndex] - minPrice) * chartHeight) / priceRange;
        if (index === 0 || dataIndex === 50) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Draw main price line or candlesticks
    if (chartType === 'line') {
      // Gradient under line
      const gradientFill = ctx.createLinearGradient(0, margin, 0, margin + chartHeight);
      gradientFill.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
      gradientFill.addColorStop(1, 'rgba(16, 185, 129, 0)');
      
      ctx.fillStyle = gradientFill;
      ctx.beginPath();
      visibleData.forEach((point, index) => {
        const x = margin + (index * chartWidth) / Math.max(visibleData.length - 1, 1);
        const y = margin + chartHeight - ((point.price - minPrice) * chartHeight) / priceRange;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.lineTo(margin + chartWidth, margin + chartHeight);
      ctx.lineTo(margin, margin + chartHeight);
      ctx.closePath();
      ctx.fill();

      // Price line with glow
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#10b981';
      ctx.beginPath();
      visibleData.forEach((point, index) => {
        const x = margin + (index * chartWidth) / Math.max(visibleData.length - 1, 1);
        const y = margin + chartHeight - ((point.price - minPrice) * chartHeight) / priceRange;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else {
      // Candlestick chart
      const candleWidth = Math.max(2, (chartWidth / visibleData.length) * 0.8);
      visibleData.forEach((point, index) => {
        const x = margin + (index * chartWidth) / Math.max(visibleData.length - 1, 1);
        const open = point.open || point.price;
        const close = point.price;
        const high = point.high || Math.max(open, close) * 1.001;
        const low = point.low || Math.min(open, close) * 0.999;
        
        const yOpen = margin + chartHeight - ((open - minPrice) * chartHeight) / priceRange;
        const yClose = margin + chartHeight - ((close - minPrice) * chartHeight) / priceRange;
        const yHigh = margin + chartHeight - ((high - minPrice) * chartHeight) / priceRange;
        const yLow = margin + chartHeight - ((low - minPrice) * chartHeight) / priceRange;
        
        // Wick
        ctx.strokeStyle = close >= open ? '#10b981' : '#ef4444';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();
        
        // Body
        ctx.fillStyle = close >= open ? '#10b981' : '#ef4444';
        const bodyHeight = Math.abs(yClose - yOpen);
        const bodyY = Math.min(yOpen, yClose);
        ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight || 1);
      });
    }

    // Draw evolution data if available
    if (evolutionData.length > 0) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#f59e0b';
      
      ctx.beginPath();
      const lastDataPoint = data[data.length - 1];
      const startX = margin + chartWidth;
      const startY = margin + chartHeight - ((lastDataPoint.price - minPrice) * chartHeight) / priceRange;
      ctx.moveTo(startX, startY);
      
      evolutionData.forEach((point, index) => {
        const evolutionX = startX + ((index + 1) * 50); // Extend 50px per evolution point
        if (evolutionX > width - margin) return;
        
        const y = margin + chartHeight - ((point.price - minPrice) * chartHeight) / priceRange;
        ctx.lineTo(evolutionX, y);
        
        // Confidence indicator
        ctx.save();
        ctx.globalAlpha = point.confidence / 100;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(evolutionX, y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;
    }

    // Draw current price point
    if (visibleData.length > 0) {
      const currentPoint = visibleData[visibleData.length - 1];
      const x = margin + ((visibleData.length - 1) * chartWidth) / Math.max(visibleData.length - 1, 1);
      const y = margin + chartHeight - ((currentPoint.price - minPrice) * chartHeight) / priceRange;

      // Pulsing effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#10b981';
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Current price label with background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(x + 10, y - 20, 100, 24);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`$${currentPoint.price.toFixed(2)}`, x + 15, y - 5);
    }

    // Draw prediction
    if (prediction && visibleData.length > 0) {
      const currentPrice = visibleData[visibleData.length - 1].price;
      const targetPrice = prediction.target;
      const predictionColor = prediction.direction === 'UP' ? '#22c55e' : '#ef4444';

      // Prediction cone
      ctx.fillStyle = prediction.direction === 'UP' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
      ctx.beginPath();
      const startX = margin + ((visibleData.length - 1) * chartWidth) / Math.max(visibleData.length - 1, 1);
      const startY = margin + chartHeight - ((currentPrice - minPrice) * chartHeight) / priceRange;
      const endX = width - margin;
      const endY = margin + chartHeight - ((targetPrice - minPrice) * chartHeight) / priceRange;
      const spread = 30;
      
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY - spread);
      ctx.lineTo(endX, endY + spread);
      ctx.closePath();
      ctx.fill();

      // Prediction line
      ctx.strokeStyle = predictionColor;
      ctx.setLineDash([10, 5]);
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = predictionColor;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;

      // Target point
      ctx.fillStyle = predictionColor;
      ctx.beginPath();
      ctx.arc(endX, endY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Prediction label
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fillRect(endX - 120, endY - 30, 110, 50);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`Target: $${targetPrice.toFixed(2)}`, endX - 15, endY - 10);
      ctx.fillStyle = predictionColor;
      ctx.font = 'bold 14px monospace';
      ctx.fillText(prediction.direction, endX - 15, endY + 10);
    }

    // Draw volume bars if enabled
    if (showVolume && visibleData.some(d => d.volume)) {
      const volumeY = margin + chartHeight + 20;
      const volumes = visibleData.map(d => d.volume || 0);
      const maxVolume = Math.max(...volumes);
      
      visibleData.forEach((point, index) => {
        if (!point.volume) return;
        
        const x = margin + (index * chartWidth) / Math.max(visibleData.length - 1, 1);
        const barWidth = Math.max(1, chartWidth / visibleData.length * 0.8);
        const barHeight = (point.volume / maxVolume) * volumeHeight;
        
        // Color based on price movement
        const priceChange = index > 0 ? point.price >= visibleData[index - 1].price : true;
        ctx.fillStyle = priceChange ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)';
        ctx.fillRect(x - barWidth / 2, volumeY + volumeHeight - barHeight, barWidth, barHeight);
      });
      
      // Volume axis label
      ctx.fillStyle = '#a0a0b0';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('Volume', margin + 5, volumeY - 5);
    }

    // Draw RSI panel if active
    if (activeIndicators.has('rsi') && showIndicators) {
      const rsiData = calculateRSI();
      const rsiPanelY = showVolume ? margin + chartHeight + volumeHeight + 40 : margin + chartHeight + 20;
      const rsiPanelHeight = 80;
      
      // RSI panel background
      ctx.fillStyle = 'rgba(30, 30, 46, 0.5)';
      ctx.fillRect(margin, rsiPanelY, chartWidth, rsiPanelHeight);
      
      // RSI grid lines (70, 50, 30)
      ctx.strokeStyle = '#404040';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      
      [70, 50, 30].forEach(level => {
        const y = rsiPanelY + rsiPanelHeight - (level / 100) * rsiPanelHeight;
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
        
        ctx.fillStyle = '#606070';
        ctx.font = '9px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(level.toString(), margin - 5, y + 3);
      });
      ctx.setLineDash([]);
      
      // Draw RSI line
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      visibleData.forEach((_, index) => {
        const dataIndex = visibleDataStart + index;
        const x = margin + (index * chartWidth) / Math.max(visibleData.length - 1, 1);
        const rsiValue = rsiData[dataIndex];
        const y = rsiPanelY + rsiPanelHeight - (rsiValue / 100) * rsiPanelHeight;
        
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      
      // RSI label
      ctx.fillStyle = '#a0a0b0';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('RSI(14)', margin + 5, rsiPanelY - 5);
    }

    // Draw hover tooltip
    if (hoveredPoint && hoveredPoint.data) {
      const tooltipWidth = 200;
      const tooltipHeight = 120;
      const tooltipX = hoveredPoint.x + 20;
      const tooltipY = hoveredPoint.y - tooltipHeight / 2;
      
      // Adjust position if tooltip goes off screen
      const adjustedX = tooltipX + tooltipWidth > width ? hoveredPoint.x - tooltipWidth - 20 : tooltipX;
      const adjustedY = Math.max(10, Math.min(height - tooltipHeight - 10, tooltipY));
      
      // Tooltip background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.strokeStyle = '#404060';
      ctx.lineWidth = 1;
      ctx.fillRect(adjustedX, adjustedY, tooltipWidth, tooltipHeight);
      ctx.strokeRect(adjustedX, adjustedY, tooltipWidth, tooltipHeight);
      
      // Tooltip content
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      
      const tooltipData = hoveredPoint.data;
      let yOffset = adjustedY + 20;
      
      // Time
      ctx.fillText(tooltipData.time.toLocaleString(), adjustedX + 10, yOffset);
      yOffset += 20;
      
      // Price
      ctx.fillStyle = '#10b981';
      ctx.fillText(`Price: $${tooltipData.price.toFixed(2)}`, adjustedX + 10, yOffset);
      yOffset += 15;
      
      // Volume
      if (tooltipData.volume) {
        ctx.fillStyle = '#a0a0b0';
        ctx.fillText(`Volume: ${(tooltipData.volume / 1000000).toFixed(2)}M`, adjustedX + 10, yOffset);
        yOffset += 15;
      }
      
      // Indicators
      if (activeIndicators.size > 0) {
        ctx.fillStyle = '#606080';
        ctx.fillText('Indicators:', adjustedX + 10, yOffset);
        yOffset += 15;
        
        const dataIndex = data.indexOf(tooltipData);
        
        if (activeIndicators.has('ma20')) {
          const ma20 = calculateMA(20);
          ctx.fillStyle = '#fbbf24';
          ctx.fillText(`MA20: $${ma20[dataIndex].toFixed(2)}`, adjustedX + 20, yOffset);
          yOffset += 15;
        }
        
        if (activeIndicators.has('ma50') && dataIndex >= 50) {
          const ma50 = calculateMA(50);
          ctx.fillStyle = '#8b5cf6';
          ctx.fillText(`MA50: $${ma50[dataIndex].toFixed(2)}`, adjustedX + 20, yOffset);
          yOffset += 15;
        }
        
        if (activeIndicators.has('rsi')) {
          const rsi = calculateRSI();
          ctx.fillStyle = '#f59e0b';
          ctx.fillText(`RSI: ${rsi[dataIndex].toFixed(1)}`, adjustedX + 20, yOffset);
        }
      }
    }

  }, [data, prediction, asset, evolutionData, chartType, activeIndicators, zoom, pan, showVolume, showIndicators, hoveredPoint, calculateMA, calculateRSI, calculateBollingerBands]);

  // Handle mouse wheel zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.1;
      const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
      setZoom(prev => Math.max(0.5, Math.min(5, prev + delta)));
    };

    canvas.addEventListener('wheel', handleWheel);
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.min(width - 40, 1200),
          height: 400 + (showVolume ? 80 : 0) + (activeIndicators.has('rsi') ? 100 : 0)
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showVolume, activeIndicators]);

  return (
    <div ref={containerRef} className="w-full">
      {/* Chart Controls */}
      <div className="flex items-center justify-between mb-4 p-4 bg-card rounded-lg border">
        <div className="flex items-center gap-4">
          {/* Chart Type Selector */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={chartType === 'line' ? 'default' : 'outline'}
              onClick={() => setChartType('line')}
              className="h-8"
            >
              <LineChart className="h-4 w-4 mr-1" />
              Line
            </Button>
            <Button
              size="sm"
              variant={chartType === 'candlestick' ? 'default' : 'outline'}
              onClick={() => setChartType('candlestick')}
              className="h-8"
            >
              <CandlestickChart className="h-4 w-4 mr-1" />
              Candles
            </Button>
          </div>

          {/* Indicator Toggles */}
          {showIndicators && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Indicators:</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={activeIndicators.has('ma20') ? 'default' : 'outline'}
                      onClick={() => toggleIndicator('ma20')}
                      className="h-8 px-2"
                    >
                      MA20
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>20-period Moving Average</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={activeIndicators.has('ma50') ? 'default' : 'outline'}
                      onClick={() => toggleIndicator('ma50')}
                      className="h-8 px-2"
                    >
                      MA50
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>50-period Moving Average</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={activeIndicators.has('rsi') ? 'default' : 'outline'}
                      onClick={() => toggleIndicator('rsi')}
                      className="h-8 px-2"
                    >
                      RSI
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Relative Strength Index</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={activeIndicators.has('bollinger') ? 'default' : 'outline'}
                      onClick={() => toggleIndicator('bollinger')}
                      className="h-8 px-2"
                    >
                      BB
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bollinger Bands</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setZoom(prev => Math.min(5, prev + 0.2))}
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setZoom(1);
              setPan(0);
            }}
            className="h-8 px-2"
          >
            <Maximize2 className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative bg-card rounded-lg border overflow-hidden">
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        
        {/* Loading State */}
        {data.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <Activity className="h-8 w-8 animate-pulse mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading chart data...</p>
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend */}
      {(activeIndicators.size > 0 || evolutionData.length > 0) && (
        <div className="mt-2 p-2 bg-card rounded-lg border">
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-green-500"></div>
              <span>Price</span>
            </div>
            {activeIndicators.has('ma20') && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-yellow-500"></div>
                <span>MA20</span>
              </div>
            )}
            {activeIndicators.has('ma50') && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-purple-500"></div>
                <span>MA50</span>
              </div>
            )}
            {activeIndicators.has('bollinger') && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-blue-500 opacity-50"></div>
                <span>Bollinger Bands</span>
              </div>
            )}
            {evolutionData.length > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-orange-500"></div>
                <span>Evolution Forecast</span>
              </div>
            )}
            {prediction && (
              <div className="flex items-center gap-1">
                <div className={`w-3 h-0.5 ${prediction.direction === 'UP' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Prediction</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedPriceChart;
