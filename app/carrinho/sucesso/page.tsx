"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";

export default function SucessoPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-rose-earth/10 flex items-center justify-center mx-auto mb-8">
          <Heart className="w-8 h-8 text-rose-earth" strokeWidth={1} />
        </div>
        <h1 className="font-serif text-3xl font-light text-charcoal-dark mb-3">
          Obrigado pelo presente!
        </h1>
        <p className="font-sans text-sm text-charcoal/60 leading-relaxed mb-8">
          Seu pagamento foi confirmado com sucesso. Larissa e Rafael agradecem
          de coração pelo carinho e generosidade.
        </p>
        <Link href="/">
          <Button variant="outline">Voltar ao site</Button>
        </Link>
      </div>
    </div>
  );
}
