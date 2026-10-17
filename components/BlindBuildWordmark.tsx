"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TechText } from "./TechText";
import { ShieldCheck, ChevronUp, Terminal, Sparkles, X } from "lucide-react";

/** Inactivity timeout in milliseconds (60 seconds) */
const INACTIVITY_TIMEOUT_MS = 60000;

/**
 * BlindBuildWordmark
 *
 * Interactive, futuristic wordmark powered by React Bits TechText.
 * Features:
 * - Decrypted text matrix scramble on "BlindBuild" with hover re-trigger
 * - Dismisses with smooth exit animation on scroll down or touch swipe up
 * - Prevents layout shifts (CLS = 0) via fixed floating HUD architecture
 * - Respects prefers-reduced-motion
 * - Inactivity detector: smoothly reappears after 60 seconds of no user interaction
 * - Any user activity resets the 60s inactivity countdown
 * - Completely cleans up all event listeners and timeouts to prevent memory leaks
 */
export function BlindBuildWordmark() {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [triggerKey, setTriggerKey] = useState<number>(0);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // References to track state without causing stale closures in listeners
  const isDismissedRef = useRef<boolean>(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Dismiss action: hide the wordmark and start the 60s inactivity timer
  const dismiss = useCallback(() => {
    if (isDismissedRef.current) return;
    setIsVisible(false);
    isDismissedRef.current = true;

    // Clear any existing inactivity timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Start 60-second inactivity countdown to re-show
    inactivityTimerRef.current = setTimeout(() => {
      setIsVisible(true);
      isDismissedRef.current = false;
      setTriggerKey((prev) => prev + 1);
    }, INACTIVITY_TIMEOUT_MS);
  }, []);

  // Reset inactivity timer when user interacts while wordmark is dismissed
  const recordUserActivity = useCallback(() => {
    if (!isDismissedRef.current) return;

    // Reset the 60s timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      setIsVisible(true);
      isDismissedRef.current = false;
      setTriggerKey((prev) => prev + 1);
    }, INACTIVITY_TIMEOUT_MS);
  }, []);

  // Set up scroll, touch swipe, and inactivity event listeners
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Scroll listener (dismisses when user scrolls down)
    const handleScroll = () => {
      const currentScrollY = window.scrollY || window.pageYOffset;
      if (currentScrollY > 30) {
        dismiss();
      }
      recordUserActivity();
    };

    // 2. Touch swipe listeners (dismisses on upward swipe)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
      recordUserActivity();
    };

    const handleTouchMove = (e: TouchEvent) => {
      recordUserActivity();
      if (touchStartYRef.current !== null && e.touches && e.touches.length > 0) {
        const deltaY = touchStartYRef.current - e.touches[0].clientY;
        // Upward swipe threshold (30px)
        if (deltaY > 30) {
          dismiss();
          touchStartYRef.current = null;
        }
      }
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = null;
      recordUserActivity();
    };

    // 3. Activity listeners (pointer, mouse, keyboard, touch)
    const handleActivity = () => {
      recordUserActivity();
    };

    const passiveOpts: AddEventListenerOptions = { passive: true };

    window.addEventListener("scroll", handleScroll, passiveOpts);
    window.addEventListener("touchstart", handleTouchStart, passiveOpts);
    window.addEventListener("touchmove", handleTouchMove, passiveOpts);
    window.addEventListener("touchend", handleTouchEnd, passiveOpts);
    window.addEventListener("mousemove", handleActivity, passiveOpts);
    window.addEventListener("mousedown", handleActivity, passiveOpts);
    window.addEventListener("keydown", handleActivity, passiveOpts);
    window.addEventListener("pointerdown", handleActivity, passiveOpts);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("pointerdown", handleActivity);

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    };
  }, [dismiss, recordUserActivity]);

  return (
    <div
      className="fixed top-20 left-0 right-0 z-30 pointer-events-none flex justify-center px-4"
      aria-live="polite"
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="blindbuild-wordmark"
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -25, scale: 0.95 }
            }
            animate={
              reducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -20, scale: 0.95 }
            }
            transition={{
              duration: reducedMotion ? 0.2 : 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="pointer-events-auto relative group max-w-lg w-full sm:w-auto"
          >
            {/* Ambient Cybernetic Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-electric-cyan/40 via-electric-violet/40 to-electric-cyan/40 rounded-2xl sm:rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500 animate-border-glow" />

            {/* Wordmark Pill Container */}
            <div className="relative px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl sm:rounded-full bg-[#0a0d16]/95 backdrop-blur-xl border border-white/15 flex items-center justify-between sm:justify-start space-x-3 sm:space-x-4 shadow-glass">
              {/* Terminal Icon & Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-surface-200 border border-electric-cyan/30 flex items-center justify-center text-electric-cyan shadow-glow-cyan/40">
                  <Terminal className="w-3.5 h-3.5" />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-electric-cyan uppercase flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan animate-ping mr-1" />
                    LIVE PROTOCOL
                  </span>
                </div>
              </div>

              {/* Central React Bits TechText Wordmark */}
              <div className="flex items-center space-x-2">
                <TechText
                  text="BlindBuild"
                  speed={40}
                  maxIterations={7}
                  sequential={true}
                  revealDirection="start"
                  triggerKey={triggerKey}
                  className="font-mono text-lg sm:text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan via-white to-electric-violet"
                  encryptedClassName="font-mono text-lg sm:text-xl font-black tracking-wider text-electric-cyan/70"
                />
                <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-electric-violet/10 border border-electric-violet/30 text-[10px] font-mono text-purple-300">
                  v1.0.0
                </span>
              </div>

              {/* Right Hints & Dismiss Trigger */}
              <div className="flex items-center space-x-2 text-gray-400">
                <span className="hidden lg:inline text-[11px] font-mono text-gray-400 border-l border-white/10 pl-3">
                  Scroll or swipe up to hide
                </span>

                <button
                  onClick={dismiss}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  aria-label="Dismiss wordmark banner (reappears after 60 seconds of inactivity)"
                  title="Dismiss (reappears after 60s idle)"
                >
                  <ChevronUp className="w-4 h-4 sm:hidden" />
                  <X className="w-3.5 h-3.5 hidden sm:block" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BlindBuildWordmark;
