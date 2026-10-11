/**
 * One-time setup: creates the owner admin, default settings, categories, content pages
 * and the hero banner. Safe to re-run — existing records are left untouched.
 *
 *   npm run seed
 */
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { Admin } from "../src/models/Admin";
import { Banner } from "../src/models/Banner";
import { Category } from "../src/models/Category";
import { Page } from "../src/models/Page";
import { Settings } from "../src/models/Settings";

const CATEGORIES = [
  { name: "Kurtis", slug: "kurtis", description: "Graceful everyday & festive kurtis.", sortOrder: 1 },
  { name: "Three Pieces", slug: "three-pieces", description: "Complete sets with kameez, salwar & dupatta.", sortOrder: 2 },
  { name: "Modest Wear", slug: "modest-wear", description: "Elegant abayas, hijabs and modest essentials.", sortOrder: 3 },
  { name: "Co-ord Sets", slug: "co-ord-sets", description: "Effortlessly matched, endlessly chic.", sortOrder: 4 },
];

const PAGES = [
  {
    slug: "about",
    title: "About Us",
    content: `## Style That Feels Like You

Nivorea Apparels was born from a simple belief — every woman deserves clothing that feels as good as it looks.

We curate modern styles with timeless elegance: breathable fabrics, graceful cuts and delicate details, thoughtfully chosen for every version of you.

## Our Promise
- Carefully selected, quality fabrics
- Honest pricing
- Fast delivery in 2–4 working days
- Friendly support, before and after your order`,
  },
  {
    slug: "shipping-policy",
    title: "Shipping & Delivery",
    content: `## Delivery Time
Orders are delivered within 2–4 working days from the order date. Fridays and public holidays are not counted.

## Delivery Charges
Delivery charges depend on your location and are shown at checkout. Enjoy free delivery on orders above the free-delivery threshold.

## Order Confirmation
After you place an order, our team will call you to confirm before dispatch.`,
  },
  {
    slug: "return-exchange",
    title: "Return & Exchange",
    content: `## Easy Exchange
If the size doesn't fit, you can request an exchange within 3 days of receiving your parcel.

## Conditions
- Items must be unused, unwashed and with original tags
- Sale items are eligible for size exchange only
- Delivery charges for exchanges are borne by the customer unless the item is defective

## How to Request
Contact us by phone, WhatsApp or Facebook with your order number.`,
  },
  {
    slug: "size-guide",
    title: "Size Guide",
    content: `## How to Measure
- Bust: measure around the fullest part of your bust
- Waist: measure around your natural waistline
- Hip: measure around the fullest part of your hips

## Standard Sizes (inches)
- S: Bust 36 · Waist 30 · Hip 38
- M: Bust 38 · Waist 32 · Hip 40
- L: Bust 40 · Waist 34 · Hip 42
- XL: Bust 42 · Waist 36 · Hip 44
- XXL: Bust 44 · Waist 38 · Hip 46`,
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    content: `We collect only the information needed to process and deliver your order — your name, phone number, email and address.

We never sell or share your personal information with third parties except our delivery partners, who need your address and phone number to deliver your parcel.

For any privacy questions, please contact us.`,
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    content: `By placing an order on our website you agree to these terms.

## Pricing
All prices are in BDT and include applicable taxes. Prices may change without prior notice.

## Orders
We reserve the right to cancel orders in case of stock unavailability, pricing errors or suspected fraud. You will be notified and refunded where applicable.

## Product Colors
Actual colors may vary slightly from images due to screen settings and photography lighting.`,
  },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes("<db_username>")) {
    throw new Error("Set MONGODB_URI in .env.local (replace <db_username> and <db_password>) before seeding.");
  }
  await mongoose.connect(uri);
  console.log("✓ Connected to MongoDB");

  const email = (process.env.ADMIN_EMAIL || "admin@nivorea.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "ChangeMe@123";
  if (!(await Admin.exists({ email }))) {
    await Admin.create({
      name: process.env.ADMIN_NAME || "Nivorea Admin",
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "owner",
    });
    console.log(`✓ Owner admin created: ${email}`);
  } else {
    console.log(`• Admin ${email} already exists`);
  }

  if (!(await Settings.exists({ key: "site" }))) {
    await Settings.create({ key: "site" });
    console.log("✓ Default site settings created");
  }

  for (const c of CATEGORIES) {
    const res = await Category.updateOne({ slug: c.slug }, { $setOnInsert: c }, { upsert: true });
    if (res.upsertedCount) console.log(`✓ Category: ${c.name}`);
  }

  for (const p of PAGES) {
    const res = await Page.updateOne({ slug: p.slug }, { $setOnInsert: p }, { upsert: true });
    if (res.upsertedCount) console.log(`✓ Page: ${p.title}`);
  }

  if (!(await Banner.exists({}))) {
    await Banner.create({
      title: "Nivorea Apparels — Style That Feels Like You",
      image: "/brand/banner.png",
      link: "/shop",
      placement: "hero",
      showOverlayText: false,
      sortOrder: 0,
    });
    console.log("✓ Hero banner created");
  }

  console.log("\n🌸 Seed complete. Log in at /admin/login");
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("✗ Seed failed:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
