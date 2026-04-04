/**
 * StatCard — DarkNavy variant for admin dashboard stats.
 * Shows revenue today, orders, etc.
 */
import React from "react";
import { DarkNavyCard } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, change, icon, className }: StatCardProps) {
  const positive = (change ?? 0) >= 0;
  return (
    <DarkNavyCard className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs text-obsidian-steel uppercase tracking-wider font-medium">{label}</p>
        {icon && <div className="text-gold/50">{icon}</div>}
      </div>
      <p className="font-display text-2xl font-bold text-gold">{value}</p>
      {change !== undefined && (
        <div className={cn("flex items-center gap-1 text-xs font-medium", positive ? "text-status-paid" : "text-status-cancelled")}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {positive ? "+" : ""}{change}% vs yesterday
        </div>
      )}
    </DarkNavyCard>
  );
}
