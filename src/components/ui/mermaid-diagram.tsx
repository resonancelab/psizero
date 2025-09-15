import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  id?: string;
  className?: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ 
  chart, 
  id = `mermaid-${Math.random().toString(36).substr(2, 9)}`,
  className = ""
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      // Initialize mermaid with theme
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        themeVariables: {
          primaryColor: '#3b82f6',
          primaryTextColor: '#1f2937',
          primaryBorderColor: '#6366f1',
          lineColor: '#6b7280',
          sectionBkgColor: '#f8fafc',
          altSectionBkgColor: '#f1f5f9',
          gridColor: '#e5e7eb',
          secondaryColor: '#8b5cf6',
          tertiaryColor: '#f3f4f6',
        },
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        fontSize: 14,
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis'
        },
        sequence: {
          useMaxWidth: true,
          wrap: true
        },
        gantt: {
          useMaxWidth: true
        }
      });

      // Clear previous content
      elementRef.current.innerHTML = '';
      
      // Render the diagram
      mermaid.render(id, chart).then(({ svg }) => {
        if (elementRef.current) {
          elementRef.current.innerHTML = svg;
        }
      }).catch((error) => {
        console.error('Mermaid rendering error:', error);
        if (elementRef.current) {
          elementRef.current.innerHTML = `<div class="text-red-500 p-4 border border-red-200 rounded">Error rendering diagram: ${error.message}</div>`;
        }
      });
    }
  }, [chart, id]);

  return (
    <div 
      ref={elementRef} 
      className={`mermaid-diagram ${className}`}
      style={{ textAlign: 'center' }}
    />
  );
};

export default MermaidDiagram;