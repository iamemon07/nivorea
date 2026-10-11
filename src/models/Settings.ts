import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const WalletSchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    number: { type: String, default: "" },
    accountType: { type: String, default: "Personal" },
    instructions: { type: String, default: "" },
  },
  { _id: false },
);

/** Singleton document (key = "site") holding all editable site content & business config. */
const SettingsSchema = new Schema(
  {
    key: { type: String, default: "site", unique: true },

    // Brand
    storeName: { type: String, default: "Nivorea Apparels" },
    tagline: { type: String, default: "Style That Feels Like You" },
    logo: { type: String, default: "/brand/logo.png" },
    currencySymbol: { type: String, default: "৳" },

    // Contact
    email: { type: String, default: "hello@nivorea.com" },
    phone: { type: String, default: "+880 1XXX-XXXXXX" },
    whatsapp: { type: String, default: "" },
    address: { type: String, default: "Dhaka, Bangladesh" },
    social: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      tiktok: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },

    // Announcement bar
    announcement: {
      enabled: { type: Boolean, default: true },
      text: { type: String, default: "Free delivery on orders over ৳3,000 · Delivery in 2–4 working days" },
      link: { type: String, default: "/shop" },
    },

    // Homepage content
    home: {
      categoriesTitle: { type: String, default: "Shop by Category" },
      newArrivalsTitle: { type: String, default: "New Arrivals" },
      newArrivalsSubtitle: { type: String, default: "Fresh silhouettes, crafted for every version of you" },
      bestSellersTitle: { type: String, default: "Best Sellers" },
      bestSellersSubtitle: { type: String, default: "Loved by our community" },
      storyTitle: { type: String, default: "Modern Styles, Timeless Elegance" },
      storyText: {
        type: String,
        default:
          "At Nivorea, every piece is chosen with care — breathable fabrics, graceful cuts and delicate details designed to make you feel effortlessly you. From everyday kurtis to festive three-pieces, we bring you fashion that feels as good as it looks.",
      },
      storyImage: { type: String, default: "/brand/banner.png" },
      features: {
        type: [{ title: String, text: String, _id: false }],
        default: [
          { title: "Premium Fabrics", text: "Soft, breathable & made to last" },
          { title: "Fast Delivery", text: "2–4 working days nationwide" },
          { title: "Cash on Delivery", text: "Pay when you receive" },
          { title: "Easy Exchange", text: "Hassle-free size exchange" },
        ],
      },
    },

    // Shipping
    shipping: {
      insideCityLabel: { type: String, default: "Inside Dhaka" },
      outsideCityLabel: { type: String, default: "Outside Dhaka" },
      insideFee: { type: Number, default: 70 },
      outsideFee: { type: Number, default: 130 },
      freeShippingThreshold: { type: Number, default: 3000 }, // 0 = disabled
      minDays: { type: Number, default: 2 },
      maxDays: { type: Number, default: 4 },
      weekendDays: { type: [Number], default: [5] }, // Friday
    },

    // Payments
    payments: {
      cod: { enabled: { type: Boolean, default: true }, instructions: { type: String, default: "Pay in cash when your parcel arrives." } },
      bkash: { type: WalletSchema, default: () => ({ enabled: false, accountType: "Personal", instructions: "Send Money to the number above, then enter your bKash number and Transaction ID." }) },
      nagad: { type: WalletSchema, default: () => ({ enabled: false, accountType: "Personal" }) },
      rocket: { type: WalletSchema, default: () => ({ enabled: false, accountType: "Personal" }) },
      bank: {
        enabled: { type: Boolean, default: false },
        details: { type: String, default: "" },
      },
    },

    // Invoice
    invoice: {
      footerNote: { type: String, default: "Thank you for shopping with Nivorea Apparels! For exchanges, contact us within 3 days of delivery." },
    },

    // SEO
    seo: {
      title: { type: String, default: "Nivorea Apparels — Style That Feels Like You" },
      description: {
        type: String,
        default: "Shop elegant kurtis, three-pieces, modest wear and co-ord sets from Nivorea Apparels. Modern styles, timeless elegance — delivered in 2–4 working days.",
      },
    },
    footerAbout: {
      type: String,
      default: "Modern styles, timeless elegance — just for you. Thoughtfully curated women's clothing for every version of you.",
    },
  },
  { timestamps: true, minimize: false },
);

export type SettingsDoc = InferSchemaType<typeof SettingsSchema>;
export const Settings = (models.Settings as Model<SettingsDoc>) || model("Settings", SettingsSchema);
