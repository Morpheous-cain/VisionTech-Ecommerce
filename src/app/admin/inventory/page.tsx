"use client";
import React, { useState } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { GoldTopCard, DarkNavyCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatKES } from "@/lib/utils";

const STOCK_DATA = [
  { id: "1", name: "iPhone 16 Pro Max", brand: "Apple", category: "Phones", price: 199999, stock: 12, threshold: 5 },
  { id: "2", name: "Samsung Galaxy S25 Ultra", brand: "Samsung", category: "Phones", price: 179999, stock: 8, threshold: 5 },
  { id: "3", name: "MacBook Pro 14 M4", brand: "Apple", category: "Laptops", price: 249999, stock: 5, threshold: 3 },
  { id: "4", name: "Dell XPS 15", brand: "Dell", category: "Laptops", price: 189999, stock: 2, threshold: 3 },
  { id: "5", name: "AirPods Pro 2nd Gen", brand: "Apple", category: "Accessories", price: 34999, stock: 20, threshold: 5 },
  { id: "6", name: "Pixel 9 Pro", brand: "Google", category: "Phones", price: 139999, stock: 3, threshold: 5 },
];

export default function AdminInventoryPage() {
  const [items, setItems] = useState(STOCK_DATA);
  const restock = (id: string, qty: number) => setItems((p) => p.map((x) => x.id === id ? { ...x, stock: x.stock + qty } : x));
  const lowStock = items.filter((i) => i.stock <= i.threshold);

  return (
    <div className="space-y-5">
      <div><p className="text-xs text-gold font-medium uppercase tracking-wider mb-1">Stock</p><h1 className="font-display text-3xl text-foreground">Inventory</h1></div>

      {lowStock.length > 0 && (
        <DarkNavyCard className="border border-status-pending/30">
          <p className="text-sm font-semibold text-status-pending flex items-center gap-2 mb-3"><AlertTriangle size={15} /> {lowStock.length} product{lowStock.length > 1 ? "s" : ""} need restocking</p>
          <div className="flex flex-wrap gap-2">{lowStock.map(i => <Badge key={i.id} variant="pending">{i.name} — {i.stock} left</Badge>)}</div>
        </DarkNavyCard>
      )}

      <GoldTopCard className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-obsidian-light">{["Product","Category","Price","Current Stock","Status","Restock"].map(h=><th key={h} className="text-left px-5 py-3 text-xs text-obsidian-steel font-medium uppercase tracking-wider">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-obsidian-light">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-obsidian-light/20 transition-colors">
                <td className="px-5 py-3"><p className="font-medium text-foreground">{item.name}</p><p className="text-xs text-obsidian-steel">{item.brand}</p></td>
                <td className="px-5 py-3 text-obsidian-steel">{item.category}</td>
                <td className="px-5 py-3 text-gold font-semibold">{formatKES(item.price)}</td>
                <td className="px-5 py-3 text-foreground font-medium">{item.stock} units</td>
                <td className="px-5 py-3"><Badge variant={item.stock === 0 ? "out-stock" : item.stock <= item.threshold ? "low-stock" : "in-stock"}>{item.stock === 0 ? "Out of Stock" : item.stock <= item.threshold ? "Low Stock" : "In Stock"}</Badge></td>
                <td className="px-5 py-3">
                  <button onClick={() => restock(item.id, 10)} className="flex items-center gap-1.5 text-xs text-gold hover:text-gold-light border border-gold/30 hover:border-gold/60 px-3 py-1.5 rounded-md transition-all">
                    <RefreshCw size={12} /> +10 units
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GoldTopCard>
    </div>
  );
}
