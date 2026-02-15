import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lista de presentes | Larissa & Rafael",
  description: "Lista de presentes para o casamento de Larissa e Rafael",
};

export default function PresentesLayout({
  children,
}: { children: React.ReactNode }) {
  return <>{children}</>;
}
