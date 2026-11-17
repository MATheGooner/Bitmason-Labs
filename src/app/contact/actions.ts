"use server";

import { createEnquiryDraft, validateEnquiry } from "@/lib/enquiry";
import type { EnquiryState } from "@/lib/enquiry";

/** Prepare a draft only. No storage, email provider or delivery side effect. */
export async function prepareEnquiry(_previousState: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const { values, errors } = validateEnquiry(formData);
  const valid = Object.keys(errors).length === 0;
  return {
    status: valid ? "ready" : "invalid",
    responseId: crypto.randomUUID(),
    values,
    errors,
    draft: valid ? createEnquiryDraft(values) : null,
  };
}
