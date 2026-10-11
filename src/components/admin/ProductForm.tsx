"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/client-api";
import { discountedPrice, formatPrice } from "@/lib/utils";
import { Field, MultiImageInput, PageHeader, Panel, Toggle } from "./ui";

export type ProductFormValues = {
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  category: string;
  images: string[];
  price: number | "";
  discountPercent: number | "";
  costPrice: number | "";
  variants: { size: string; stock: number | "" }[];
  colors: string[];
  fabric: string;
  care: string;
  tags: string[];
  isNewArrival: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  active: boolean;
  seoTitle: string;
  seoDescription: string;
};

export const EMPTY_PRODUCT: ProductFormValues = {
  name: "",
  slug: "",
  sku: "",
  shortDescription: "",
  description: "",
  category: "",
  images: [],
  price: "",
  discountPercent: 0,
  costPrice: "",
  variants: [
    { size: "S", stock: 0 },
    { size: "M", stock: 0 },
    { size: "L", stock: 0 },
    { size: "XL", stock: 0 },
  ],
  colors: [],
  fabric: "",
  care: "",
  tags: [],
  isNewArrival: true,
  isBestSeller: false,
  isFeatured: false,
  active: true,
  seoTitle: "",
  seoDescription: "",
};

const SIZE_PRESETS = {
  "S–XL": ["S", "M", "L", "XL"],
  "XS–XXL": ["XS", "S", "M", "L", "XL", "XXL"],
  "Free Size": ["Free Size"],
  "Numeric 36–44": ["36", "38", "40", "42", "44"],
};

function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [text, setText] = useState("");
  const add = () => {
    const parts = text.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) onChange([...new Set([...value, ...parts])]);
    setText("");
  };
  return (
    <div className="input flex min-h-12 flex-wrap items-center gap-1.5 py-2">
      {value.map((t) => (
        <span key={t} className="flex items-center gap-1 rounded-full bg-blush-100 px-2.5 py-1 text-xs">
          {t}
          <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} className="text-muted hover:text-red-600" aria-label={`Remove ${t}`}>×</button>
        </span>
      ))}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          } else if (e.key === "Backspace" && !text && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={add}
        placeholder={value.length ? "" : placeholder}
        className="min-w-24 flex-1 bg-transparent outline-none"
      />
    </div>
  );
}

