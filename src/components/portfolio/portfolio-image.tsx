"use client";
import Image, { getImageProps } from "next/image";
import type { ImageProps } from "next/image";
import { useState } from "react";
import type { ProjectImage } from "@/lib/portfolio";

type Props = Omit<ImageProps, "src" | "onError"> & { src: string; mobile?: ProjectImage | undefined; onUnavailable?: () => void };

/** Preserve each presentation's geometry when an empty or unavailable image is encountered. */
export function PortfolioImage({ src, alt, mobile, onUnavailable, ...props }: Props) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  if (!src || failedSource === src) {
    const ratio = props.width && props.height ? `${props.width} / ${props.height}` : "16 / 10";
    return <span role="img" aria-label={`Image unavailable${alt ? `: ${alt}` : ""}`} className={`portfolio-image-fallback ${props.className ?? ""}`}
      style={{ ...props.style, ...(props.fill ? { position: "absolute", inset: 0 } : { aspectRatio: ratio }) }}><span>Image unavailable</span></span>;
  }
  const picture = <Image {...props} src={src} alt={alt} onError={() => { setFailedSource(src); onUnavailable?.(); }} />;
  if (!mobile) return picture;
  const { props: mobileProps } = getImageProps({ src: mobile.src, alt, width: mobile.width, height: mobile.height, sizes: props.sizes });
  return <picture>
    <source media="(max-width: 767px)" srcSet={mobileProps.srcSet} sizes={mobileProps.sizes} width={mobile.width} height={mobile.height} />
    {picture}
  </picture>;
}
