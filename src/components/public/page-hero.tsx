import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
  aside?: ReactNode;
  breadcrumb?: { href: string; label: string };
}

export function PageHero({ eyebrow, title, description, children, aside, breadcrumb }: PageHeroProps) {
  return (
    <section id="top" tabIndex={-1} className="page-hero" aria-labelledby="page-title">
      <Container>
        {breadcrumb && <nav aria-label="Breadcrumb" className="page-breadcrumb"><Link href={breadcrumb.href}>← {breadcrumb.label}</Link><span aria-hidden="true">/</span><span aria-current="page">Case study</span></nav>}
        <div className={`page-hero-grid${aside ? " page-hero-with-aside" : ""}`}>
          <div>
            <p className="hero-eyebrow"><span aria-hidden="true" />{eyebrow}</p>
            <h1 id="page-title">{title}</h1>
            <p className="page-lead">{description}</p>
            {children && <div className="page-hero-actions">{children}</div>}
          </div>
          {aside}
        </div>
      </Container>
    </section>
  );
}
