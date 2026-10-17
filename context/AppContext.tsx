"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AnonymousBuilder } from "@/types";
import { SEED_BUILDERS } from "@/lib/seedData";

interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: "info" | "error" | "success" | "guardrail";
  detectedPatterns?: string[];
}

/**
 * Application Context Interface
 * Encapsulates global state for anonymous builder sessions, presentation demo mode,
 * autonomous guardrail log drawer toggles, and toast notification queues.
 */
interface AppContextType {
  currentBuilder: AnonymousBuilder | null;
  setCurrentBuilder: (b: AnonymousBuilder | null) => void;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  guardrailDrawerOpen: boolean;
  setGuardrailDrawerOpen: (val: boolean) => void;
  toasts: ToastMessage[];
  addToast: (t: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * AppProvider Component
 * Manages client-side persistence in localStorage, hydrates active anonymous builder profiles,
 * and coordinates system events across routes.
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  // Default to Builder #409 on first load so user immediately sees live verified profile
  const [currentBuilder, setCurrentBuilder] = useState<AnonymousBuilder | null>(null);
  const [demoMode, setDemoMode] = useState<boolean>(true); // Demo mode enabled by default for presentation ease
  const [guardrailDrawerOpen, setGuardrailDrawerOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    // Check localStorage or initialize default
    const saved = localStorage.getItem("blindbuild_current_builder");
    if (saved) {
      try {
        setCurrentBuilder(JSON.parse(saved));
      } catch {
        setCurrentBuilder(SEED_BUILDERS[0]);
      }
    } else {
      setCurrentBuilder(SEED_BUILDERS[0]); // Builder #409
    }

    const savedDemo = localStorage.getItem("blindbuild_demo_mode");
    if (savedDemo !== null) {
      setDemoMode(savedDemo === "true");
    }
  }, []);

  const handleSetBuilder = (builder: AnonymousBuilder | null) => {
    setCurrentBuilder(builder);
    if (builder) {
      localStorage.setItem("blindbuild_current_builder", JSON.stringify(builder));
    } else {
      localStorage.removeItem("blindbuild_current_builder");
    }
  };

  const handleSetDemoMode = (val: boolean) => {
    setDemoMode(val);
    localStorage.setItem("blindbuild_demo_mode", val.toString());
    addToast({
      title: val ? "Demo Mode Activated" : "Demo Mode Deactivated",
      description: val
        ? "Fast-forward timers (10s auditions) and instant test inputs enabled."
        : "Standard real-time timers and strict validation restored.",
      type: "info",
    });
  };

  const addToast = (t: Omit<ToastMessage, "id">) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { ...t, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, t.type === "guardrail" ? 7000 : 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  const refreshData = async () => {
    try {
      const res = await fetch("/api/builders");
      if (res.ok) {
        const data = await res.json();
        if (data.builders && data.builders.length > 0 && !currentBuilder) {
          handleSetBuilder(data.builders[0]);
        }
      }
    } catch {
      // offline or loading
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentBuilder,
        setCurrentBuilder: handleSetBuilder,
        demoMode,
        setDemoMode: handleSetDemoMode,
        guardrailDrawerOpen,
        setGuardrailDrawerOpen,
        toasts,
        addToast,
        removeToast,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
