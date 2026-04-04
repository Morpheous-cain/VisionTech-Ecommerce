/**
 * Button component — VisionTech branded variants.
 * Variants: gold (primary CTA), secondary, outlined, ghost, destructive
 */
"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        gold: "bg-gold text-obsidian-deep hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20",
        secondary: "border border-gold/40 text-gold hover:border-gold hover:bg-gold/5",
        outlined: "border border-obsidian-steel text-foreground hover:border-gold/50 hover:text-gold-light",
        ghost: "text-gold-light hover:text-gold hover:bg-gold/5",
        destructive: "bg-status-cancelled/20 text-status-cancelled border border-status-cancelled/30 hover:bg-status-cancelled/30",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "gold", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
