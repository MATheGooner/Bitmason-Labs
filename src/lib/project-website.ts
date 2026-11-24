/** Use the saved destination only when it is an absolute HTTPS website URL. */
export function getProjectWebsiteUrl(value: string | null | undefined): string | null {
  const href = value?.trim();
  if (!href) return null;
  try {
    const url = new URL(href);
    return url.protocol === "https:" && !url.username && !url.password ? href : null;
  } catch {
    return null;
  }
}
