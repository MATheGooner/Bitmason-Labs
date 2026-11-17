import Link from "next/link";

import { Brand } from "@/components/layout/brand";
import { Container } from "@/components/ui/container";
import { navigation } from "@/lib/navigation";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-main">
          <div className="footer-brand">
            <Brand />
            <p>{site.tagline}</p>
            <p className="footer-description">Websites that support enquiries, sales and bookings.<br className="desktop-break" /> Software that connects the work behind them.</p>
          </div>
          <nav aria-label="Footer navigation">
            <p className="technical-label">Explore</p>
            {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
            <Link href="/contact">Contact</Link>
          </nav>
          <nav aria-label="Footer services">
            <p className="technical-label">What we build</p>
            <Link href="/services#service-websites">Websites & e-commerce</Link>
            <Link href="/services#service-applications">Applications & systems</Link>
            <Link href="/services#service-integrations">APIs & integrations</Link>
            <Link href="/services#service-automation">Automation & AI</Link>
          </nav>
          <div className="footer-contact">
            <p className="technical-label">Start a conversation</p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <p>Working with businesses internationally.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <a href="#top">Back to top <span aria-hidden="true">↑</span></a>
        </div>
      </Container>
    </footer>
  );
}
