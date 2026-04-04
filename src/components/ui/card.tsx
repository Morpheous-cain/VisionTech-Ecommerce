/**
 * Card components — implements the four VisionTech card variants:
 * GoldTopCard, DarkNavyCard, OutlinedCard, FlatDarkCard
 */
import * as React from "react";
import { cn } from "@/lib/utils";

// ── Gold-Top Card ──────────────────────────────────────────
export function GoldTopCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("card-gold-top p-5", className)} {...props}>
      {children}
    </div>
  );
}

// ── Dark Navy Card ─────────────────────────────────────────
export function DarkNavyCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("card-dark-navy p-5", className)} {...props}>
      {children}
    </div>
  );
}

// ── Outlined Card ──────────────────────────────────────────
export function OutlinedCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("card-outlined p-5", className)} {...props}>
      {children}
    </div>
  );
}

// ── Flat Dark Card ─────────────────────────────────────────
export function FlatDarkCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("card-flat-dark p-5", className)} {...props}>
      {children}
    </div>
  );
}

// Generic card for shadcn compatibility
export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card-dark-navy p-5", className)} {...props}>{children}</div>;
}
export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props}>{children}</div>;
}
export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-display text-lg text-gold-light", className)} {...props}>{children}</h3>;
}
export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props}>{children}</div>;
}
