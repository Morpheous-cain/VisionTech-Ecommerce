/**
 * Main storefront navigation bar.
 * Features: VisionTech logo, category nav, search, cart icon, auth.
 */
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, User, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES = ["Phones", "Laptops", "Accessories"];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(4,18,43,0.97)"
          : "linear-gradient(180deg, rgba(2,11,25,0.9) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(200,165,80,0.12)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-gold flex items-center justify-center">
              <span className="text-obsidian-deep font-display font-bold text-sm">V</span>
            </div>
            <span className="font-display font-semibold text-lg text-foreground group-hover:text-gold-light transition-colors">
              VisionTech
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/${cat.toLowerCase()}`}
                className="text-sm text-obsidian-steel hover:text-gold-light transition-colors duration-150 font-medium"
              >
                {cat}
              </Link>
            ))}
            <Link href="/compare" className="text-sm text-obsidian-steel hover:text-gold-light transition-colors duration-150 font-medium">
              Compare
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-md text-obsidian-steel hover:text-gold-light transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Cart */}
            <Link href="/cart" className="p-2 rounded-md text-obsidian-steel hover:text-gold-light transition-colors relative">
              <ShoppingCart size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-obsidian-deep text-xs font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Auth */}
            <Link href="/auth" className="hidden sm:flex">
              <Button variant="secondary" size="sm">
                <User size={14} /> Sign In
              </Button>
            </Link>

            {/* Mobile menu */}
            <button
              className="md:hidden p-2 text-obsidian-steel hover:text-gold-light"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-3 animate-slide-up">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search phones, laptops, accessories..."
                className="flex-1"
              />
              <Button type="submit" variant="gold" size="md">Search</Button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-obsidian-light pb-4 pt-3 space-y-1 animate-slide-up">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/${cat.toLowerCase()}`}
                className="block px-2 py-2 text-sm text-foreground hover:text-gold-light"
                onClick={() => setMobileOpen(false)}
              >
                {cat}
              </Link>
            ))}
            <Link href="/compare" className="block px-2 py-2 text-sm text-foreground hover:text-gold-light" onClick={() => setMobileOpen(false)}>
              Compare
            </Link>
            <Link href="/auth" className="block px-2 py-2 text-sm text-gold" onClick={() => setMobileOpen(false)}>
              Sign In / Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
