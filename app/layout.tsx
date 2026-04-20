import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/components/providers/CartProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const display = Anton({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Plot Armour",
    template: "%s | Plot Armour",
  },
  description:
    "Plot Armour is a brutalist streetwear storefront built around sharp product drops and AI try-on.",
  icons: {
    icon: "/brand/plot-armour-mark.png",
    shortcut: "/brand/plot-armour-mark.png",
    apple: "/brand/plot-armour-mark.png",
  },
  openGraph: {
    title: "Plot Armour",
    description:
      "Dark, gothic streetwear with AI try-on, razor-sharp product pages, and editorial drop layouts.",
    images: ["/brand/plot-armour-mark.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plot Armour",
    description:
      "Dark, gothic streetwear with AI try-on and a brutalist commerce experience.",
    images: ["/brand/plot-armour-mark.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3efe7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
