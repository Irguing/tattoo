import * as React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
};

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition " +
    "focus:outline-none focus:ring-2 focus:ring-neon/40 disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-green700 text-sand hover:bg-green500 shadow-soft",
    outline: "border border-ink/20 bg-sand text-ink hover:bg-ink/5",
    ghost: "bg-transparent text-ink hover:bg-ink/5",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
