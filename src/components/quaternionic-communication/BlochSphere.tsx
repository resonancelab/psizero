import React from 'react';
import { BlochVector } from './types';

interface BlochSphereProps {
  blochVector: BlochVector;
  twist: number;
  nodeId: string;
  className?: string;
}

const BlochSphere: React.FC<BlochSphereProps> = ({ blochVector, twist, nodeId, className = "" }) => {
  const size = 150;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;
  
  // Calculate vector endpoint
  const vectorX = centerX + blochVector.x * radius;
  const vectorY = centerY - blochVector.z * radius; // Flip Y for SVG coordinates
  
  // Color based on twist angle
  const vectorColor = `hsl(${((twist * 180 / Math.PI + 180) % 360)}, 70%, 60%)`;
  
  return (
    <div className={`bg-gray-900 rounded-lg p-4 flex justify-center ${className}`}>
      <svg width={size} height={size} className="border rounded">
        {/* Sphere outline */}
        <circle 
          cx={centerX} 
          cy={centerY} 
          r={radius} 
          fill="none" 
          stroke="rgba(255,255,255,0.2)" 
          strokeWidth="1" 
        />
        
        {/* Equator */}
        <ellipse 
          cx={centerX} 
          cy={centerY} 
          rx={radius} 
          ry={radius * 0.3} 
          fill="none" 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth="1" 
        />
        
        {/* Meridian */}
        <ellipse 
          cx={centerX} 
          cy={centerY} 
          rx={radius * Math.abs(Math.cos(twist))} 
          ry={radius} 
          fill="none" 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth="1" 
        />
        
        {/* Coordinate axes */}
        <line x1="15" y1={centerY} x2={size - 15} y2={centerY} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <line x1={centerX} y1="15" x2={centerX} y2={size - 15} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        
        {/* Arrow marker definition */}
        <defs>
          <marker 
            id={`arrowhead-${nodeId}`} 
            markerWidth="10" 
            markerHeight="7" 
            refX="9" 
            refY="3.5" 
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={vectorColor} />
          </marker>
        </defs>
        
        {/* Bloch vector */}
        <line 
          x1={centerX} 
          y1={centerY} 
          x2={vectorX} 
          y2={vectorY}
          stroke={vectorColor} 
          strokeWidth="3"
          markerEnd={`url(#arrowhead-${nodeId})`}
        />
        
        {/* Vector endpoint */}
        <circle 
          cx={vectorX} 
          cy={vectorY} 
          r="4" 
          fill={vectorColor}
          stroke="white"
          strokeWidth="1"
        />
        
        {/* Coordinate labels */}
        <text x="5" y={centerY + 4} fontSize="10" fill="#9ca3af">-X</text>
        <text x={size - 15} y={centerY + 4} fontSize="10" fill="#9ca3af">+X</text>
        <text x={centerX - 4} y="12" fontSize="10" fill="#9ca3af">+Z</text>
        <text x={centerX - 4} y={size - 5} fontSize="10" fill="#9ca3af">-Z</text>
        
        {/* Y-axis indicators (into/out of page) */}
        <circle cx={centerX + radius * 0.7} cy={centerY - radius * 0.3} r="3" fill="none" stroke="#9ca3af" strokeWidth="1" />
        <text x={centerX + radius * 0.7 + 8} y={centerY - radius * 0.3 + 3} fontSize="8" fill="#9ca3af">+Y</text>
        
        {/* Twist indicator */}
        <g transform={`translate(${centerX}, ${centerY})`}>
          <path
            d={`M ${radius * 0.2} 0 A ${radius * 0.2} ${radius * 0.2} 0 0 1 ${radius * 0.2 * Math.cos(twist)} ${radius * 0.2 * Math.sin(twist)}`}
            fill="none"
            stroke={vectorColor}
            strokeWidth="1"
            opacity="0.7"
          />
        </g>
      </svg>
    </div>
  );
};

export default BlochSphere;