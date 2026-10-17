"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

export interface TechTextProps {
  /** The target string to decrypt and display */
  text: string;
  /** Speed of scrambling in milliseconds per frame (default: 35) */
  speed?: number;
  /** Number of scramble iterations per character before revealing (default: 8) */
  maxIterations?: number;
  /** Whether to decrypt characters sequentially from start to end (default: true) */
  sequential?: boolean;
  /** Reveal direction when sequential is true */
  revealDirection?: "start" | "end" | "center";
  /** Custom characters pool to use for scrambling */
  characters?: string;
  /** Classes applied to the resolved characters */
  className?: string;
  /** Classes applied to characters while actively scrambling */
  encryptedClassName?: string;
  /** When to trigger animation: 'view', 'hover', or 'both' (default: 'both') */
  animateOn?: "view" | "hover" | "both";
  /** Optional wrapper class */
  parentClassName?: string;
  /** Trigger a fresh scramble/decrypt cycle programmatically */
  triggerKey?: number | string | boolean;
  /** Callback fired when text decryption is completed */
  onAnimationComplete?: () => void;
}

const DEFAULT_CHARS = "0123456789ABCDEF!@#$%^&*()_+-=~[]{}|;:,.<>?/<>~Ξ∆∇λπ";

/**
 * React Bits TechText Component
 * Renders an interactive cyber/matrix decryption effect for futuristic headers and wordmarks.
 * Fully supports prefers-reduced-motion, hover interaction, and dynamic re-scrambling.
 */
export function TechText({
  text,
  speed = 35,
  maxIterations = 8,
  sequential = true,
  revealDirection = "start",
  characters = DEFAULT_CHARS,
  className = "",
  encryptedClassName = "text-electric-cyan opacity-80 font-mono",
  animateOn = "both",
  parentClassName = "",
  triggerKey,
  onAnimationComplete,
}: TechTextProps) {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isScrambling, setIsScrambling] = useState<boolean>(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveredRef = useRef<boolean>(false);

  // Check for prefers-reduced-motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const getRandomChar = useCallback(() => {
    return characters[Math.floor(Math.random() * characters.length)];
  }, [characters]);

  const startDecryption = useCallback(() => {
    // If reduced motion is requested, show final text immediately without scrambling
    if (reducedMotion) {
      setDisplayText(text);
      setIsScrambling(false);
      setRevealedIndices(new Set(text.split("").map((_, i) => i)));
      onAnimationComplete?.();
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsScrambling(true);

    const length = text.length;
    let iteration = 0;
    const currentRevealed = new Set<number>();

    // Determine reveal order based on direction
    const revealOrder: number[] = [];
    if (revealDirection === "start") {
      for (let i = 0; i < length; i++) revealOrder.push(i);
    } else if (revealDirection === "end") {
      for (let i = length - 1; i >= 0; i--) revealOrder.push(i);
    } else {
      // Center outwards
      const mid = Math.floor(length / 2);
      revealOrder.push(mid);
      let offset = 1;
      while (mid - offset >= 0 || mid + offset < length) {
        if (mid + offset < length) revealOrder.push(mid + offset);
        if (mid - offset >= 0) revealOrder.push(mid - offset);
        offset++;
      }
    }

    intervalRef.current = setInterval(() => {
      iteration++;

      if (sequential) {
        // Calculate which characters should be revealed by this iteration
        const charsToReveal = Math.floor(iteration / maxIterations);
        for (let i = 0; i < Math.min(charsToReveal, length); i++) {
          const index = revealOrder[i];
          if (index !== undefined) {
            currentRevealed.add(index);
          }
        }
      } else {
        // Random probabilistic reveal
        if (iteration > maxIterations) {
          for (let i = 0; i < length; i++) {
            if (Math.random() > 0.6) currentRevealed.add(i);
          }
        }
      }

      setRevealedIndices(new Set(currentRevealed));

      // Build intermediate display string
      const nextDisplay = text
        .split("")
        .map((char, idx) => {
          if (char === " ") return " ";
          if (currentRevealed.has(idx)) return char;
          return getRandomChar();
        })
        .join("");

      setDisplayText(nextDisplay);

      // Check completion
      if (currentRevealed.size >= length || iteration >= length * maxIterations + 15) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDisplayText(text);
        setIsScrambling(false);
        setRevealedIndices(new Set(text.split("").map((_, i) => i)));
        onAnimationComplete?.();
      }
    }, speed);
  }, [text, speed, maxIterations, sequential, revealDirection, getRandomChar, reducedMotion, onAnimationComplete]);

  // Initial trigger and external triggerKey changes
  useEffect(() => {
    startDecryption();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startDecryption, triggerKey]);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (animateOn === "hover" || animateOn === "both") {
      startDecryption();
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
  };

  return (
    <span
      className={`inline-block select-none cursor-pointer transition-colors ${parentClassName}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="status"
      aria-label={text}
    >
      {displayText.split("").map((char, index) => {
        const isRevealed = revealedIndices.has(index) || !isScrambling;
        return (
          <span
            key={index}
            className={`transition-all duration-75 inline-block ${
              isRevealed ? className : encryptedClassName
            }`}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </span>
  );
}

export default TechText;
