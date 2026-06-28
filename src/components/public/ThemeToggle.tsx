"use client";

import { useEffect, useState } from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";

type Theme = "light" | "dark";

const storageKey = "portfolio-theme";

function getPreferredTheme(): Theme {
  const storedTheme = window.localStorage.getItem(storageKey);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getPreferredTheme());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(storageKey, theme);
  }, [mounted, theme]);

  const nextTheme = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${nextTheme} theme`;
  const Icon = theme === "dark" ? IconMoon : IconSun;

  return (
    <button className="theme-toggle" type="button" aria-label={label} title={label} onClick={() => setTheme(nextTheme)}>
      <Icon className="theme-toggle-icon" aria-hidden="true" size={18} stroke={1.8} />
      <span className="theme-toggle-text">{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
