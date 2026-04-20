import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Noto_Sans_TC } from "next/font/google";
import { CartProvider } from "@/contexts/cart-context";
import { Toaster } from "@/components/ui/sonner";
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
  metadataBase: new URL("https://www.larissaerafael.site"),
  title: "Larissa & Rafael • 13.06.26",
  description: "Celebre conosco o nosso casamento em 13 de junho de 2026",
  openGraph: {
    title: "Larissa & Rafael • 13.06.26",
    description: "Celebre conosco o nosso casamento em 13 de junho de 2026",
    url: "https://www.larissaerafael.site",
    siteName: "Larissa & Rafael",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Larissa & Rafael • 13.06.26",
    description: "Celebre conosco o nosso casamento em 13 de junho de 2026",
  },
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
        <CartProvider>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </CartProvider>
      </body>
    </html>
  );
}
