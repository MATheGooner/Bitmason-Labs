import Link from "next/link";

import { Brand } from "@/components/layout/brand";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { ThemeControl } from "@/components/layout/theme-control";
import { Container } from "@/components/ui/container";
import { buttonClassName } from "@/components/ui/button";
import { ArrowIcon } from "@/components/ui/icons";
import { navigation } from "@/lib/navigation";
import type { PublicPagePath } from "@/lib/navigation";
import { site } from "@/lib/site";

export function SiteHeader({ activePage }: { activePage?: PublicPagePath }) {
  return (
    <header className="site-header">
      <Container className="header-inner">
        <Brand />
        <nav className="desktop-navigation" aria-label="Main navigation">
          {navigation.map((item) => <Link key={item.href} href={item.href} aria-current={item.href === activePage ? "page" : undefined}>{item.label}</Link>)}
        </nav>
        <div className="header-actions">
          <ThemeControl />
          <Link className={`${buttonClassName()} header-enquiry`} href="/contact" aria-current={activePage === "/contact" ? "page" : undefined}>Discuss a project <ArrowIcon /></Link>
        </div>
        <MobileNavigation>
          <nav aria-label="Mobile navigation">
            {navigation.map((item) => <Link key={item.href} href={item.href} aria-current={item.href === activePage ? "page" : undefined}>{item.label}</Link>)}
            <Link className={buttonClassName()} href="/contact" aria-current={activePage === "/contact" ? "page" : undefined}>Discuss a project <ArrowIcon /></Link>
          </nav>
          <ThemeControl className="mobile-theme-control" />
          <p className="technical-label">{site.tagline}</p>
        </MobileNavigation>
      </Container>
    </header>
  );
}
