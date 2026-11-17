import Link from "next/link";

import { SectionLabel } from "@/components/home/section-heading";
import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";

export function PageCta({ title = "Let’s make the next step clear.", description = "Tell us which customer journey or team workflow needs to work better. We can help define a practical scope around your business priorities." }: { title?: string; description?: string }) {
  return (
    <section className="page-cta section-space" aria-labelledby="page-cta-title">
      <Container>
        <SectionLabel number="↳">Start a conversation</SectionLabel>
        <div className="page-cta-grid">
          <div><h2 id="page-cta-title" className="section-heading">{title}</h2><p>{description}</p></div>
          <Link href="/contact" className={buttonClassName()}>Discuss a project <ArrowIcon /></Link>
        </div>
      </Container>
    </section>
  );
}
