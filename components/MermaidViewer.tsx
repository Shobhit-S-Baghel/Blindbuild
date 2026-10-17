"use client";

import React, { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw, AlertTriangle } from "lucide-react";

interface MermaidViewerProps {
  chart: string;
  className?: string;
}

export function MermaidViewer({ chart, className = "" }: MermaidViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);

  useEffect(() => {
    let isMounted = true;

    async function renderChart() {
      if (!chart || !chart.trim()) return;

      try {
        setError(null);
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          fontFamily: "JetBrains Mono, monospace",
          themeVariables: {
            darkMode: true,
            background: "#0a0c14",
            primaryColor: "#181d2a",
            primaryTextColor: "#00f2fe",
            primaryBorderColor: "#00f2fe",
            lineColor: "#8b5cf6",
            secondaryColor: "#131620",
            tertiaryColor: "#0e1118",
            edgeLabelBackground: "#08090d",
          },
        });

        // Ensure unique id per render
        const id = `mermaid-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const cleanChart = chart.trim();

        const { svg } = await mermaid.render(id, cleanChart);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.warn("Mermaid render error:", err);
          setError("Failed to render architecture diagram.");
        }
      }
    }

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  return (
    <div className={`relative rounded-xl overflow-hidden bg-[#090b12] border border-white/10 ${className}`}>
      {/* Zoom / Reset Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center space-x-1.5 p-1 rounded-lg bg-surface-100/80 border border-white/10 backdrop-blur-md">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.15, 2.0))}
          className="p-1 text-gray-400 hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.15, 0.6))}
          className="p-1 text-gray-400 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="p-1 text-gray-400 hover:text-white transition-colors"
          title="Reset Zoom"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Diagram Canvas */}
      <div className="p-6 overflow-auto min-h-[220px] flex items-center justify-center">
        {error ? (
          <div className="flex items-center space-x-2 text-xs text-amber-400 font-mono">
            <AlertTriangle className="w-4 h-4" />
            <span>{error} Rendering raw architecture specs below.</span>
          </div>
        ) : svgContent ? (
          <div
            ref={containerRef}
            className="transition-transform duration-200 origin-center"
            style={{ transform: `scale(${zoom})` }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="text-xs text-gray-400 font-mono animate-pulse">
            Compiling live Mermaid architecture diagram...
          </div>
        )}
      </div>

      {/* Raw Fallback / Code view toggle footer */}
      <div className="px-4 py-2 border-t border-white/5 bg-surface-50/50 flex items-center justify-between text-[11px] font-mono text-gray-400">
        <span>Engine: Mermaid.js Live AST</span>
        <span className="text-electric-cyan">Zoom: {Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}
