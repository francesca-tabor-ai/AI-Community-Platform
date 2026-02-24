import * as React from "react";
import { cn } from "@/lib/utils";

const variantClasses: Record<string, string> = {
  default: "border-transparent bg-violet-100 text-violet-700",
  secondary: "border-transparent bg-slate-100 text-slate-700",
  destructive: "border-transparent bg-red-100 text-red-700",
  outline: "border-slate-300 bg-transparent text-slate-700",
  owner: "border-amber-200 bg-amber-100 text-amber-700",
  moderator: "border-violet-200 bg-violet-100 text-violet-700",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variantClasses;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variantClasses[variant] ?? variantClasses.default,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
