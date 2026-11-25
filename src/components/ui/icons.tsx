import type { ComponentProps } from "react";

type IconProps = ComponentProps<"svg">;

export function ArrowIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden="true" className={className} {...props}>
      <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true" className={className} {...props}>
      <path d="M2 14 14 2M2 2h12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

export function CapabilityIcon({ kind }: { kind: "experience" | "systems" | "intelligence" }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" width="48" height="48" aria-hidden="true" className="capability-icon">
      {kind === "experience" && <><rect x="5" y="8" width="38" height="30" rx="1" /><path d="M5 16h38M13 12h1m4 0h1M13 23h12m-12 6h8" /><rect x="30" y="22" width="7" height="10" /></>}
      {kind === "systems" && <><rect x="5" y="5" width="12" height="12" /><rect x="31" y="31" width="12" height="12" /><path d="M17 11h20v20M11 17v20h20" /><rect x="5" y="31" width="12" height="12" /><path d="M23 7v8m-4-4h8" /></>}
      {kind === "intelligence" && <><path d="m24 5 15 9v20l-15 9-15-9V14L24 5Z" /><path d="M24 5v12m15-3-10 6M9 14l10 6m5 11v12m15-9-10-6M9 34l10-6" /><rect x="19" y="18" width="10" height="12" rx="1" /></>}
    </svg>
  );
}
