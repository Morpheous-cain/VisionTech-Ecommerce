/**
 * Storefront footer with brand info, links, and contact.
 */
import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ background: "#04122B", borderTop: "1px solid rgba(200,165,80,0.12)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded bg-gold flex items-center justify-center">
                <span className="text-obsidian-deep font-display font-bold text-sm">V</span>
              </div>
              <span className="font-display font-semibold text-lg text-gold-light">VisionTech</span>
            </div>
            <p className="text-sm text-obsidian-steel leading-relaxed mb-4">
              Nairobi&apos;s premier electronics destination. Shop the latest phones, laptops, and accessories with confidence.
            </p>
            <div className="space-y-2 text-sm text-obsidian-steel">
              <div className="flex items-center gap-2"><MapPin size={14} className="text-gold" /> Nairobi, Kenya</div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-gold" /> +254 700 000 000</div>
              <div className="flex items-center gap-2"><Mail size={14} className="text-gold" /> hello@visiontech.co.ke</div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-gold-light text-sm font-semibold mb-3 uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2 text-sm text-obsidian-steel">
              {["Phones", "Laptops", "Accessories", "New Arrivals", "Deals"].map((l) => (
                <li key={l}><Link href={`/${l.toLowerCase().replace(" ", "-")}`} className="hover:text-gold-light transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-display text-gold-light text-sm font-semibold mb-3 uppercase tracking-wider">Account</h4>
            <ul className="space-y-2 text-sm text-obsidian-steel">
              {[["My Account", "/account"], ["Orders", "/orders"], ["Wishlist", "/wishlist"], ["Track Order", "/orders"]].map(([l, href]) => (
                <li key={l}><Link href={href} className="hover:text-gold-light transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-obsidian-light flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-obsidian-steel">
            © {new Date().getFullYear()} VisionTech. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/200px-M-PESA_LOGO-01.svg.png" alt="M-Pesa" className="h-5 opacity-60 hover:opacity-100 transition-opacity" />
            <div className="flex gap-1">
              {["VISA", "MC"].map((c) => (
                <span key={c} className="text-xs border border-obsidian-steel px-2 py-0.5 rounded text-obsidian-steel">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
