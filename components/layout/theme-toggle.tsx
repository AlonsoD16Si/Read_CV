/**
 * Theme toggle button
 */

"use client";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme}>
      {theme === "light" ? "🌙" : "☀️"}
    </Button>
  );
}

