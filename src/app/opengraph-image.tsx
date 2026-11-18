import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function SharingImage() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: "#f6f5f0", color: "#202623", padding: 72 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 40 }}>
        <svg width="54" height="60" viewBox="0 0 36 40"><path fill="#185442" d="M2 2h14v24H2zM20 14h14v24H20z" /></svg>
        <span>{site.name}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", maxWidth: 970, fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>{site.title}</div>
        <div style={{ display: "flex", fontSize: 30, color: "#57615a" }}>{site.tagline}</div>
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#185442" }}>bitmasonlabs.com</div>
    </div>, size,
  );
}
