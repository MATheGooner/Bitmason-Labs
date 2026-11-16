import Link from "next/link";

import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="py-16 sm:py-24">
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight">Page not found.</h1>
        <p className="mt-4 mb-8 text-muted">The requested page is unavailable.</p>
        <Link href="/" className={buttonClassName("secondary")}>
          Return to the start
        </Link>
      </Container>
    </main>
  );
}
