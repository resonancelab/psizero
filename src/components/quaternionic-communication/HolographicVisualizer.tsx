// Holographic Field Visualizer Component
import React, { useEffect, useRef } from 'react';
import { QuantumNode, HolographicFragment } from './types';
import { FIELD_SIZE } from './holographic-encoding';

interface HolographicVisualizerProps {
  node: QuantumNode;
  onFragmentSelect?: (memoryId: string) => void;
}

const HolographicVisualizer: React.FC<HolographicVisualizerProps> = ({
  node,
  onFragmentSelect
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    let svgContent = '';

    // Holographic field points
    node.holographicField.forEach((point) => {
      // Guard against NaN values
      const safeX = isNaN(point.x) ? 0 : point.x;
      const safeY = isNaN(point.y) ? 0 : point.y;
      const safeZ = isNaN(point.z) ? 0 : point.z;
      const safeIntensity = isNaN(point.intensity) ? 0 : Math.max(0, Math.min(1, point.intensity));
      const safeCoherence = isNaN(point.coherence) ? 0 : Math.max(0, Math.min(1, point.coherence));
      const safeRotation = isNaN(node.rotationAngle) ? 0 : node.rotationAngle;

      const transformX = safeX + (node.view3D ? safeZ * Math.cos(safeRotation) : 0);
      const transformY = safeY + (node.view3D ? safeZ * Math.sin(safeRotation) * 0.5 : 0);

      // Ensure transform values are valid
      const finalX = isNaN(transformX) ? 0 : transformX;
      const finalY = isNaN(transformY) ? 0 : transformY;

      svgContent += `
        <g transform="translate(${finalX}, ${finalY})">
          <circle
            r="${Math.max(1, 1 + safeIntensity * 4)}"
            fill="rgba(${Math.floor(safeIntensity * 255)}, ${Math.floor(safeCoherence * 255)}, 255, ${0.6 + safeIntensity * 0.4})"
            stroke="rgba(${Math.floor(safeIntensity * 255)}, ${Math.floor(safeCoherence * 255)}, 255, 0.8)"
            stroke-width="0.5"
          />`;
      if (safeIntensity > 0.7) {
        svgContent += `
          <circle
            r="${Math.max(1, safeIntensity * 8)}"
            fill="none"
            stroke="rgba(${Math.floor(safeIntensity * 255)}, ${Math.floor(safeCoherence * 255)}, 255, 0.3)"
            stroke-width="1"
          />`;
      }
      svgContent += `</g>`;
    });

    // Interference pattern (rects)
    node.interferencePattern.forEach((pattern) => {
      svgContent += `
        <rect
          x="${pattern.x}"
          y="${pattern.y}"
          width="${Math.max(1, Math.floor(FIELD_SIZE / node.holographicResolution / 2))}"
          height="${Math.max(1, Math.floor(FIELD_SIZE / node.holographicResolution / 2))}"
          fill="rgba(255, 255, 255, ${pattern.intensity * 0.2})"
          opacity="${pattern.intensity}"
        />
      `;
    });

    // Memory centers
    node.memories.forEach((memory, i) => {
      // Guard against NaN values
      const safeCenterX = isNaN(memory.holographicData.centerX) ? 0.5 : memory.holographicData.centerX;
      const safeCenterY = isNaN(memory.holographicData.centerY) ? 0.5 : memory.holographicData.centerY;
      
      const memX = safeCenterX * FIELD_SIZE;
      const memY = safeCenterY * FIELD_SIZE;
      
      // Ensure coordinates are valid
      const finalMemX = isNaN(memX) ? FIELD_SIZE / 2 : memX;
      const finalMemY = isNaN(memY) ? FIELD_SIZE / 2 : memY;
      
      svgContent += `
        <g class="cursor-pointer" onclick="handleFragmentClick('${memory.id}')">
          <circle
            cx="${finalMemX}"
            cy="${finalMemY}"
            r="8"
            fill="${memory.isNonLocal ? 'rgba(0, 255, 0, 0.8)' : 'rgba(255, 215, 0, 0.8)'}"
            stroke="${memory.isNonLocal ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 215, 0, 1)'}"
            stroke-width="2"
            class="hover:r-12"
          />
          <text
            x="${finalMemX + 12}"
            y="${finalMemY + 4}"
            class="fill-yellow-300 text-xs font-mono"
          >
            M${i + 1}
          </text>
        </g>
      `;
    });

    svgRef.current.innerHTML = svgContent;

    // Add click handler for fragments
    const globalWindow = window as Window & { handleFragmentClick?: (memoryId: string) => void };
    globalWindow.handleFragmentClick = (memoryId: string) => {
      onFragmentSelect?.(memoryId);
    };

    return () => {
      delete globalWindow.handleFragmentClick;
    };
  }, [node, onFragmentSelect]);

  return (
    <div className="relative bg-black/40 rounded-lg h-64 mb-4">
      <svg 
        ref={svgRef}
        width="100%" 
        height="100%" 
        className="absolute inset-0"
        viewBox={`0 0 ${FIELD_SIZE} ${FIELD_SIZE}`}
      />
    </div>
  );
};

export default HolographicVisualizer;