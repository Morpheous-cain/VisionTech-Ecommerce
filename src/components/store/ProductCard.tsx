/**
 * ProductCard — GoldTop variant card used across storefront.
 * Shows image, brand, name, price, stock status, and CTA.
 */
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatKES, cloudinaryThumb } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onWishlist }: ProductCardProps) {
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const stockStatus = product.stock === 0 ? "out-stock"
    : product.stock < 5 ? "low-stock" : "in-stock";
  const stockLabel = product.stock === 0 ? "Out of Stock"
    : product.stock < 5 ? `Only ${product.stock} left` : "In Stock";

  return (
    <div className="card-gold-top group cursor-pointer transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/8 hover:-translate-y-1">
      {/* Image */}
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square bg-obsidian-card rounded-md overflow-hidden mb-4 -mx-5 -mt-5 bg-gradient-to-br from-obsidian-light to-obsidian-card">
          {product.images[0] ? (
            <Image
              src={cloudinaryThumb(product.images[0], 400)}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-obsidian-steel">
              <span className="text-4xl opacity-30">📱</span>
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-gold text-obsidian-deep text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </div>
          )}
          {product.is_featured && (
            <div className="absolute top-2 right-2">
              <Badge variant="new">Featured</Badge>
            </div>
          )}
          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); onWishlist?.(product); }}
            className="absolute bottom-2 right-2 p-1.5 rounded-full bg-obsidian/70 text-obsidian-steel hover:text-gold opacity-0 group-hover:opacity-100 transition-all"
          >
            <Heart size={14} />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="space-y-1">
        <p className="text-xs text-gold/70 font-medium uppercase tracking-wider">{product.brand}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-display text-sm font-medium text-foreground leading-snug hover:text-gold-light transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-gold font-semibold text-base">{formatKES(product.price)}</span>
          {product.compare_price && (
            <span className="text-obsidian-steel text-xs line-through">{formatKES(product.compare_price)}</span>
          )}
        </div>
        <Badge variant={stockStatus as "in-stock" | "low-stock" | "out-stock"} className="text-xs">
          {stockLabel}
        </Badge>
      </div>

      {/* CTA */}
      <button
        onClick={() => onAddToCart?.(product)}
        disabled={product.stock === 0}
        className="mt-3 w-full btn-gold py-2 text-sm justify-center disabled:opacity-40"
      >
        <ShoppingCart size={14} />
        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}
