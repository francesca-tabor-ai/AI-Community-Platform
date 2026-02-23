import * as React from "react";
import { cn } from "@/lib/utils";

const variantClasses: Record<string, string> = {
  default: "border-transparent bg-teal-500/20 text-teal-400",
  secondary: "border-transparent bg-slate-600/30 text-slate-400",
  destructive: "border-transparent bg-red-500/20 text-red-400",
  outline: "border-slate-600/50 bg-transparent text-slate-400",
  owner: "border-amber-500/30 bg-amber-500/20 text-amber-400",
  moderator: "border-teal-500/30 bg-teal-500/20 text-teal-400",
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
