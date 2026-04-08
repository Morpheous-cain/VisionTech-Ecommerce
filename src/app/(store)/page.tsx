/**
 * VisionTech Homepage — mobile-first, fully responsive.
 *
 * Layout:
 *  - Hero: full-viewport 3D canvas (HeroScene) behind overlay copy.
 *    On mobile: copy stacks vertically, centred, above the fold.
 *    On desktop: copy sits left, phone 3D model right.
 *  - Categories, Featured, New Arrivals, Why Us: responsive grids throughout.
 */
import React, { Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Shield, Truck, Headphones, CreditCard } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { GoldTopCard } from "@/components/ui/card";
import type { Product } from "@/lib/types";

// Lazy-load the WebGL scene — keeps initial bundle small, no SSR needed
const HeroScene = dynamic(() => import("./components/store/HeroScene"), {
  loading: () => (
    <div
      className="absolute inset-0"
      style={{ background: "linear-gradient(135deg, #04091a 0%, #04122B 60%, #071A38 100%)" }}
    />
  ),
});

// ── Demo products ─────────────────────────────────────────────────────────────
const DEMO_PRODUCTS: Product[] = [
  { id: "1", name: "iPhone 16 Pro Max",       slug: "iphone-16-pro-max",     description: "Latest Apple flagship with A18 Pro chip, 48MP camera system, and titanium design.", category: "Phones",      brand: "Apple",   price: 199999, compare_price: 220000, stock: 12, images: [], specs: { Storage: "256GB", RAM: "8GB" },         is_featured: true,  is_active: true, created_at: new Date().toISOString() },
  { id: "2", name: "Samsung Galaxy S25 Ultra", slug: "samsung-galaxy-s25-ultra", description: "Samsung's most powerful phone with S Pen, 200MP camera, and AI features.",          category: "Phones",      brand: "Samsung", price: 179999, compare_price: 195000, stock: 8,  images: [], specs: { Storage: "512GB", RAM: "12GB" },        is_featured: true,  is_active: true, created_at: new Date().toISOString() },
  { id: "3", name: "MacBook Pro 14\" M4",      slug: "macbook-pro-14-m4",     description: "M4 chip powerhouse for professionals. Stunning Liquid Retina XDR display.",           category: "Laptops",     brand: "Apple",   price: 249999, compare_price: 275000, stock: 5,  images: [], specs: { Processor: "Apple M4", RAM: "16GB" },     is_featured: true,  is_active: true, created_at: new Date().toISOString() },
  { id: "4", name: "Dell XPS 15",              slug: "dell-xps-15",           description: "Premium Windows laptop with OLED display and Intel Core Ultra.",                      category: "Laptops",     brand: "Dell",    price: 189999,                        stock: 3,  images: [], specs: { Processor: "Intel Core Ultra 7" },         is_featured: false, is_active: true, created_at: new Date().toISOString() },
  { id: "5", name: "AirPods Pro 2nd Gen",      slug: "airpods-pro-2",         description: "Active noise cancellation with adaptive audio and USB-C charging.",                   category: "Accessories", brand: "Apple",   price: 34999,  compare_price: 39999,  stock: 20, images: [], specs: { "Battery Life": "30hrs (case)" },            is_featured: false, is_active: true, created_at: new Date().toISOString() },
  { id: "6", name: "Pixel 9 Pro",              slug: "pixel-9-pro",           description: "Google's best phone with Magic Eraser, 50MP camera, and 7 years of AI updates.",     category: "Phones",      brand: "Google",  price: 139999,                        stock: 7,  images: [], specs: { Storage: "256GB", RAM: "12GB" },         is_featured: false, is_active: true, created_at: new Date().toISOString() },
];

const CATEGORIES = [
  { name: "Phones",      icon: "📱", href: "/phones",      count: "120+ models" },
  { name: "Laptops",     icon: "💻", href: "/laptops",     count: "80+ models"  },
  { name: "Accessories", icon: "🎧", href: "/accessories", count: "200+ items"  },
];

const WHY_US = [
  { icon: <CreditCard size={20} />, title: "M-Pesa & Card",    desc: "Pay instantly with M-Pesa STK Push or Visa/Mastercard" },
  { icon: <Truck       size={20} />, title: "Fast Delivery",   desc: "Same-day delivery across Nairobi CBD and suburbs"       },
  { icon: <Shield      size={20} />, title: "Genuine Products", desc: "100% authentic products with manufacturer warranty"    },
  { icon: <Headphones  size={20} />, title: "Expert Support",  desc: "Dedicated support team available 7 days a week"         },
];

