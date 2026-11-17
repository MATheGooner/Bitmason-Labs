"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { prepareEnquiry } from "@/app/contact/actions";
import { Button, buttonClassName } from "@/components/ui/button";
import { ArrowIcon } from "@/components/ui/icons";
import { enquiryFields, enquiryLimits, initialEnquiryState, timelineOptions } from "@/lib/enquiry";
import type { EnquiryField } from "@/lib/enquiry";
import { services } from "@/lib/homepage";

const fieldLabels: Record<EnquiryField, string> = { name: "Your name", email: "Work email", company: "Business / organisation", service: "What do you need?", timeline: "Preferred timeline", message: "Project brief" };

export function EnquiryForm() {
  // The permalink keeps validation/results available on a native, no-JS POST.
  const [state, formAction, pending] = useActionState(prepareEnquiry, initialEnquiryState, "/contact");
  const [editedResponseId, setEditedResponseId] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const draftPanel = useRef<HTMLElement>(null);
  const edited = state.status === "ready" && editedResponseId === state.responseId;
  const draft = state.status === "ready" && !edited && !pending ? state.draft : null;

  useEffect(() => {
    if (state.status === "invalid") {
      form.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
    } else if (state.status === "ready") {
      draftPanel.current?.focus();
    }
  }, [state]);

  function describedBy(field: EnquiryField, hint?: string) {
    return [hint, state.errors[field] ? `${field}-error` : undefined].filter(Boolean).join(" ") || undefined;
  }

  function errorFor(field: EnquiryField) {
    return state.errors[field] ? <p className="field-error" id={`${field}-error`}>{state.errors[field]}</p> : null;
  }

  return (
    <div className="enquiry-form-area">
      <form key={state.responseId} ref={form} action={formAction} className="enquiry-form" aria-labelledby="enquiry-form-title" aria-describedby="enquiry-form-note" aria-busy={pending} onChange={() => setEditedResponseId(state.responseId)}>
        <div className="enquiry-form-heading"><h2 id="enquiry-form-title">Tell us about the project.</h2><p>Required fields are marked with an asterisk.</p></div>
        {state.status === "invalid" && <div className="form-error-summary" role="alert"><p>Please check the highlighted details.</p><ul>{enquiryFields.filter((field) => state.errors[field]).map((field) => <li key={field}><a href={`#${field}`}>{fieldLabels[field]}: {state.errors[field]}</a></li>)}</ul></div>}
        <fieldset disabled={pending}>
          <legend className="sr-only">Project enquiry details</legend>
          <div className="form-fields">
            <div className="form-field"><label htmlFor="name">Your name <span aria-hidden="true">*</span></label><input id="name" name="name" autoComplete="name" required minLength={2} maxLength={enquiryLimits.name} defaultValue={state.values.name} aria-invalid={Boolean(state.errors.name) || undefined} aria-describedby={describedBy("name")} />{errorFor("name")}</div>
            <div className="form-field"><label htmlFor="email">Work email <span aria-hidden="true">*</span></label><input id="email" name="email" type="email" autoComplete="email" required maxLength={enquiryLimits.email} defaultValue={state.values.email} aria-invalid={Boolean(state.errors.email) || undefined} aria-describedby={describedBy("email")} />{errorFor("email")}</div>
            <div className="form-field form-field-wide"><label htmlFor="company">Business / organisation <span aria-hidden="true">*</span></label><input id="company" name="company" autoComplete="organization" required minLength={2} maxLength={enquiryLimits.company} defaultValue={state.values.company} aria-invalid={Boolean(state.errors.company) || undefined} aria-describedby={describedBy("company")} />{errorFor("company")}</div>
            <div className="form-field"><label htmlFor="service">What do you need? <span className="field-optional">Optional</span></label><select id="service" name="service" defaultValue={state.values.service} aria-invalid={Boolean(state.errors.service) || undefined} aria-describedby={describedBy("service")}><option value="">To discuss</option>{services.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}</select>{errorFor("service")}</div>
            <div className="form-field"><label htmlFor="timeline">Preferred timeline <span className="field-optional">Optional</span></label><select id="timeline" name="timeline" defaultValue={state.values.timeline} aria-invalid={Boolean(state.errors.timeline) || undefined} aria-describedby={describedBy("timeline")}><option value="">To discuss</option>{timelineOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{errorFor("timeline")}</div>
            <div className="form-field form-field-wide"><label htmlFor="message">Project brief <span aria-hidden="true">*</span></label><p className="field-hint" id="message-hint">What should work better? Share the requirements, current tools and any useful context. 20–2,000 characters.</p><textarea id="message" name="message" rows={6} required minLength={20} maxLength={enquiryLimits.message} defaultValue={state.values.message} aria-invalid={Boolean(state.errors.message) || undefined} aria-describedby={describedBy("message", "message-hint")} />{errorFor("message")}</div>
          </div>
          <p className="form-data-note" id="enquiry-form-note">Your details are processed to validate and prepare an email draft. This website does not save the enquiry or send it. Your email app sends the message when you choose. Please leave out sensitive information.</p>
          <Button type="submit">{pending ? "Preparing draft…" : "Prepare email draft"}<ArrowIcon /></Button>
        </fieldset>
      </form>
      <p className="form-status" role="status" aria-live="polite">{pending ? "Checking your details and preparing the draft." : edited ? "Your details have changed. Prepare an updated draft before continuing." : ""}</p>
      {draft && <section ref={draftPanel} id="enquiry-draft" tabIndex={-1} className="enquiry-draft" aria-labelledby="draft-title">
        <p className="technical-label">Ready to review</p>
        <h2 id="draft-title">Your email draft is ready.</h2>
        <p>Nothing has been sent. Review the text, then open it in your email app and send when you’re ready.</p>
        <dl><div><dt>To</dt><dd>{draft.recipient}</dd></div><div><dt>Subject</dt><dd>{draft.subject}</dd></div></dl>
        <pre className="draft-body">{draft.body}</pre>
        <a href={draft.href} className={buttonClassName()}>Open draft in email app <ArrowIcon /></a>
        <p className="draft-fallback">If your email app does not open or fill in the text, copy the draft above into a new message to {draft.recipient}. If you edit the form details, prepare the draft again before sending.</p>
      </section>}
    </div>
  );
}
