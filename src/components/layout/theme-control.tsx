"use client";

import { useId, useLayoutEffect, useRef } from "react";

import { isExplicitTheme, themeStorageKey } from "@/lib/theme";
import type { ThemePreference } from "@/lib/theme";

function applyPreference(preference: ThemePreference) {
  if (preference === "system") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", preference);

  // Desktop and mobile controls describe the same document preference.
  document.querySelectorAll<HTMLSelectElement>("[data-theme-control]").forEach((control) => {
    control.value = preference;
  });
}

function readPreference(): ThemePreference {
  try {
    const saved = localStorage.getItem(themeStorageKey);
    if (isExplicitTheme(saved)) return saved;
    if (saved !== null) localStorage.removeItem(themeStorageKey);
    return "system";
  } catch {
    // A manual selection can still work for this document when storage is blocked.
    const current = document.documentElement.getAttribute("data-theme");
    return isExplicitTheme(current) ? current : "system";
  }
}

export function ThemeControl({ className = "" }: { className?: string }) {
  const id = useId();
  const select = useRef<HTMLSelectElement>(null);

  useLayoutEffect(() => {
    // Also restores the head-script attribute after development Strict Mode remounts.
    applyPreference(readPreference());
    if (select.current) select.current.disabled = false;

    function syncStorage(event: StorageEvent) {
      if (event.key === themeStorageKey || event.key === null) applyPreference(readPreference());
    }
    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, []);

  return (
    <div className={`theme-control ${className}`}>
      <label htmlFor={id}>Theme</label>
      <select
        ref={select}
        id={id}
        data-theme-control=""
        defaultValue="system"
        disabled
        onChange={(event) => {
          const value = event.currentTarget.value;
          const preference: ThemePreference = isExplicitTheme(value) ? value : "system";
          applyPreference(preference);
          try {
            if (preference === "system") localStorage.removeItem(themeStorageKey);
            else localStorage.setItem(themeStorageKey, preference);
          } catch {
            // Keep the selected theme usable even when persistence is unavailable.
          }
        }}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <noscript><span className="theme-no-js">Follows your system setting.</span></noscript>
    </div>
  );
}
