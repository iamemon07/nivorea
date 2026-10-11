import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

// Fonts are self-hosted (latin subset from Google Fonts) so builds don't depend on fetching from Google.
const cormorant = localFont({
  src: [
    { path: "./fonts/CormorantGaramond-Variable.woff2", weight: "400 600", style: "normal" },
    { path: "./fonts/CormorantGaramond-Italic-Variable.woff2", weight: "400 600", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
});
const jost = localFont({
  src: "./fonts/Jost-Variable.woff2",
  weight: "300 600",
  variable: "--font-jost",
  display: "swap",
});
const script = localFont({
  src: "./fonts/GreatVibes-Regular.woff2",
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Nivorea Apparels — Style That Feels Like You", template: "%s · Nivorea Apparels" },
  description: "Elegant kurtis, three-pieces, modest wear and co-ord sets. Modern styles, timeless elegance.",
  icons: { icon: "/brand/logo.png", apple: "/brand/logo.png" },
};

export const viewport: Viewport = { themeColor: "#fbf6f1" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${script.variable}`}>
      <body className="min-h-screen">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: "#fffaf6", color: "#4a1f17", border: "1px solid #ecddd4", fontFamily: "var(--font-jost)" },
          }}
        />
      </body>
    </html>
  );
}
