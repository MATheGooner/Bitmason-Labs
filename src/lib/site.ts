/** Public brand details only. Keep credentials and operational config in server/. */
export const site = {
  name: "Bitmason Labs",
  url: "https://bitmasonlabs.com",
  tagline: "From customer interest to everyday operations.",
  title: "Websites & business software",
  // Business enquiry inbox confirmed by the owner on 15 November 2026.
  email: "contact@bitmasonlabs.com",
  description:
    "Websites, online stores and custom software that support enquiries, sales, bookings and everyday operations. Working with businesses internationally.",
} as const;

export const projectEnquiryHref = `mailto:${site.email}?subject=${encodeURIComponent("Project enquiry — Bitmason Labs")}&body=${encodeURIComponent("Hello Bitmason Labs,\n\nI'd like to discuss a project.\n\nBusiness and website:\nWhat we need to build or improve:\nPreferred timeline:\nIndicative budget, if known:\n\nBest regards,\n")}`;
