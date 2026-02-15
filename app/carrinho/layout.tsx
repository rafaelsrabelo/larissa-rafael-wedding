import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrinho | Larissa & Rafael",
  description: "Seu carrinho de presentes do casamento",
};

export default function CarrinhoLayout({
  children,
}: { children: React.ReactNode }) {
  return <>{children}</>;
}
