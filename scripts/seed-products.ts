/**
 * Demo catalogue: 4 products per category, using each category's image.
 * Safe to re-run — products are matched by slug and skipped if they exist.
 *
 *   npm run seed:products
 */
import mongoose from "mongoose";
import { Category } from "../src/models/Category";
import { Product } from "../src/models/Product";

type Seed = {
  name: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: number;
  discountPercent?: number;
  costPrice: number;
  sizes: [string, number][];
  colors: string[];
  fabric: string;
  care: string;
  tags: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  soldCount?: number;
};

const CARE_COTTON = "Hand wash or gentle machine wash in cold water.\nWash dark colours separately.\nDry in shade to protect embroidery and colour.\nIron on medium heat on the reverse side.";
const CARE_DELICATE = "Dry clean recommended for the first wash.\nAfterwards, gentle hand wash in cold water with mild detergent.\nDo not wring or bleach. Dry flat in shade.\nSteam or iron on low heat.";
const CARE_JERSEY = "Gentle machine wash cold inside out.\nDo not tumble dry. Dry flat to keep the shape.\nLow-heat iron if needed.";

const CATALOGUE: Record<string, Seed[]> = {
  kurtis: [
    {
      name: "Dusty Rose Chikankari Kurti",
      sku: "NV-KUR-001",
      shortDescription: "Hand-embroidered chikankari on breathable cotton — effortless elegance for everyday and festive days.",
      description:
        "Our signature kurti in a soft dusty-rose hue, finished with delicate chikankari-inspired embroidery along the yoke, placket and sleeves.\n\nCut in a graceful straight silhouette that falls just below the knee, with a keyhole neckline and three-quarter sleeves. Light enough for Dhaka summers, elegant enough for dawat.\n\nLength: approx. 44 inches\nFit: Regular, straight cut\nNeckline: Round with keyhole placket",
      price: 2450,
      discountPercent: 10,
      costPrice: 1250,
      sizes: [["S", 6], ["M", 10], ["L", 8], ["XL", 4]],
      colors: ["Dusty Rose", "Ivory"],
      fabric: "100% Premium Cotton Lawn",
      care: CARE_COTTON,
      tags: ["chikankari", "everyday", "eid", "embroidered"],
      isNewArrival: true,
      isBestSeller: true,
      isFeatured: true,
      soldCount: 48,
    },
    {
      name: "Ivory Threadwork A-Line Kurti",
      sku: "NV-KUR-002",
      shortDescription: "A flowing A-line kurti with tonal threadwork — soft, airy and beautifully understated.",
      description:
        "A wardrobe essential in creamy ivory with tone-on-tone threadwork that catches the light softly.\n\nThe A-line flare gives easy movement and a flattering shape for every body type. Pair with palazzos, cigarette pants or jeans.\n\nLength: approx. 42 inches\nFit: A-line, relaxed\nSleeves: Three-quarter",
      price: 1950,
      costPrice: 950,
      sizes: [["S", 5], ["M", 9], ["L", 9], ["XL", 5], ["XXL", 3]],
      colors: ["Ivory", "Mint"],
      fabric: "Cotton Cambric",
      care: CARE_COTTON,
      tags: ["a-line", "office", "summer", "minimal"],
      isNewArrival: true,
      soldCount: 21,
    },
    {
      name: "Mauve Mirror-Work Festive Kurti",
      sku: "NV-KUR-003",
      shortDescription: "Festive mauve kurti with mirror and zari accents — made for celebrations.",
      description:
        "Bring a little sparkle to your celebrations. This mauve kurti features hand-placed mirror work and fine zari threads on the neckline and hem.\n\nThe soft viscose-silk blend drapes beautifully and feels luxurious against the skin.\n\nLength: approx. 46 inches\nFit: Straight with side slits\nNeckline: V-neck with embellished border",
      price: 3250,
      discountPercent: 15,
      costPrice: 1750,
      sizes: [["S", 3], ["M", 6], ["L", 5], ["XL", 2]],
      colors: ["Mauve", "Deep Maroon"],
      fabric: "Viscose Silk Blend",
      care: CARE_DELICATE,
      tags: ["festive", "mirror work", "eid", "party"],
      isBestSeller: true,
      soldCount: 37,
    },
    {
      name: "Blush Printed Everyday Kurti",
      sku: "NV-KUR-004",
      shortDescription: "Soft floral print on breezy cotton — your go-to kurti for work, class and weekends.",
      description:
        "Comfort meets charm in this blush kurti with a delicate all-over floral print.\n\nA relaxed straight fit with side pockets (yes, pockets!) makes it the perfect everyday companion.\n\nLength: approx. 40 inches\nFit: Relaxed straight\nDetails: Side seam pockets",
      price: 1450,
      costPrice: 680,
      sizes: [["S", 12], ["M", 15], ["L", 2], ["XL", 0]],
      colors: ["Blush Pink", "Sky Blue"],
      fabric: "Pure Cotton Voile",
      care: CARE_COTTON,
      tags: ["printed", "everyday", "pockets", "casual"],
      soldCount: 15,
    },
  ],

  "three-pieces": [
    {
      name: "Rosewood Embroidered Three Piece",
      sku: "NV-3PC-001",
      shortDescription: "Embroidered kameez, matching salwar and a soft chiffon dupatta — a complete festive look.",
      description:
        "A timeless three-piece set in deep rosewood, featuring rich embroidery across the front panel and sleeves.\n\nSet includes:\n- Embroidered kameez (approx. 44\" length)\n- Straight salwar with elastic waist\n- Printed chiffon dupatta (2.5 yards)\n\nPerfect for Eid, weddings and family gatherings.",
      price: 4850,
      discountPercent: 12,
      costPrice: 2600,
      sizes: [["S", 4], ["M", 7], ["L", 6], ["XL", 3]],
      colors: ["Rosewood", "Bottle Green"],
      fabric: "Kameez: Cotton Lawn · Dupatta: Chiffon",
      care: CARE_DELICATE,
      tags: ["three piece", "eid", "wedding", "embroidered", "dupatta"],
      isNewArrival: true,
      isBestSeller: true,
      isFeatured: true,
      soldCount: 52,
    },
    {
      name: "Pearl Ivory Lawn Three Piece",
      sku: "NV-3PC-002",
      shortDescription: "Airy ivory lawn set with schiffli details and a pastel organza dupatta.",
      description:
        "Light, graceful and endlessly elegant. This ivory lawn three-piece is finished with schiffli embroidery and scalloped hems.\n\nSet includes:\n- Schiffli-embroidered kameez\n- Cotton trouser with lace trim\n- Pastel organza dupatta\n\nIdeal for daytime events and summer celebrations.",
      price: 4250,
      costPrice: 2250,
      sizes: [["S", 5], ["M", 8], ["L", 7], ["XL", 4], ["XXL", 2]],
      colors: ["Pearl Ivory"],
      fabric: "Kameez: Premium Lawn · Dupatta: Organza",
      care: CARE_DELICATE,
      tags: ["three piece", "summer", "lawn", "organza"],
      isNewArrival: true,
      soldCount: 18,
    },
    {
      name: "Mulberry Silk Festive Three Piece",
      sku: "NV-3PC-003",
      shortDescription: "Luxurious mulberry silk-blend set with zari work — made to be remembered.",
      description:
        "Our most luxurious three-piece, in a rich mulberry tone with intricate zari and sequin work on the neckline and border.\n\nSet includes:\n- Zari-embroidered kameez (approx. 46\")\n- Silk-blend churidar\n- Banarasi-inspired dupatta with tassels\n\nThe perfect choice for weddings and evening events.",
      price: 6950,
      discountPercent: 20,
      costPrice: 3800,
      sizes: [["S", 2], ["M", 4], ["L", 3], ["XL", 1]],
      colors: ["Mulberry", "Royal Blue"],
      fabric: "Silk Blend with Zari",
      care: "Dry clean only.\nStore folded in a muslin cloth.\nKeep away from perfume and direct sunlight.",
      tags: ["three piece", "wedding", "silk", "zari", "luxury"],
      isBestSeller: true,
      soldCount: 29,
    },
    {
      name: "Sage Printed Cotton Three Piece",
      sku: "NV-3PC-004",
      shortDescription: "Everyday comfort in a printed cotton set — easy, breezy and beautifully coordinated.",
      description:
        "A soft sage-and-blush printed three-piece made for long, comfortable days.\n\nSet includes:\n- Printed cotton kameez\n- Matching printed salwar\n- Lightweight voile dupatta\n\nGreat value, great comfort, great everyday style.",
      price: 2950,
      costPrice: 1500,
      sizes: [["M", 10], ["L", 10], ["XL", 6], ["XXL", 4]],
      colors: ["Sage", "Peach"],
      fabric: "Pure Cotton · Dupatta: Voile",
      care: CARE_COTTON,
      tags: ["three piece", "everyday", "printed", "cotton"],
      soldCount: 11,
    },
  ],

  "modest-wear": [
    {
      name: "Classic Nida Abaya – Cocoa",
      sku: "NV-MOD-001",
      shortDescription: "A flowing nida abaya with elegant cuff detailing — modest, light and beautifully draped.",
      description:
        "Crafted from premium nida fabric that drapes softly and never clings. Finished with subtle embroidered cuffs and a hidden snap front.\n\nLength: approx. 54–58 inches (by size)\nFit: Relaxed, open flow\nDetails: Front snaps, inner pocket\n\nHijab sold separately.",
      price: 3450,
      discountPercent: 10,
      costPrice: 1800,
      sizes: [["52", 4], ["54", 6], ["56", 6], ["58", 3]],
      colors: ["Cocoa", "Black", "Dusty Rose"],
      fabric: "Premium Nida",
      care: CARE_DELICATE,
      tags: ["abaya", "modest", "nida", "everyday"],
      isNewArrival: true,
      isBestSeller: true,
      isFeatured: true,
      soldCount: 41,
    },
    {
      name: "Premium Jersey Hijab Set",
      sku: "NV-MOD-002",
      shortDescription: "Soft, stretchy jersey hijab with matching inner cap — no slipping, all-day comfort.",
      description:
        "Our bestselling jersey hijab, now as a set with a matching inner cap.\n\nThe breathable, stretchy jersey wraps easily and stays in place all day without pins slipping.\n\nSize: approx. 70 x 180 cm\nIncludes: 1 hijab + 1 inner cap",
      price: 750,
      costPrice: 320,
      sizes: [["Free Size", 30]],
      colors: ["Blush", "Mocha", "Ivory", "Black"],
      fabric: "Premium Viscose Jersey",
      care: CARE_JERSEY,
      tags: ["hijab", "jersey", "modest", "essentials"],
      isBestSeller: true,
      soldCount: 96,
    },
    {
      name: "Embroidered Front-Open Kaftan Abaya",
      sku: "NV-MOD-003",
      shortDescription: "Kaftan-style front-open abaya with tonal embroidery — elegant layering for every occasion.",
      description:
        "A graceful front-open abaya with wide kaftan sleeves and tonal floral embroidery along the front border.\n\nWear it open over a dress or closed with the matching belt.\n\nLength: approx. 56 inches\nIncludes: Matching tie belt",
      price: 4150,
      discountPercent: 15,
      costPrice: 2200,
      sizes: [["52", 2], ["54", 4], ["56", 3], ["58", 2]],
      colors: ["Mauve", "Olive"],
      fabric: "Crepe with Embroidery",
      care: CARE_DELICATE,
      tags: ["abaya", "kaftan", "modest", "festive"],
      isNewArrival: true,
      soldCount: 14,
    },
    {
      name: "Chiffon Prayer Set – Khimar & Skirt",
      sku: "NV-MOD-004",
      shortDescription: "Two-piece chiffon prayer set — full coverage, feather-light and travel-friendly.",
      description:
        "A two-piece prayer set with a long khimar and a matching elasticated skirt.\n\nLightweight chiffon folds small, making it perfect for travel, office and university.\n\nKhimar length: approx. 45 inches (front)\nSkirt: Elastic waist, full length",
      price: 1650,
      costPrice: 780,
      sizes: [["Free Size", 18]],
      colors: ["Dusty Pink", "Grey", "Beige"],
      fabric: "Soft Chiffon",
      care: CARE_DELICATE,
      tags: ["prayer set", "khimar", "modest", "travel"],
      soldCount: 23,
    },
  ],

  "co-ord-sets": [
    {
      name: "Blush Linen Co-ord Set",
      sku: "NV-CRD-001",
      shortDescription: "Relaxed linen shirt and wide-leg pants — polished comfort for work and weekends.",
      description:
        "A breezy two-piece set in soft blush linen-cotton. The relaxed button-down top pairs with high-waist wide-leg pants for an effortlessly put-together look.\n\nSet includes:\n- Button-down top with side slits\n- Wide-leg pants with elastic back and pockets\n\nWear together or style separately.",
      price: 3250,
      discountPercent: 10,
      costPrice: 1650,
      sizes: [["S", 5], ["M", 8], ["L", 7], ["XL", 3]],
      colors: ["Blush", "Sand"],
      fabric: "Linen-Cotton Blend",
      care: CARE_COTTON,
      tags: ["co-ord", "linen", "office", "western"],
      isNewArrival: true,
      isBestSeller: true,
      isFeatured: true,
      soldCount: 34,
    },
    {
      name: "Mocha Satin Lounge Co-ord",
      sku: "NV-CRD-002",
      shortDescription: "Silky satin top and pants — luxe lounge-to-dinner style.",
      description:
        "Fluid satin with a soft sheen, cut into a relaxed collared top and straight pants.\n\nDress it up with heels for dinner or keep it cosy at home — this set does both beautifully.\n\nSet includes:\n- Collared button top\n- Straight pants with elastic waist",
      price: 2850,
      costPrice: 1350,
      sizes: [["S", 4], ["M", 6], ["L", 5], ["XL", 3]],
      colors: ["Mocha", "Champagne"],
      fabric: "Premium Satin",
      care: CARE_DELICATE,
      tags: ["co-ord", "satin", "lounge", "party"],
      isNewArrival: true,
      soldCount: 12,
    },
    {
      name: "Floral Kurta & Palazzo Co-ord",
      sku: "NV-CRD-003",
      shortDescription: "Printed short kurta with matching palazzo — fusion style, full comfort.",
      description:
        "Where traditional meets modern: a hip-length printed kurta with a mandarin collar, paired with matching flared palazzos.\n\nSet includes:\n- Short kurta (approx. 32\")\n- Flared palazzo with elastic waist",
      price: 2650,
      discountPercent: 20,
      costPrice: 1300,
      sizes: [["S", 6], ["M", 9], ["L", 8], ["XL", 4], ["XXL", 2]],
      colors: ["Rose Print", "Indigo Print"],
      fabric: "Rayon",
      care: CARE_COTTON,
      tags: ["co-ord", "fusion", "palazzo", "printed"],
      isBestSeller: true,
      soldCount: 27,
    },
    {
      name: "Ivory Textured Tunic Co-ord",
      sku: "NV-CRD-004",
      shortDescription: "Textured tunic and cigarette pants — clean, minimal and quietly elegant.",
      description:
        "A minimal co-ord in textured ivory fabric. The longline tunic with side slits pairs with slim cigarette pants for a sleek silhouette.\n\nSet includes:\n- Longline tunic (approx. 38\")\n- Cigarette pants with side zip",
      price: 3050,
      costPrice: 1550,
      sizes: [["S", 3], ["M", 5], ["L", 1], ["XL", 0]],
      colors: ["Ivory", "Black"],
      fabric: "Textured Poly-Cotton",
      care: CARE_COTTON,
      tags: ["co-ord", "minimal", "office", "tunic"],
      soldCount: 8,
    },
  ],
};

