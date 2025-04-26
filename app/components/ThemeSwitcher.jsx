"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Check if dark mode is active
  const isDark = theme === "dark" || resolvedTheme === "dark";

  // All useEffect hooks must be defined at the top level, before any conditionals

  // First useEffect - handle mounted state
  useEffect(() => {
    setMounted(true);
    // Debug log to check if theme is changing
    console.log("Current theme:", theme);
  }, [theme]);

  // Second useEffect - debug info (now before the conditional return)
  useEffect(() => {
    if (mounted) {
      console.log("Theme state:", {
        theme,
        resolvedTheme,
        isDark,
        htmlClass: document.documentElement.classList.contains("dark"),
      });
    }
  }, [theme, resolvedTheme, isDark, mounted]);

  // Force direct DOM manipulation of the class for immediate effect
  const toggleTheme = () => {
    console.log(
      "Toggling theme from",
      theme,
      "to",
      theme === "light" ? "dark" : "light"
    );

    // Directly manipulate the class on HTML element
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  };

  // Conditional return after all hooks are defined
  if (!mounted) {
    // Render a placeholder or null on the server/before mount
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle theme"
      style={{
        color: theme === "light" ? "#333333" : "#f0f0f0",
      }} /* Inline style to ensure text is visible */
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};
