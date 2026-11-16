import Link from "next/link";

import { PublicPage } from "@/components/layout/public-page";
import { PageHero } from "@/components/public/page-hero";
import { buttonClassName } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PublicPage>
      <PageHero eyebrow="404 / Page unavailable" title="Page not found." description="The requested page is unavailable. Explore our services and portfolio, or return to the homepage.">
        <Link href="/" className={buttonClassName("secondary")}>
          Return to the start
        </Link>
      </PageHero>
    </PublicPage>
  );
}
