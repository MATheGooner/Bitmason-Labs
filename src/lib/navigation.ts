export const navigation = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Approach", href: "/about#approach" },
  { label: "Company", href: "/about" },
] as const;

export type PublicPagePath = "/about" | "/services" | "/portfolio" | "/contact";
