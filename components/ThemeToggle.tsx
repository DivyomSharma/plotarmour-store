"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const isDark = resolvedTheme !== "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex min-w-24 items-center justify-between border border-line px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground hover:border-foreground"
      aria-label="Toggle theme"
    >
      <span>{mounted ? (isDark ? "Dark" : "Light") : "Theme"}</span>
      <span className="text-accent">{mounted ? (isDark ? "01" : "00") : "--"}</span>
    </button>
  );
}
