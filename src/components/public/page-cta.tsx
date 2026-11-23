import Link from "next/link";

import { SectionLabel } from "@/components/home/section-heading";
import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";

export function PageCta({ title = "Let’s make the next step clear.", description = "Tell us what you need to build or improve, along with your timeline and any useful context." }: { title?: string; description?: string }) {
  return (
    <section className="page-cta section-space" aria-labelledby="page-cta-title">
      <Container>
        <SectionLabel>Start a conversation</SectionLabel>
        <div className="page-cta-grid">
          <div><h2 id="page-cta-title" className="section-heading">{title}</h2><p>{description}</p></div>
          <Link href="/contact" className={buttonClassName()}>Discuss a project <ArrowIcon /></Link>
        </div>
      </Container>
    </section>
  );
}
