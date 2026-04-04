"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Upload, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GoldTopCard } from "@/components/ui/card";
import type { Category } from "@/lib/types";

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", brand: "", category: "Phones" as Category, price: "", compare_price: "", stock: "", description: "" });
  const [specs, setSpecs] = useState<{key:string;val:string}[]>([{key:"",val:""}]);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const f = (k: keyof typeof form) => ({ value: form[k], onChange: (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => setForm((p) => ({...p,[k]:e.target.value})) });
  const validate = () => { const e: Record<string,string> = {}; if (!form.name.trim()) e.name="Required"; if (!form.brand.trim()) e.brand="Required"; if (!form.price||isNaN(Number(form.price))) e.price="Enter a valid price"; if (!form.stock||isNaN(Number(form.stock))) e.stock="Enter a valid stock"; setErrors(e); return Object.keys(e).length===0; };
  const save = () => { if (!validate()) return; alert("Product saved! (Connect Supabase to persist)"); router.push("/admin/products"); };

  return (
    <div className="max-w-3xl space-y-5">
      <div><p className="text-xs text-gold font-medium uppercase tracking-wider mb-1">New Product</p><h1 className="font-display text-3xl text-foreground">Add Product</h1></div>
      <GoldTopCard>
        <h2 className="font-display text-base font-semibold text-foreground mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><label className="text-xs text-obsidian-steel block mb-1">Product Name *</label><Input {...f("name")} placeholder="e.g. iPhone 16 Pro Max" />{errors.name && <p className="text-status-cancelled text-xs mt-1">{errors.name}</p>}</div>
          <div><label className="text-xs text-obsidian-steel block mb-1">Brand *</label><Input {...f("brand")} placeholder="Apple" /></div>
          <div><label className="text-xs text-obsidian-steel block mb-1">Category</label><select {...f("category")} className="w-full h-10 bg-obsidian-card border border-obsidian-steel rounded-md px-3 text-sm text-foreground focus:outline-none focus:border-gold/60">{["Phones","Laptops","Accessories"].map(c=><option key={c} value={c}>{c}</option>)}</select></div>
          <div><label className="text-xs text-obsidian-steel block mb-1">Price (KES) *</label><Input {...f("price")} type="number" placeholder="199999" />{errors.price && <p className="text-status-cancelled text-xs mt-1">{errors.price}</p>}</div>
          <div><label className="text-xs text-obsidian-steel block mb-1">Compare Price</label><Input {...f("compare_price")} type="number" placeholder="220000" /></div>
          <div><label className="text-xs text-obsidian-steel block mb-1">Stock *</label><Input {...f("stock")} type="number" placeholder="10" /></div>
          <div className="sm:col-span-2"><label className="text-xs text-obsidian-steel block mb-1">Description</label><textarea {...f("description")} rows={4} className="w-full bg-obsidian-card border border-obsidian-steel rounded-md px-3 py-2 text-sm text-foreground placeholder:text-obsidian-steel focus:outline-none focus:border-gold/60 resize-none" /></div>
        </div>
      </GoldTopCard>
      <GoldTopCard>
        <h2 className="font-display text-base font-semibold text-foreground mb-4">Specifications</h2>
        <div className="space-y-2">
          {specs.map((s,i) => (
            <div key={i} className="flex gap-2">
              <Input value={s.key} onChange={(e) => setSpecs(p=>p.map((x,j)=>j===i?{...x,key:e.target.value}:x))} placeholder="e.g. RAM" className="flex-1" />
              <Input value={s.val} onChange={(e) => setSpecs(p=>p.map((x,j)=>j===i?{...x,val:e.target.value}:x))} placeholder="e.g. 8GB" className="flex-1" />
              <button onClick={() => setSpecs(p=>p.filter((_,j)=>j!==i))} className="p-2 text-obsidian-steel hover:text-status-cancelled"><X size={14} /></button>
            </div>
          ))}
          <button onClick={() => setSpecs(p=>[...p,{key:"",val:""}])} className="text-xs text-gold hover:text-gold-light flex items-center gap-1"><Plus size={12} /> Add spec</button>
        </div>
      </GoldTopCard>
      <GoldTopCard>
        <h2 className="font-display text-base font-semibold text-foreground mb-4">Product Images</h2>
        <div className="border-2 border-dashed border-obsidian-steel rounded-lg p-8 text-center hover:border-gold/40 transition-colors cursor-pointer">
          <Upload size={24} className="text-obsidian-steel mx-auto mb-2" />
          <p className="text-sm text-obsidian-steel">Drag & drop or click to upload via Cloudinary</p>
        </div>
      </GoldTopCard>
      <div className="flex gap-3">
        <button onClick={save} className="btn-gold px-8 py-3"><Save size={16} /> Save Product</button>
        <button onClick={() => router.back()} className="btn-secondary px-6 py-3">Cancel</button>
      </div>
    </div>
  );
}
