"use client";

import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

export function Providers({ children }) {
  // Ensure the component is mounted on the client before rendering ThemeProvider
  // to avoid hydration mismatch issues.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render children directly on the server or before mount
    // Or return null/placeholder if preferred to avoid flash of unstyled content
    return <>{children}</>;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}
