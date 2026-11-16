type ClassName = string | false | null | undefined;

/** Compose optional class names; this deliberately does not merge utilities. */
export function cn(...classNames: ClassName[]): string {
  return classNames.filter(Boolean).join(" ");
}
