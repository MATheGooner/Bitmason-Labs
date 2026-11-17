"use client";
import Image from "next/image";
import type { ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "src" | "onError"> & { src: string; onUnavailable?: () => void };

/** Preserve each presentation's geometry when an empty or unavailable image is encountered. */
export function PortfolioImage({ src, alt, onUnavailable, ...props }: Props) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  if (!src || failedSource === src) {
    const ratio = props.width && props.height ? `${props.width} / ${props.height}` : "16 / 10";
    return <span role="img" aria-label={`Image unavailable${alt ? `: ${alt}` : ""}`} className={`portfolio-image-fallback ${props.className ?? ""}`}
      style={{ ...props.style, ...(props.fill ? { position: "absolute", inset: 0 } : { aspectRatio: ratio }) }}><span>Image unavailable</span></span>;
  }
  return <Image {...props} src={src} alt={alt} onError={() => { setFailedSource(src); onUnavailable?.(); }} />;
}
