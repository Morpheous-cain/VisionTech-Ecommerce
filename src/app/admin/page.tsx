/**
 * Admin Dashboard Home — revenue today, monthly chart, recent orders, low stock alerts.
 */
"use client";
import React from "react";
import Link from "next/link";
import { TrendingUp, Package, ShoppingBag, AlertTriangle, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/store/StatCard";
import { GoldTopCard, DarkNavyCard, OutlinedCard } from "@/components/ui/card";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/badge";
import { formatKES, formatDate } from "@/lib/utils";

const RECENT_ORDERS = [
  { id: "ORD-001", customer: "John Kamau", total: 199999, status: "Pending" as const, payment: "M-Pesa", payStatus: "Paid" as const, date: "2024-12-10" },
  { id: "ORD-002", customer: "Sarah Wanjiku", total: 34999, status: "Packed" as const, payment: "Card", payStatus: "Paid" as const, date: "2024-12-10" },
  { id: "ORD-003", customer: "David Ochieng", total: 249999, status: "Dispatched" as const, payment: "M-Pesa", payStatus: "Paid" as const, date: "2024-12-09" },
  { id: "ORD-004", customer: "Grace Muthoni", total: 179999, status: "Delivered" as const, payment: "Card", payStatus: "Paid" as const, date: "2024-12-08" },
];

const LOW_STOCK = [
  { name: "Dell XPS 15", category: "Laptops", stock: 2 },
  { name: "MacBook Pro 14 M4", category: "Laptops", stock: 3 },
  { name: "Samsung Galaxy S25 Ultra", category: "Phones", stock: 4 },
];

const MONTHLY = [220, 285, 310, 260, 390, 420, 380, 450, 480, 510, 490, 284];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function AdminDashboard() {
  const maxVal = Math.max(...MONTHLY);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-gold font-medium uppercase tracking-wider mb-1">Overview</p>
        <h1 className="font-display text-3xl text-foreground">Dashboard</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Revenue Today" value="KES 284K" change={12.4} icon={<TrendingUp size={16} />} />
        <StatCard label="Orders Today" value="18" change={5.2} icon={<ShoppingBag size={16} />} />
        <StatCard label="Products Active" value="142" icon={<Package size={16} />} />
        <StatCard label="Low Stock Alerts" value="3" icon={<AlertTriangle size={16} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <DarkNavyCard className="lg:col-span-2">
          <p className="font-display text-sm font-semibold text-foreground mb-1">Monthly Revenue (KES K)</p>
          <p className="text-xs text-obsidian-steel mb-4">Last 12 months</p>
          <div className="flex items-end gap-1.5 h-36">
            {MONTHLY.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full rounded-t transition-all duration-300 group-hover:opacity-100 opacity-80"
                  style={{ height: `${(v / maxVal) * 100}%`, background: i === 11 ? "#C8A550" : "#1A3A6A", minHeight: "4px" }} />
                <span className="text-xs text-obsidian-steel" style={{ fontSize: "9px" }}>{MONTHS[i]}</span>
              </div>
            ))}
          </div>
        </DarkNavyCard>

        {/* Low stock */}
        <GoldTopCard>
          <p className="font-display text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
            <AlertTriangle size={14} className="text-status-pending" /> Low Stock
          </p>
          <p className="text-xs text-obsidian-steel mb-4">Needs restocking</p>
          <div className="space-y-3">
            {LOW_STOCK.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-obsidian-steel">{item.category}</p>
                </div>
                <span className="badge-pending">{item.stock} left</span>
              </div>
            ))}
          </div>
          <Link href="/admin/inventory" className="text-xs text-gold hover:text-gold-light flex items-center gap-1 mt-4 transition-colors">
            Manage inventory <ArrowRight size={11} />
          </Link>
        </GoldTopCard>
      </div>

      {/* Recent Orders */}
      <GoldTopCard>
        <div className="flex items-center justify-between mb-4">
          <p className="font-display text-sm font-semibold text-foreground">Recent Orders</p>
          <Link href="/admin/orders" className="text-xs text-gold hover:text-gold-light flex items-center gap-1 transition-colors">
            View all <ArrowRight size={11} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                {["Order ID", "Customer", "Total", "Status", "Payment", "Date"].map((h) => (
                  <th key={h} className="pb-3 pr-4 text-xs text-obsidian-steel font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-light">
              {RECENT_ORDERS.map((o) => (
                <tr key={o.id} className="hover:bg-obsidian-light/30 transition-colors">
                  <td className="py-3 pr-4 text-gold font-medium text-xs">{o.id}</td>
                  <td className="py-3 pr-4 text-foreground">{o.customer}</td>
                  <td className="py-3 pr-4 text-gold font-semibold">{formatKES(o.total)}</td>
                  <td className="py-3 pr-4"><OrderStatusBadge status={o.status} /></td>
                  <td className="py-3 pr-4"><PaymentStatusBadge status={o.payStatus} /></td>
                  <td className="py-3 text-obsidian-steel text-xs">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GoldTopCard>
    </div>
  );
}
