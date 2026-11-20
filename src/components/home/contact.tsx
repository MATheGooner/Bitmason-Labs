import Link from "next/link";

import { SectionLabel } from "@/components/home/section-heading";
import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { projectEnquiryHref, site } from "@/lib/site";

export function Contact() {
  return (
    <section id="contact" tabIndex={-1} className="contact-section section-space" aria-labelledby="contact-title">
      <Container>
        <SectionLabel>Let’s build something useful</SectionLabel>
        <div className="contact-grid">
          <div><h2 id="contact-title">What should work<br /><span>better in your business?</span></h2><p>Help customers enquire, buy or book. Make everyday work easier for your team. Tell us which part of your business needs a better digital experience.</p></div>
          <div className="contact-actions"><a href={projectEnquiryHref} className={buttonClassName()}>Email us about a project <ArrowIcon /></a><a href={`mailto:${site.email}`} className="contact-email">{site.email}</a><p>Share your requirements, timeline and any useful context. We’ll help you define a practical next step.</p><Link href="/contact" className="text-link">Prepare your enquiry online <ArrowIcon /></Link></div>
        </div>
      </Container>
    </section>
  );
}
