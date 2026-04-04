"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GoldTopCard } from "@/components/ui/card";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/badge";
import { formatKES, formatDate } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const ORDERS = [
  { id: "ORD-001", customer: "John Kamau", phone: "0712345678", total: 199999, status: "Pending" as OrderStatus, payStatus: "Paid" as const, method: "M-Pesa", date: "2024-12-10T10:30:00Z" },
  { id: "ORD-002", customer: "Sarah Wanjiku", phone: "0723456789", total: 34999, status: "Packed" as OrderStatus, payStatus: "Paid" as const, method: "Card", date: "2024-12-10T14:00:00Z" },
  { id: "ORD-003", customer: "David Ochieng", phone: "0701234567", total: 249999, status: "Dispatched" as OrderStatus, payStatus: "Paid" as const, method: "M-Pesa", date: "2024-12-09T09:15:00Z" },
  { id: "ORD-004", customer: "Grace Muthoni", phone: "0734567890", total: 179999, status: "Delivered" as OrderStatus, payStatus: "Paid" as const, method: "M-Pesa", date: "2024-12-08T16:45:00Z" },
  { id: "ORD-005", customer: "Peter Njoroge", phone: "0745678901", total: 34999, status: "Cancelled" as OrderStatus, payStatus: "Failed" as const, method: "Card", date: "2024-12-07T11:00:00Z" },
];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const filtered = ORDERS.filter((o) => (!search || o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search)) && (statusFilter === "all" || o.status === statusFilter));

  return (
    <div className="space-y-5">
      <div><p className="text-xs text-gold font-medium uppercase tracking-wider mb-1">Fulfillment</p><h1 className="font-display text-3xl text-foreground">Orders</h1></div>
      <GoldTopCard className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-steel" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by customer or order ID..." className="pl-8 h-9" /></div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-sm bg-obsidian-card border border-obsidian-steel rounded-md px-3 h-9 text-foreground focus:outline-none focus:border-gold/60">
          <option value="all">All Status</option>
          {["Pending","Packed","Dispatched","Delivered","Cancelled"].map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </GoldTopCard>
      <GoldTopCard className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-obsidian-light">{["Order","Customer","Total","Status","Payment","Date",""].map((h,i)=><th key={i} className="text-left px-5 py-3 text-xs text-obsidian-steel font-medium uppercase tracking-wider">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-obsidian-light">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-obsidian-light/20 transition-colors">
                <td className="px-5 py-3 text-gold font-medium text-xs">{o.id}</td>
                <td className="px-5 py-3"><p className="text-foreground font-medium">{o.customer}</p><p className="text-xs text-obsidian-steel">{o.phone}</p></td>
                <td className="px-5 py-3 text-gold font-semibold">{formatKES(o.total)}</td>
                <td className="px-5 py-3"><OrderStatusBadge status={o.status} /></td>
                <td className="px-5 py-3"><PaymentStatusBadge status={o.payStatus} /></td>
                <td className="px-5 py-3 text-obsidian-steel text-xs">{formatDate(o.date)}</td>
                <td className="px-5 py-3"><Link href={`/admin/orders/${o.id}`}><button className="p-1.5 text-obsidian-steel hover:text-gold"><ArrowRight size={14} /></button></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </GoldTopCard>
    </div>
  );
}
