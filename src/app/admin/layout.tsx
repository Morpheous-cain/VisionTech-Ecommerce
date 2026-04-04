/**
 * Admin Dashboard layout — sidebar navigation, protected by middleware.
 */
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Warehouse, BarChart3, LogOut, Menu, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: "#020B19" }}>
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-60 flex flex-col transition-transform duration-200",
        "lg:translate-x-0 lg:static lg:z-auto",
        open ? "translate-x-0" : "-translate-x-full"
      )} style={{ background: "#04122B", borderRight: "1px solid rgba(200,165,80,0.12)" }}>
        {/* Logo */}
        <div className="p-5 border-b border-obsidian-light">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gold flex items-center justify-center">
              <span className="text-obsidian-deep font-display font-bold text-sm">V</span>
            </div>
            <div>
              <p className="font-display font-semibold text-foreground text-sm">VisionTech</p>
              <p className="text-xs text-obsidian-steel">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = path === href || (href !== "/admin" && path.startsWith(href));
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all",
                  active ? "bg-gold/10 text-gold border border-gold/20" : "text-obsidian-steel hover:text-foreground hover:bg-obsidian-light"
                )}>
                <Icon size={16} />
                {label}
                {active && <ChevronRight size={12} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-obsidian-light">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-obsidian-steel hover:text-status-cancelled transition-colors">
            <LogOut size={16} /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 sm:px-6 border-b border-obsidian-light" style={{ background: "rgba(4,18,43,0.97)", backdropFilter: "blur(12px)" }}>
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 text-obsidian-steel hover:text-foreground"><Menu size={20} /></button>
          <p className="font-display text-sm text-foreground hidden sm:block">VisionTech Admin</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-xs font-bold">A</div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