/** Builds a small gallery from one Cloudinary image: original, mirrored and a close-up crop. */
function gallery(image: string) {
  if (!image) return [];
  const marker = "/image/upload/";
  if (!image.includes("res.cloudinary.com") || !image.includes(marker)) return [image];
  const [base, rest] = image.split(marker);
  const tail = rest.replace(/^f_auto,q_auto\//, "");
  const t = (tr: string) => `${base}${marker}f_auto,q_auto/${tr}/${tail}`;
  return [
    image,
    t("a_hflip"),
    t("c_crop,w_0.65,h_0.65,g_center"),
    t("c_crop,w_0.55,h_0.55,g_north"),
  ];
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  await mongoose.connect(uri);
  console.log("✓ Connected to MongoDB\n");

  let created = 0;
  for (const [catSlug, items] of Object.entries(CATALOGUE)) {
    const cat = await Category.findOne({ slug: catSlug }).lean();
    if (!cat) {
      console.log(`• Category "${catSlug}" not found — skipping its products`);
      continue;
    }
    console.log(`${cat.name}`);
    for (const p of items) {
      const slug = slugify(p.name);
      if (await Product.exists({ slug })) {
        console.log(`  • ${p.name} (already exists)`);
        continue;
      }
      // Product.save() runs the pre-save hook that computes salePrice.
      await new Product({
        name: p.name,
        slug,
        sku: p.sku,
        shortDescription: p.shortDescription,
        description: p.description,
        category: cat._id,
        images: gallery(cat.image),
        price: p.price,
        discountPercent: p.discountPercent ?? 0,
        costPrice: p.costPrice,
        variants: p.sizes.map(([size, stock]) => ({ size, stock })),
        colors: p.colors,
        fabric: p.fabric,
        care: p.care,
        tags: p.tags,
        isNewArrival: p.isNewArrival ?? false,
        isBestSeller: p.isBestSeller ?? false,
        isFeatured: p.isFeatured ?? false,
        active: true,
        soldCount: p.soldCount ?? 0,
      }).save();
      created++;
      console.log(`  ✓ ${p.name} — ৳${p.price}${p.discountPercent ? ` (−${p.discountPercent}%)` : ""}`);
    }
  }

  console.log(`\n🌸 Done. ${created} product(s) created.`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("✗ Failed:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