export default function HomePage() {
  const featured   = DEMO_PRODUCTS.filter((p) => p.is_featured);
  const newArrivals = DEMO_PRODUCTS.slice(3);

  return (
    <div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      {/*
       * Height strategy:
       *   mobile  → 100svh (short viewport units — avoids browser chrome overlap)
       *   desktop → 100vh
       * The 3D canvas fills the entire section; text overlays on top.
       * On mobile the copy is centred and padded from the top; the phone
       * 3D model is visible in the lower half of the canvas.
       */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: "100svh", minHeight: "560px" }}
        aria-label="Hero"
      >
        {/* 3D WebGL canvas — fills section */}
        <Suspense fallback={
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #04091a 0%, #04122B 60%, #071A38 100%)" }} />
        }>
          <HeroScene />
        </Suspense>

        {/* Gradient overlay — fades canvas into the copy area on mobile */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              /* mobile: heavy top gradient so text is readable over the scene */
              "linear-gradient(180deg, rgba(4,9,26,0.82) 0%, rgba(4,9,26,0.55) 45%, rgba(4,9,26,0.0) 70%)",
            ].join(", "),
          }}
        />

        {/* Hero copy — overlaid on canvas */}
        <div className="absolute inset-0 flex items-start sm:items-center pointer-events-none">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-0">
            {/*
             * Mobile:  full-width, centred, text stacks vertically
             * Tablet:  max-w-md left-aligned
             * Desktop: max-w-lg left-aligned, phone 3D model right
             */}
            <div className="w-full sm:max-w-md lg:max-w-lg text-center sm:text-left pointer-events-auto">

              {/* Eyebrow pill */}
              <div className="inline-flex items-center gap-2 border border-gold/30 rounded-full px-3 py-1 mb-5 sm:mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <span className="text-xs text-gold font-medium tracking-wide">
                  Now available — iPhone 16 Pro Max
                </span>
              </div>

              {/* Headline — clamp keeps it readable at every size */}
              <h1
                className="font-display font-bold text-foreground leading-tight mb-4 sm:mb-6"
                style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
              >
                Premium Tech,{" "}
                <span
                  className="text-transparent"
                  style={{ WebkitTextStroke: "1px #C8A550" }}
                >
                  Nairobi
                </span>{" "}
                Prices.
              </h1>

              {/* Subline — hidden on xs to reduce clutter */}
              <p className="hidden sm:block text-obsidian-steel text-base lg:text-lg leading-relaxed mb-6 lg:mb-8 max-w-sm lg:max-w-md">
                Shop the latest phones, laptops, and accessories. Pay with
                M-Pesa or card. Same-day delivery across Nairobi.
              </p>

              {/* CTAs */}
              <div className="flex flex-col xs:flex-row sm:flex-row gap-3 justify-center sm:justify-start mb-6 sm:mb-10">
                <Link href="/phones" className="w-full xs:w-auto sm:w-auto">
                  <button className="btn-gold w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-3 justify-center">
                    Shop Now <ArrowRight size={16} />
                  </button>
                </Link>
                <Link href="/compare" className="w-full xs:w-auto sm:w-auto">
                  <button className="btn-secondary w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-3 justify-center">
                    Compare Products
                  </button>
                </Link>
              </div>

              {/* Trust signals — 3-column mini stats */}
              <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-obsidian-steel">
                <span className="flex items-center gap-1">
                  <Shield    size={12} className="text-gold shrink-0" /> 100% Authentic
                </span>
                <span className="flex items-center gap-1">
                  <Truck     size={12} className="text-gold shrink-0" />
                  <span className="hidden xs:inline">Free delivery </span>KES 5K+
                </span>
                <span className="flex items-center gap-1">
                  <CreditCard size={12} className="text-gold shrink-0" /> M-Pesa
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom scroll hint — desktop only */}
        <div className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 opacity-40">
          <span className="text-xs text-gold tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-gold to-transparent" />
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-1 sm:mb-2">
            Shop by Category
          </h2>
          <p className="text-obsidian-steel text-sm sm:text-base">
            Find exactly what you&apos;re looking for
          </p>
        </div>
        {/* 1 col mobile → 3 col sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.name} href={cat.href}>
              <div className="card-dark-navy p-4 sm:p-6 flex items-center gap-3 sm:gap-4 hover:border-gold/50 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group">
                <div className="text-3xl sm:text-4xl">{cat.icon}</div>
                <div className="min-w-0">
                  <h3 className="font-display font-semibold text-foreground group-hover:text-gold-light transition-colors text-sm sm:text-base truncate">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-obsidian-steel mt-0.5">{cat.count}</p>
                </div>
                <ArrowRight size={14} className="ml-auto text-obsidian-steel group-hover:text-gold transition-colors shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      <section className="py-10 sm:py-16" style={{ background: "rgba(7,26,56,0.4)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6 sm:mb-8">
            <div>
              <p className="text-xs text-gold font-medium uppercase tracking-wider mb-1">
                Hand-picked
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-foreground">
                Featured Products
              </h2>
            </div>
            <Link
              href="/phones"
              className="text-xs sm:text-sm text-gold hover:text-gold-light flex items-center gap-1 transition-colors shrink-0 ml-4"
            >
              View all <ArrowRight size={12} className="sm:hidden" /><ArrowRight size={14} className="hidden sm:inline" />
            </Link>
          </div>
          {/* 1 col xs → 2 col sm → 3 col lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── New Arrivals ─────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <p className="text-xs text-gold font-medium uppercase tracking-wider mb-1">Just in</p>
            <h2 className="font-display text-2xl sm:text-3xl text-foreground">New Arrivals</h2>
          </div>
          <Link
            href="/accessories"
            className="text-xs sm:text-sm text-gold hover:text-gold-light flex items-center gap-1 transition-colors shrink-0 ml-4"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── Why VisionTech ───────────────────────────────────────────────── */}
      <section
        className="py-10 sm:py-16"
        style={{
          background: "linear-gradient(135deg, #04122B 0%, #020B19 100%)",
          borderTop: "1px solid rgba(200,165,80,0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-1 sm:mb-2">
              Why Shop at VisionTech?
            </h2>
            <p className="text-obsidian-steel text-sm sm:text-base">
              Nairobi&apos;s most trusted electronics retailer
            </p>
          </div>
          {/* 2 col mobile → 4 col lg */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {WHY_US.map((item) => (
              <GoldTopCard key={item.title} className="text-center p-4 sm:p-5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mx-auto mb-2 sm:mb-3">
                  {item.icon}
                </div>
                <h3 className="font-display font-semibold text-foreground text-xs sm:text-sm mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-obsidian-steel leading-relaxed hidden sm:block">
                  {item.desc}
                </p>
              </GoldTopCard>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
