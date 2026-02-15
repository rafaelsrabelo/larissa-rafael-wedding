"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Gift, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import { useCart } from "@/contexts/cart-context";

export default function CarrinhoPage() {
  const { items, removeItem, total } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <p className="font-sans text-sm text-charcoal/50">Carregando…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <header className="sticky top-0 z-10 border-b border-charcoal/5 bg-warm-white/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/presentes">
            <Button
              variant="ghost"
              size="sm"
              className="font-sans text-charcoal/70 hover:text-charcoal-dark -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Voltar
            </Button>
          </Link>
          <h1 className="font-serif text-lg font-light text-charcoal-dark absolute left-1/2 -translate-x-1/2 pointer-events-none">
            Carrinho
          </h1>
          <div className="w-20" aria-hidden />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-charcoal/5 flex items-center justify-center mb-6">
              <Gift className="w-8 h-8 text-charcoal/30" strokeWidth={1} />
            </div>
            <p className="font-serif text-xl font-light text-charcoal-dark mb-2">
              Carrinho vazio
            </p>
            <p className="font-sans text-sm text-charcoal/60 max-w-sm mb-8">
              Adicione itens da lista de presentes para continuar.
            </p>
            <Link href="/presentes">
              <Button>Ver lista de presentes</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id}>
                  <Card className="overflow-hidden border-charcoal/5">
                    <CardContent className="p-0 flex flex-col sm:flex-row">
                      <div className="relative aspect-[16/10] sm:aspect-square sm:w-28 flex-shrink-0 bg-charcoal/5">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 112px"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Gift className="w-8 h-8 text-charcoal/15" strokeWidth={1} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-3 min-w-0">
                        <div>
                          <h2 className="font-serif text-lg font-light text-charcoal-dark">
                            {item.name}
                          </h2>
                          {item.description && (
                            <p className="font-sans text-sm text-charcoal/60 mt-0.5 line-clamp-1">
                              {item.description}
                            </p>
                          )}
                          <p className="font-sans text-sm text-rose-earth font-medium mt-2">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-charcoal/60 hover:text-red-600 hover:bg-red-50 self-start sm:self-center"
                          onClick={() => removeItem(item.id)}
                          aria-label="Remover do carrinho"
                        >
                          <Trash2 className="w-4 h-4 mr-1.5" strokeWidth={1.5} />
                          Remover
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>

            <Card className="border-charcoal/10 bg-charcoal/[0.02]">
              <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="font-sans text-sm text-charcoal/60">
                  {items.length} {items.length === 1 ? "item" : "itens"}
                </p>
                <p className="font-serif text-2xl font-light text-charcoal-dark">
                  Total: <span className="text-rose-earth font-medium">{formatPrice(total)}</span>
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/presentes" className="flex-1 sm:flex-initial">
                <Button variant="outline" className="w-full sm:w-auto">
                  Continuar comprando
                </Button>
              </Link>
              <Button className="w-full sm:flex-1" disabled title="Em breve">
                Finalizar seleção (em breve)
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
