/**
 * Badge component — order status and product labels.
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "paid" | "pending" | "cancelled" | "dispatched" | "delivered" | "new" | "hot" | "in-stock" | "low-stock" | "out-stock";
}

const variantClasses: Record<string, string> = {
  default: "bg-obsidian-light text-foreground border-obsidian-steel",
  paid: "bg-status-paid/15 text-status-paid border-status-paid/30",
  pending: "bg-status-pending/15 text-status-pending border-status-pending/30",
  cancelled: "bg-status-cancelled/15 text-status-cancelled border-status-cancelled/30",
  dispatched: "bg-status-dispatched/15 text-status-dispatched border-status-dispatched/30",
  delivered: "bg-status-paid/15 text-status-paid border-status-paid/30",
  new: "bg-gold/15 text-gold border-gold/30",
  hot: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  "in-stock": "bg-status-paid/15 text-status-paid border-status-paid/30",
  "low-stock": "bg-status-pending/15 text-status-pending border-status-pending/30",
  "out-stock": "bg-status-cancelled/15 text-status-cancelled border-status-cancelled/30",
};

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border text-xs font-semibold px-2 py-0.5 rounded-full",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, BadgeProps["variant"]> = {
    Pending: "pending", Packed: "dispatched", Dispatched: "dispatched",
    Delivered: "delivered", Cancelled: "cancelled",
  };
  return <Badge variant={map[status]}>{status}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, BadgeProps["variant"]> = {
    Pending: "pending", Paid: "paid", Failed: "cancelled",
  };
  return <Badge variant={map[status]}>{status}</Badge>;
}
