"use client";

import React, { useMemo } from "react";

interface IdenticonProps {
  seed: string;
  size?: number;
  className?: string;
}

export function Identicon({ seed, size = 48, className = "" }: IdenticonProps) {
  // Generate deterministic geometric tiles from seed string
  const tiles = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const abs = Math.abs(hash);

    const colors = [
      ["#00f2fe", "#4facfe"],
      ["#8b5cf6", "#c084fc"],
      ["#10b981", "#34d399"],
      ["#f43f5e", "#fb7185"],
      ["#38bdf8", "#818cf8"],
    ];
    const palette = colors[abs % colors.length];

    // 5x5 grid with horizontal symmetry (columns: 0, 1, 2, 1, 0)
    const grid: boolean[][] = [];
    let state = abs;
    for (let r = 0; r < 5; r++) {
      const row: boolean[] = [];
      const col0 = (state & 1) === 1;
      state >>= 1;
      const col1 = (state & 1) === 1;
      state >>= 1;
      const col2 = (state & 1) === 1;
      state >>= 1;

      row.push(col0, col1, col2, col1, col0);
      grid.push(row);
    }

    return { grid, palette };
  }, [seed]);

  const tileSize = size / 6;
  const padding = size / 12;

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-xl overflow-hidden border border-white/10 bg-[#0d101a] shadow-inner ${className}`}
      style={{ width: size, height: size }}
      title={`Anonymous Identicon (${seed})`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={size} height={size} fill="#0d101a" />
        <defs>
          <linearGradient id={`grad-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={tiles.palette[0]} />
            <stop offset="100%" stopColor={tiles.palette[1]} />
          </linearGradient>
        </defs>

        {tiles.grid.map((row, r) =>
          row.map((active, c) => {
            if (!active) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={padding + c * tileSize}
                y={padding + r * tileSize}
                width={tileSize * 0.9}
                height={tileSize * 0.9}
                rx={tileSize * 0.25}
                fill={`url(#grad-${seed})`}
                opacity={0.9}
              />
            );
          })
        )}
      </svg>
      {/* Subtle border overlay */}
      <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/5" />
    </div>
  );
}
