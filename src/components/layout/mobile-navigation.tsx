"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

/** Native disclosure stays usable before hydration and with JavaScript disabled. */
export function MobileNavigation({ children }: { children: ReactNode }) {
  const disclosure = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const details = disclosure.current;
    if (!details) return;
    const summary = details.querySelector("summary");

    // Enhance the native disclosure without leaving stale ARIA when JS is off.
    function syncExpanded() {
      summary?.setAttribute("aria-expanded", String(details?.open));
    }
    syncExpanded();

    function closeOutside(event: PointerEvent) {
      if (details?.open && event.target instanceof Node && !details.contains(event.target)) {
        if (details.contains(document.activeElement)) summary?.focus();
        details.removeAttribute("open");
      }
    }

    function closeWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && details?.open) {
        details.removeAttribute("open");
        summary?.focus();
      }
    }

    function closeWhenFocusLeaves(event: FocusEvent) {
      if (event.relatedTarget instanceof Node && !details?.contains(event.relatedTarget)) {
        details?.removeAttribute("open");
      }
    }

    const desktop = window.matchMedia("(min-width: 1024px)");
    function closeOnDesktop() {
      if (desktop.matches) details?.removeAttribute("open");
    }

    details.addEventListener("toggle", syncExpanded);
    details.addEventListener("focusout", closeWhenFocusLeaves);
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeWithEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      details.removeEventListener("toggle", syncExpanded);
      details.removeEventListener("focusout", closeWhenFocusLeaves);
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeWithEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, []);

  return (
    <details ref={disclosure} className="mobile-navigation">
      <summary role="button" aria-controls="mobile-navigation-panel">
        <span className="menu-open-label">Menu</span>
        <span className="menu-close-label">Close</span>
        <span className="menu-symbol" aria-hidden="true" />
      </summary>
      <div
        id="mobile-navigation-panel"
        className="mobile-navigation-panel"
        onClick={(event) => {
          if (!(event.target instanceof Element)) return;
          const link = event.target.closest("a");
          if (!link) return;
          disclosure.current?.removeAttribute("open");
          const href = link.getAttribute("href");
          if (href?.startsWith("#")) {
            requestAnimationFrame(() => document.getElementById(href.slice(1))?.focus({ preventScroll: true }));
          }
        }}
      >
        {children}
      </div>
    </details>
  );
}
