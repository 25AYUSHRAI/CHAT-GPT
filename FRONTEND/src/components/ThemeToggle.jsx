import React, { useEffect, useState } from "react";

/*
 Behavior:
 - If user has saved preference in localStorage ("light"|"dark"|"system"), use that.
 - If no saved preference or preference === "system", follow OS setting via matchMedia and update live on change.
 - Clicking the button cycles: system -> dark -> light -> system (persisting the chosen mode).
*/

export default function ThemeToggle() {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem("theme") || "system";
    } catch {
      return "system";
    }
  });

  // apply theme and (when mode === 'system') subscribe to system changes
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (resolved) => {
      if (resolved === "dark") root.classList.add("theme-dark");
      else root.classList.remove("theme-dark");
    };

    const resolveSystem = () =>
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    if (mode === "system") {
      applyTheme(resolveSystem());
      const mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
      if (mq) {
        const handler = (e) => applyTheme(e.matches ? "dark" : "light");
        if (mq.addEventListener) mq.addEventListener("change", handler);
        else mq.addListener(handler);
        return () => {
          if (mq.removeEventListener) mq.removeEventListener("change", handler);
          else mq.removeListener(handler);
        };
      }
    } else {
      applyTheme(mode);
    }
    return undefined;
  }, [mode]);

  // persist selection
  useEffect(() => {
    try {
      localStorage.setItem("theme", mode);
    } catch {}
  }, [mode]);

  // compute resolved (actual) theme for button label
  const resolvedTheme = (() => {
    if (mode === "system") {
      try {
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      } catch {
        return "light";
      }
    }
    return mode;
  })();

  // cycle order: system -> dark -> light -> system
  const handleClick = () => {
    setMode((m) => {
      if (m === "system") return "dark";
      if (m === "dark") return "light";
      return "system";
    });
  };

  return (
    <button
      type="button"
      className="btn theme-toggle"
      onClick={handleClick}
      aria-pressed={resolvedTheme === "dark"}
      title={`Theme: ${mode} (resolved ${resolvedTheme}). Click to toggle mode.`}
    >
      {mode === "system" ? `System (${resolvedTheme})` : mode === "dark" ? "Dark" : "Light"}
    </button>
  );
}