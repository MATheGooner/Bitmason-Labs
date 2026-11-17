import { services } from "@/lib/homepage";
import { site } from "@/lib/site";

export const enquiryFields = ["name", "email", "company", "service", "timeline", "message"] as const;
export type EnquiryField = (typeof enquiryFields)[number];
export type EnquiryValues = Record<EnquiryField, string>;
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

export const enquiryLimits = { name: 80, email: 254, company: 120, service: 64, timeline: 64, message: 2000 } as const;
export const timelineOptions = [
  { value: "exploring", label: "Exploring options" },
  { value: "next-three-months", label: "Within the next three months" },
  { value: "three-six-months", label: "In three to six months" },
  { value: "flexible", label: "Flexible" },
] as const;

export interface EnquiryDraft {
  readonly recipient: string;
  readonly subject: string;
  readonly body: string;
  readonly href: string;
}

export interface EnquiryState {
  readonly status: "idle" | "invalid" | "ready";
  readonly responseId: string;
  readonly values: EnquiryValues;
  readonly errors: EnquiryErrors;
  readonly draft: EnquiryDraft | null;
}

export const initialEnquiryState: EnquiryState = {
  status: "idle",
  responseId: "",
  values: { name: "", email: "", company: "", service: "", timeline: "", message: "" },
  errors: {},
  draft: null,
};

/** Validate at the request boundary, including bypassed browser constraints. */
export function validateEnquiry(formData: FormData): { values: EnquiryValues; errors: EnquiryErrors } {
  const values = { ...initialEnquiryState.values };
  const errors: EnquiryErrors = {};
  for (const field of enquiryFields) {
    const entries = formData.getAll(field);
    if (entries.length > 1 || entries.some((entry) => typeof entry !== "string")) {
      errors[field] = "Enter a single text value for this field.";
      continue;
    }
    const entry = entries[0];
    const value = typeof entry === "string" ? entry.replace(/\r\n?/g, "\n").trim() : "";
    if (value.length > enquiryLimits[field]) errors[field] = `Use ${enquiryLimits[field]} characters or fewer.`;
    // Bound reflected values even when a crafted request exceeds the limit.
    values[field] = value.slice(0, enquiryLimits[field]);
    const invalidControls = [...value].some((character) => {
      const code = character.charCodeAt(0);
      return (code < 32 || code === 127) && (field !== "message" || (code !== 9 && code !== 10));
    });
    if (invalidControls) errors[field] = field === "message" ? "Remove unsupported control characters." : "Use a single line without control characters.";
  }

  if (!errors.name && values.name.length < 2) errors.name = "Enter your name (at least 2 characters).";
  if (!errors.company && values.company.length < 2) errors.company = "Enter your business or organisation name.";
  const emailPattern = /^[a-z\d.!#$%&'*+/=?^_`{|}~-]+@(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.)+[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?$/i;
  const emailLocalPart = values.email.split("@")[0] ?? "";
  if (!errors.email && (!emailPattern.test(values.email) || emailLocalPart.length > 64 || emailLocalPart.startsWith(".") || emailLocalPart.endsWith(".") || emailLocalPart.includes(".."))) errors.email = "Enter a valid email address, such as name@company.com.";
  if (!errors.message && values.message.length < 20) errors.message = "Tell us a little more about the project (at least 20 characters).";
  if (!errors.service && values.service && !services.some((service) => service.id === values.service)) errors.service = "Choose a service from the list, or leave it undecided.";
  if (!errors.timeline && values.timeline && !timelineOptions.some((option) => option.value === values.timeline)) errors.timeline = "Choose a timeline from the list, or leave it undecided.";
  return { values, errors };
}

export function createEnquiryDraft(values: EnquiryValues): EnquiryDraft {
  const subject = `Project enquiry — ${values.company}`;
  const service = services.find((item) => item.id === values.service)?.title ?? "To discuss";
  const timeline = timelineOptions.find((item) => item.value === values.timeline)?.label ?? "To discuss";
  const body = `Hello Bitmason Labs,\n\nI'd like to discuss a project.\n\nName: ${values.name}\nEmail: ${values.email}\nBusiness: ${values.company}\nService: ${service}\nPreferred timeline: ${timeline}\n\nProject brief:\n${values.message}\n\nBest regards,\n${values.name}`;
  return { recipient: site.email, subject, body, href: `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
