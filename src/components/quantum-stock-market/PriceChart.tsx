import React, { useRef, useEffect } from 'react';

interface PriceChartProps {
  data: { time: Date; price: number }[];
  prediction: { direction: 'UP' | 'DOWN'; target: number } | null;
  asset: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, prediction, asset }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const margin = 60;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;

    // Clear canvas
    ctx.fillStyle = '#1e1e2e';
    ctx.fillRect(0, 0, width, height);

    if (data.length < 2) return;

    // Calculate price range
    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices) * 0.999;
    const maxPrice = Math.max(...prices) * 1.001;
    const priceRange = maxPrice - minPrice;

    // Draw grid
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = margin + (i * chartHeight) / 5;
      ctx.beginPath();
      ctx.moveTo(margin, y);
      ctx.lineTo(width - margin, y);
      ctx.stroke();

      // Price labels
      const price = maxPrice - (i * priceRange) / 5;
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(price.toFixed(2), margin - 10, y + 3);
    }

    // Vertical grid lines
    const timeRange = data.length > 1 ? data[data.length - 1].time.getTime() - data[0].time.getTime() : 60000;
    for (let i = 0; i <= 5; i++) {
      const x = margin + (i * chartWidth) / 5;
      ctx.beginPath();
      ctx.moveTo(x, margin);
      ctx.lineTo(x, height - margin);
      ctx.stroke();
    }

    // Draw price line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = margin + (index * chartWidth) / Math.max(data.length - 1, 1);
      const y = height - margin - ((point.price - minPrice) * chartHeight) / priceRange;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw current price point
    if (data.length > 0) {
      const currentPoint = data[data.length - 1];
      const x = margin + ((data.length - 1) * chartWidth) / Math.max(data.length - 1, 1);
      const y = height - margin - ((currentPoint.price - minPrice) * chartHeight) / priceRange;

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Current price label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`$${currentPoint.price.toFixed(2)}`, x + 8, y - 8);
    }

    // Draw prediction line
    if (prediction && data.length > 0) {
      const currentPrice = data[data.length - 1].price;
      const targetPrice = prediction.target;
      const predictionColor = prediction.direction === 'UP' ? '#22c55e' : '#ef4444';

      // Prediction line
      ctx.strokeStyle = predictionColor;
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.beginPath();

      const startX = margin + ((data.length - 1) * chartWidth) / Math.max(data.length - 1, 1);
      const startY = height - margin - ((currentPrice - minPrice) * chartHeight) / priceRange;
      const endX = width - margin;
      const endY = height - margin - ((targetPrice - minPrice) * chartHeight) / priceRange;

      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Prediction target point
      ctx.fillStyle = predictionColor;
      ctx.beginPath();
      ctx.arc(endX, endY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Prediction label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`Target: $${targetPrice.toFixed(2)}`, endX - 8, endY - 8);
      ctx.fillText(`${prediction.direction}`, endX - 8, endY + 16);
    }

    // Asset label
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(asset, width / 2, 20);

  }, [data, prediction, asset]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={300}
      className="w-full h-full border rounded"
    />
  );
};

export default PriceChart;