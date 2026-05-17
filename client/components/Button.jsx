"use client";

import Link from "next/link";

const VARIANTS = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 disabled:bg-brand-300",
  secondary:
    "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 focus:ring-slate-300 disabled:opacity-60",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-300 disabled:opacity-60",
};

const SIZES = {
  sm: "px-2.5 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium " +
  "focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed transition-colors";

export default function Button({
  variant = "primary",
  size = "md",
  href,
  className = "",
  children,
  ...rest
}) {
  const classes = `${BASE} ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`;
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
