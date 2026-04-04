"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GoldTopCard } from "@/components/ui/card";
import { formatKES } from "@/lib/utils";
import type { Product } from "@/lib/types";

const DEMO: Product[] = [
  { id: "1", name: "iPhone 16 Pro Max", slug: "iphone-16-pro-max", description: "", category: "Phones", brand: "Apple", price: 199999, stock: 12, images: [], specs: {}, is_featured: true, is_active: true, created_at: "" },
  { id: "2", name: "Samsung Galaxy S25 Ultra", slug: "samsung-galaxy-s25-ultra", description: "", category: "Phones", brand: "Samsung", price: 179999, stock: 8, images: [], specs: {}, is_featured: false, is_active: true, created_at: "" },
  { id: "3", name: "MacBook Pro 14 M4", slug: "macbook-pro-14-m4", description: "", category: "Laptops", brand: "Apple", price: 249999, stock: 5, images: [], specs: {}, is_featured: true, is_active: true, created_at: "" },
  { id: "4", name: "Dell XPS 15", slug: "dell-xps-15", description: "", category: "Laptops", brand: "Dell", price: 189999, stock: 2, images: [], specs: {}, is_featured: false, is_active: false, created_at: "" },
  { id: "5", name: "AirPods Pro 2nd Gen", slug: "airpods-pro-2", description: "", category: "Accessories", brand: "Apple", price: 34999, stock: 20, images: [], specs: {}, is_featured: false, is_active: true, created_at: "" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(DEMO);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const toggle = (id: string) => setProducts((p) => p.map((x) => x.id === id ? { ...x, is_active: !x.is_active } : x));
  const filtered = products.filter((p) => (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())) && (catFilter === "all" || p.category === catFilter));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><p className="text-xs text-gold font-medium uppercase tracking-wider mb-1">Catalogue</p><h1 className="font-display text-3xl text-foreground">Products</h1></div>
        <Link href="/admin/products/new"><button className="btn-gold py-2.5 px-4 text-sm"><Plus size={15} /> Add Product</button></Link>
      </div>
      <GoldTopCard className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-steel" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="pl-8 h-9" />
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="text-sm bg-obsidian-card border border-obsidian-steel rounded-md px-3 h-9 text-foreground focus:outline-none focus:border-gold/60">
          <option value="all">All Categories</option>
          {["Phones", "Laptops", "Accessories"].map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </GoldTopCard>
      <GoldTopCard className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-obsidian-light">{["Product","Category","Price","Stock","Status","Actions"].map((h) => <th key={h} className="text-left px-5 py-3 text-xs text-obsidian-steel font-medium uppercase tracking-wider">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-obsidian-light">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-obsidian-light/20 transition-colors">
                <td className="px-5 py-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded bg-obsidian-light flex items-center justify-center shrink-0 opacity-50">📱</div><div><p className="font-medium text-foreground text-sm">{p.name}</p><p className="text-xs text-obsidian-steel">{p.brand}</p></div></div></td>
                <td className="px-5 py-3 text-obsidian-steel">{p.category}</td>
                <td className="px-5 py-3 text-gold font-semibold">{formatKES(p.price)}</td>
                <td className="px-5 py-3"><Badge variant={p.stock === 0 ? "out-stock" : p.stock < 5 ? "low-stock" : "in-stock"}>{p.stock}</Badge></td>
                <td className="px-5 py-3"><Badge variant={p.is_active ? "paid" : "cancelled"}>{p.is_active ? "Active" : "Hidden"}</Badge></td>
                <td className="px-5 py-3"><div className="flex items-center gap-2"><Link href={`/admin/products/${p.id}`}><button className="p-1.5 text-obsidian-steel hover:text-gold"><Edit size={14} /></button></Link><button onClick={() => toggle(p.id)} className="p-1.5 text-obsidian-steel hover:text-foreground">{p.is_active ? <EyeOff size={14} /> : <Eye size={14} />}</button><button className="p-1.5 text-obsidian-steel hover:text-status-cancelled"><Trash2 size={14} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </GoldTopCard>
    </div>
  );
}
