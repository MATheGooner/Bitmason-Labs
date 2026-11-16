import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary";
type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary: "border-accent bg-accent text-white hover:border-accent-hover hover:bg-accent-hover",
  secondary: "border-line bg-transparent text-ink hover:border-ink hover:bg-surface",
};

/** Also usable on next/link; use links for navigation and buttons for actions. */
export function buttonClassName(variant: ButtonVariant = "primary"): string {
  return cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border px-5 py-3 text-sm font-semibold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
  );
}

export function Button({
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return <button className={cn(buttonClassName(variant), className)} type={type} {...props} />;
}
