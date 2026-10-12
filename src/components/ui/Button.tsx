import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "accent" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "bg-ink text-ivory hover:bg-ink/90 disabled:bg-ink/40",
  outline: "bg-transparent text-ink border border-ink hover:bg-ink hover:text-ivory disabled:opacity-40",
  accent: "bg-terracotta text-ivory hover:bg-terracotta/90 disabled:bg-terracotta/40",
  ghost: "bg-transparent text-ink hover:bg-sand disabled:opacity-40",
};

const SIZE_CLASS: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", fullWidth, className = "", children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-[var(--radius-ui)] font-medium uppercase tracking-wide transition-colors duration-300 disabled:cursor-not-allowed ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
