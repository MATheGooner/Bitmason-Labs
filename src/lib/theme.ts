/** Browser preferences only; no cookies, accounts or server configuration. */
export const themeStorageKey = "bitmason-theme";
export type ThemePreference = "system" | "light" | "dark";

export function isExplicitTheme(value: string | null): value is "light" | "dark" {
  return value === "light" || value === "dark";
}

// Run synchronously in the document head. With no override, CSS follows the OS.
// This is a fixed script: it never interpolates visitor-supplied content.
export const themeInitialisationScript = `(function(){var r=document.documentElement;try{var t=localStorage.getItem(${JSON.stringify(themeStorageKey)});if(t==="light"||t==="dark"){r.setAttribute("data-theme",t)}else{r.removeAttribute("data-theme");if(t!==null)localStorage.removeItem(${JSON.stringify(themeStorageKey)})}}catch(e){}})();`;
