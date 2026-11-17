import Link from "next/link";

import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 40" width="36" height="40" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M2 2h14v24H2zM20 14h14v24H20z" />
    </svg>
  );
}

export function Brand({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} aria-label={`${site.name} — home`} className={cn("brand", className)}>
      <BrandMark />
      <span>Bitmason <span className="brand-labs">Labs</span></span>
    </Link>
  );
}
