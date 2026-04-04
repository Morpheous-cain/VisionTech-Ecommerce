/**
 * Input component — styled for VisionTech dark theme.
 */
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-obsidian-steel bg-obsidian-card px-3 py-2",
        "text-sm text-foreground placeholder:text-obsidian-steel",
        "focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/60",
        "disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
