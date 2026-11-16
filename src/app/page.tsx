import type { Metadata } from "next";

import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Application foundation",
};

/** Temporary runtime verification route. The marketing homepage is not built. */
export default function FoundationPage() {
  return (
    <main id="main-content" tabIndex={-1} className="py-16 sm:py-24">
      <Container>
        <div className="max-w-xl">
          <p className="font-mono text-xs tracking-wider text-muted uppercase">
            Bitmason Labs · Batch 1
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Application foundation ready.
          </h1>
          <p className="mt-5 text-muted">
            This temporary page verifies the application setup. The homepage
            design and content blueprint are documented in DESIGN_DIRECTION.md.
          </p>
        </div>
      </Container>
    </main>
  );
}
