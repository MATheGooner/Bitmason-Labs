import Link from "next/link";

import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" tabIndex={-1} className="hero-section" aria-labelledby="hero-title">
      <Container>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-eyebrow"><span aria-hidden="true" />Digital engineering for business.</p>
            <h1 id="hero-title">Make it easier to choose you.<br className="hero-break" /> <span>Make the work behind it simpler.</span></h1>
            <p className="hero-introduction">Websites, online stores and business software that connect the customer experience to the work your team needs to do.</p>
            <div className="hero-actions">
              <Link href="/contact" className={buttonClassName()}>Discuss a project <ArrowIcon /></Link>
              <a href="#capabilities" className="text-link">Explore what we build <ArrowIcon /></a>
            </div>
          </div>
        </div>
        <div className="hero-signature">
          <p>{site.tagline}</p>
          <span className="technical-label">Customer journeys. Connected systems.</span>
          <a href="#company" aria-label="Discover Bitmason Labs" className="hero-scroll"><span aria-hidden="true">↓</span></a>
        </div>
      </Container>
    </section>
  );
}
