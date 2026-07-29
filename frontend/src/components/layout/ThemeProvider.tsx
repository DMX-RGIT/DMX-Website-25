"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dmx-theme") as Theme | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("dmx-theme", theme);
    }
  }, [theme, mounted]);

  // Listen for theme toggle events from CommandPalette (which can't use the hook directly)
  useEffect(() => {
    const handleToggleEvent = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    window.addEventListener("dmx-toggle-theme", handleToggleEvent);
    return () => window.removeEventListener("dmx-toggle-theme", handleToggleEvent);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  // Prevent flash of wrong theme but still provide context
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: "dark", toggleTheme }}>
        <div style={{ visibility: "hidden" }}>
          {children}
        </div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
