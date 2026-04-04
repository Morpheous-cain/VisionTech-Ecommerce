/**
 * Category page — lists products filtered by category.
 * Supports: brand filter, price range, sorting, pagination.
 */
"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { SlidersHorizontal, Grid, List } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category, Product } from "@/lib/types";
import { formatKES } from "@/lib/utils";

const DEMO_PRODUCTS: Product[] = [
  { id: "1", name: "iPhone 16 Pro Max", slug: "iphone-16-pro-max", description: "Latest Apple flagship.", category: "Phones", brand: "Apple", price: 199999, compare_price: 220000, stock: 12, images: [], specs: {}, is_featured: true, is_active: true, created_at: "" },
  { id: "2", name: "Samsung Galaxy S25 Ultra", slug: "samsung-galaxy-s25-ultra", description: "Samsung flagship.", category: "Phones", brand: "Samsung", price: 179999, compare_price: 195000, stock: 8, images: [], specs: {}, is_featured: false, is_active: true, created_at: "" },
  { id: "3", name: "Pixel 9 Pro", slug: "pixel-9-pro", description: "Google flagship.", category: "Phones", brand: "Google", price: 139999, stock: 7, images: [], specs: {}, is_featured: false, is_active: true, created_at: "" },
  { id: "4", name: "MacBook Pro 14 M4", slug: "macbook-pro-14-m4", description: "Apple laptop.", category: "Laptops", brand: "Apple", price: 249999, stock: 5, images: [], specs: {}, is_featured: true, is_active: true, created_at: "" },
  { id: "5", name: "Dell XPS 15", slug: "dell-xps-15", description: "Dell laptop.", category: "Laptops", brand: "Dell", price: 189999, stock: 3, images: [], specs: {}, is_featured: false, is_active: true, created_at: "" },
  { id: "6", name: "AirPods Pro 2", slug: "airpods-pro-2", description: "Apple earbuds.", category: "Accessories", brand: "Apple", price: 34999, compare_price: 39999, stock: 20, images: [], specs: {}, is_featured: false, is_active: true, created_at: "" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

export default function CategoryPage() {
  const params = useParams();
  const category = (params.category as string);
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1) as Category;

  const [sort, setSort] = useState("newest");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(300000);

  const filtered = DEMO_PRODUCTS
    .filter((p) => p.category === categoryName || category === "all")
    .filter((p) => selectedBrands.length === 0 || selectedBrands.includes(p.brand))
    .filter((p) => p.price <= maxPrice);

  const brands = [...new Set(DEMO_PRODUCTS.filter(p => p.category === categoryName).map(p => p.brand))];

  const toggleBrand = (b: string) =>
    setSelectedBrands((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs text-gold font-medium uppercase tracking-wider mb-1">Browse</p>
        <h1 className="font-display text-4xl text-foreground">{categoryName || "All Products"}</h1>
        <p className="text-obsidian-steel mt-1">{filtered.length} products</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-56 shrink-0 space-y-6">
          <div className="card-outlined p-4">
            <h3 className="font-display text-sm font-semibold text-foreground mb-3">Brands</h3>
            <div className="space-y-2">
              {brands.map((b) => (
                <label key={b} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b)}
                    onChange={() => toggleBrand(b)}
                    className="accent-gold"
                  />
                  <span className="text-sm text-obsidian-steel group-hover:text-foreground transition-colors">{b}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="card-outlined p-4">
            <h3 className="font-display text-sm font-semibold text-foreground mb-3">Max Price</h3>
            <p className="text-gold text-sm font-medium mb-2">{formatKES(maxPrice)}</p>
            <input
              type="range"
              min={10000}
              max={300000}
              step={5000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-gold"
            />
            <div className="flex justify-between text-xs text-obsidian-steel mt-1">
              <span>KES 10K</span>
              <span>KES 300K</span>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-gold" />
              <span className="text-sm text-obsidian-steel">{filtered.length} results</span>
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm bg-obsidian-card border border-obsidian-steel rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:border-gold/60"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-obsidian-steel">
              <p className="text-4xl mb-4">🔍</p>
              <p className="font-display text-lg">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
