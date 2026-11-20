"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Content stays visible without JavaScript, observer support or animation. */
export function EntranceMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !window.IntersectionObserver || !Element.prototype.animate) return;
    const main = document.getElementById("main-content");
    if (!main) return;
    const seen = new WeakSet<Element>();
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches) continue;
        const animation = entry.target.animate([{ opacity: 0.7, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: "ease-out" });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: 0.05 });
    const observe = () => main.querySelectorAll(":scope > section:not(:first-child)").forEach((section) => {
      if (seen.has(section)) return;
      seen.add(section);
      observer.observe(section);
    });
    observe();
    const mutations = new MutationObserver(observe);
    mutations.observe(main, { childList: true });
    const stop = () => { if (preference.matches) animations.forEach((animation) => animation.cancel()); };
    preference.addEventListener("change", stop);
    return () => { observer.disconnect(); mutations.disconnect(); animations.forEach((animation) => animation.cancel()); preference.removeEventListener("change", stop); };
  }, [pathname]);
  return null;
}
