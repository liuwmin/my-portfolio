import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-sm border border-white/15 bg-white/[0.03] px-6 py-3 text-xs uppercase tracking-[0.25em] text-neutral-100 backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/[0.08]",
        className
      )}
      {...props}
    />
  );
}
