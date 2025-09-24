import React, { useRef, useEffect } from 'react';

interface ConfidenceGaugeProps {
  value: number;
}

const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({ value }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background circle
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw progress arc
    const startAngle = -Math.PI / 2; // Start from top
    const endAngle = startAngle + (value / 100) * Math.PI * 2;

    // Create gradient for the progress arc
    const gradient = ctx.createConicGradient(startAngle, centerX, centerY);
    if (value >= 80) {
      gradient.addColorStop(0, '#22c55e');
      gradient.addColorStop(1, '#16a34a');
    } else if (value >= 60) {
      gradient.addColorStop(0, '#eab308');
      gradient.addColorStop(1, '#ca8a04');
    } else {
      gradient.addColorStop(0, '#ef4444');
      gradient.addColorStop(1, '#dc2626');
    }

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.stroke();

    // Draw center circle
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 15, 0, Math.PI * 2);
    ctx.fill();

    // Draw tick marks
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 10; i++) {
      const angle = startAngle + (i / 10) * Math.PI * 2;
      const tickInner = radius - 10;
      const tickOuter = radius - 5;

      const x1 = centerX + Math.cos(angle) * tickInner;
      const y1 = centerY + Math.sin(angle) * tickInner;
      const x2 = centerX + Math.cos(angle) * tickOuter;
      const y2 = centerY + Math.sin(angle) * tickOuter;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Draw percentage labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';

    const labelPositions = [0, 25, 50, 75, 100];
    labelPositions.forEach(percentage => {
      const angle = startAngle + (percentage / 100) * Math.PI * 2;
      const labelRadius = radius + 15;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;

      ctx.fillText(`${percentage}%`, x, y + 4);
    });

  }, [value]);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={120}
      className="w-24 h-24"
    />
  );
};

export default ConfidenceGauge;