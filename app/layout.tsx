import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Noto_Sans_TC } from "next/font/google";
import { CartProvider } from "@/contexts/cart-context";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Larissa & Rafael • 13.06.26",
  description: "Celebre conosco o nosso casamento em 13 de junho de 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${serif.variable} ${sans.variable} ${notoSansTC.variable} font-sans antialiased bg-warm-white text-charcoal-dark`}
        suppressHydrationWarning
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
