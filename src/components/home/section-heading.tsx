import type { ReactNode } from "react";

export function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <p className="section-label"><span aria-hidden="true">{number} /</span> {children}</p>;
}

export function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return <h2 id={id} className="section-heading">{children}</h2>;
}