export function ProductForm({
  initial,
  productId,
  categories,
}: {
  initial: ProductFormValues;
  productId?: string;
  categories: { _id: string; name: string }[];
}) {
  const router = useRouter();
  const [v, setV] = useState<ProductFormValues>(initial);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof ProductFormValues>(k: K, val: ProductFormValues[K]) => setV((s) => ({ ...s, [k]: val }));

  const price = Number(v.price) || 0;
  const cost = Number(v.costPrice) || 0;
  const final = discountedPrice(price, Number(v.discountPercent) || 0);
  const margin = final > 0 ? ((final - cost) / final) * 100 : 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!v.name.trim()) return toast.error("Product name is required");
    if (!price) return toast.error("Price is required");
    setSaving(true);
    try {
      const body = {
        ...v,
        price,
        costPrice: cost,
        discountPercent: Number(v.discountPercent) || 0,
        variants: v.variants.filter((x) => x.size.trim()).map((x) => ({ size: x.size.trim(), stock: Number(x.stock) || 0 })),
      };
      if (productId) await api(`/api/admin/products/${productId}`, { method: "PUT", body });
      else await api("/api/admin/products", { method: "POST", body });
      toast.success(productId ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <PageHeader
        title={productId ? "Edit Product" : "New Product"}
        actions={
          <>
            <Link href="/admin/products" className="btn-soft"><ArrowLeft className="h-4 w-4" /> Back</Link>
            <button disabled={saving} className="btn-primary">{saving && <Loader2 className="h-4 w-4 animate-spin" />} Save Product</button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Panel title="Basic Information">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Product Name *" className="sm:col-span-2">
                <input value={v.name} onChange={(e) => set("name", e.target.value)} className="input" placeholder="e.g. Dusty Rose Chikankari Kurti" required />
              </Field>
              <Field label="Short Description" className="sm:col-span-2" hint="Shown near the price on the product page.">
                <input value={v.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} className="input" maxLength={300} />
              </Field>
              <Field label="Full Description" className="sm:col-span-2">
                <textarea value={v.description} onChange={(e) => set("description", e.target.value)} rows={6} className="input" />
              </Field>
              <Field label="Category">
                <select value={v.category} onChange={(e) => set("category", e.target.value)} className="input">
                  <option value="">— Select category —</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="SKU / Code">
                <input value={v.sku} onChange={(e) => set("sku", e.target.value)} className="input" placeholder="NV-KUR-001" />
              </Field>
            </div>
          </Panel>

          <Panel title="Images">
            <MultiImageInput value={v.images} onChange={(imgs) => set("images", imgs)} />
            <p className="mt-2 text-xs text-muted">First image is the cover; the second appears on hover. Portrait 3:4 images look best.</p>
          </Panel>

          <Panel title="Sizes & Stock" actions={
            <select
              onChange={(e) => {
                const preset = SIZE_PRESETS[e.target.value as keyof typeof SIZE_PRESETS];
                if (preset) set("variants", preset.map((size) => ({ size, stock: v.variants.find((x) => x.size === size)?.stock ?? 0 })));
                e.target.value = "";
              }}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-xs"
              defaultValue=""
            >
              <option value="" disabled>Size preset…</option>
              {Object.keys(SIZE_PRESETS).map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          }>
            <div className="space-y-2">
              {v.variants.map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={row.size} onChange={(e) => set("variants", v.variants.map((x, k) => (k === i ? { ...x, size: e.target.value } : x)))} placeholder="Size" className="input w-36" />
                  <input type="number" min={0} value={row.stock} onChange={(e) => set("variants", v.variants.map((x, k) => (k === i ? { ...x, stock: e.target.value === "" ? "" : Number(e.target.value) } : x)))} placeholder="Stock" className="input w-32" />
                  <span className="text-xs text-muted">in stock</span>
                  <button type="button" onClick={() => set("variants", v.variants.filter((_, k) => k !== i))} className="ml-auto rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600" aria-label="Remove size"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => set("variants", [...v.variants, { size: "", stock: 0 }])} className="btn-soft mt-2 px-4 py-2"><Plus className="h-3.5 w-3.5" /> Add Size</button>
              <p className="pt-1 text-xs text-muted">Leave empty (remove all sizes) for products without sizes — stock won&apos;t be tracked.</p>
            </div>
          </Panel>

          <Panel title="Details">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Colors" hint="Press Enter after each color." className="sm:col-span-2">
                <TagInput value={v.colors} onChange={(c) => set("colors", c)} placeholder="e.g. Dusty Rose, Ivory" />
              </Field>
              <Field label="Fabric">
                <input value={v.fabric} onChange={(e) => set("fabric", e.target.value)} className="input" placeholder="e.g. Pure Cotton Lawn" />
              </Field>
              <Field label="Search Tags" hint="Helps customers find it.">
                <TagInput value={v.tags} onChange={(t) => set("tags", t)} placeholder="eid, festive, summer" />
              </Field>
              <Field label="Care Instructions" className="sm:col-span-2">
                <textarea value={v.care} onChange={(e) => set("care", e.target.value)} rows={3} className="input" />
              </Field>
            </div>
          </Panel>

          <Panel title="SEO (optional)">
            <div className="grid gap-5">
              <Field label="URL Slug" hint="Auto-generated from name if empty.">
                <input value={v.slug} onChange={(e) => set("slug", e.target.value)} className="input" placeholder="dusty-rose-chikankari-kurti" />
              </Field>
              <Field label="SEO Title"><input value={v.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} className="input" /></Field>
              <Field label="SEO Description"><textarea value={v.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} rows={2} className="input" /></Field>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Pricing">
            <div className="space-y-5">
              <Field label="Regular Price *">
                <input type="number" min={0} value={v.price} onChange={(e) => set("price", e.target.value === "" ? "" : Number(e.target.value))} className="input" required />
              </Field>
              <Field label="Discount %" hint="0 = no discount">
                <input type="number" min={0} max={95} value={v.discountPercent} onChange={(e) => set("discountPercent", e.target.value === "" ? "" : Number(e.target.value))} className="input" />
              </Field>
              <Field label="Cost Price (private)" hint="Your buying/making cost per piece. Used for profit & ROI — never shown to customers.">
                <input type="number" min={0} value={v.costPrice} onChange={(e) => set("costPrice", e.target.value === "" ? "" : Number(e.target.value))} className="input" />
              </Field>
              <div className="rounded-xl bg-blush-50 p-4 text-sm">
                <div className="flex justify-between"><span className="text-muted">Customer pays</span><span className="font-semibold">{formatPrice(final)}</span></div>
                <div className="mt-1 flex justify-between"><span className="text-muted">Profit / piece</span><span className={final - cost >= 0 ? "text-emerald-700" : "text-red-600"}>{formatPrice(final - cost)}</span></div>
                <div className="mt-1 flex justify-between"><span className="text-muted">Margin</span><span>{margin.toFixed(1)}%</span></div>
              </div>
            </div>
          </Panel>

          <Panel title="Visibility & Highlights">
            <div className="space-y-5">
              <Toggle checked={v.active} onChange={(x) => set("active", x)} label="Visible in store" description="Hidden products can't be purchased." />
              <Toggle checked={v.isNewArrival} onChange={(x) => set("isNewArrival", x)} label="New Arrival" description="Shows in the New Arrivals section." />
              <Toggle checked={v.isBestSeller} onChange={(x) => set("isBestSeller", x)} label="Best Seller / Hot" description="Shows in the Best Sellers section." />
              <Toggle checked={v.isFeatured} onChange={(x) => set("isFeatured", x)} label="Featured" description="Mark as a featured pick." />
            </div>
          </Panel>
        </div>
      </div>
    </form>
  );
}
