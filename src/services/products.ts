/**
 * Product service — client-side API calls for product data.
 * All functions wrap the /api/products endpoints.
 */
import type { Product, ProductFilters, PaginatedResponse } from "@/lib/types";

const BASE = "/api";

export async function getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== "") params.set(k, String(v)); });
  const res = await fetch(`${BASE}/products?${params}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getProduct(slug: string): Promise<Product> {
  const res = await fetch(`${BASE}/products/${slug}`);
  if (!res.ok) throw new Error("Product not found");
  const { data } = await res.json();
  return data;
}

export async function searchProducts(q: string): Promise<Product[]> {
  if (!q.trim()) return [];
  const res = await fetch(`${BASE}/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) return [];
  const { data } = await res.json();
  return data;
}
