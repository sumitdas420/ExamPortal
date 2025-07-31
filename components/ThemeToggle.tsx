'use client';

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure toggle renders only after mount, so SSR/CSR match.
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Avoid hydration mismatch: render placeholder or nothing until mounted
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        className="absolute right-6 top-6 z-50"
        tabIndex={-1}
        style={{ pointerEvents: "none", opacity: 0 }}
        // This keeps page layout from shifting if you want;
        // Remove or adjust as desired
      />
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      className="absolute right-6 top-6 z-50"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
