import { EnquiryForm } from "@/components/contact/enquiry-form";
import { PublicPage } from "@/components/layout/public-page";
import { PageHero } from "@/components/public/page-hero";
import { Container } from "@/components/ui/container";
import { publicPageMetadata } from "@/lib/metadata";
import { projectEnquiryHref, site } from "@/lib/site";

export const metadata = publicPageMetadata("Contact", `Discuss a website or software project to support enquiries, sales, bookings and operations. Prepare an email draft or contact ${site.email}.`, "/contact");

export default function ContactPage() {
  return (
    <PublicPage activePage="/contact">
      <PageHero eyebrow="Start a conversation" title={<>What should work<br /><span>better in your business?</span></>} description="A clearer path to enquiries, online sales or bookings. A better way for your team to handle the work. Tell us what you want to improve and which tools you use today." />
      <section className="contact-page-section" aria-label="Project enquiries">
        <Container>
          <div className="contact-page-grid">
            <div className="contact-page-aside">
              <p className="technical-label">A useful first conversation</p>
              <h2>Start with what you know.</h2>
              <p>You don’t need a finished specification. A little context about the business, the task and the intended timeline gives us a useful starting point.</p>
              <ol><li><span>01</span> Share your requirements.</li><li><span>02</span> Review the prepared draft.</li><li><span>03</span> Send it from your email app.</li></ol>
              <div className="contact-direct"><h3>Prefer to email directly?</h3><a href={`mailto:${site.email}`} className="contact-email">{site.email}</a><a href={projectEnquiryHref} className="text-link">Open a project email draft <span aria-hidden="true">↗</span></a><p>Working with businesses internationally.</p></div>
            </div>
            <EnquiryForm />
          </div>
        </Container>
      </section>
    </PublicPage>
  );
}
