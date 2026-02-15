"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Gift, LayoutGrid, List, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";

type GiftItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
};

type ViewMode = "cards" | "table";
type SortOption = "a-z" | "price-asc" | "price-desc";

export default function PresentesPage() {
  const [items, setItems] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [sort, setSort] = useState<SortOption>("a-z");
  const { addItem, isInCart, items: cartItems } = useCart();

  useEffect(() => {
    fetch("/api/gifts")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const sortedItems = useMemo(() => {
    const copy = [...items];
    if (sort === "a-z") {
      copy.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    } else if (sort === "price-asc") {
      copy.sort((a, b) => a.price - b.price);
    } else {
      copy.sort((a, b) => b.price - a.price);
    }
    return copy;
  }, [items, sort]);

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header minimalista com voltar */}
      <header className="sticky top-0 z-10 border-b border-charcoal/5 bg-warm-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/#presentes">
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
            Lista de presentes
          </h1>
          <Link href="/carrinho" className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-charcoal/5 transition-colors">
            <ShoppingCart className="w-5 h-5 text-charcoal-dark" strokeWidth={1.5} />
            {cartItems.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-earth px-1 text-[10px] font-sans font-medium text-white">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {loading ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden border-charcoal/5">
                <Skeleton className="aspect-[4/3] rounded-none" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </ul>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-charcoal/5 flex items-center justify-center mb-6">
              <Gift className="w-8 h-8 text-charcoal/30" strokeWidth={1} />
            </div>
            <p className="font-serif text-xl font-light text-charcoal-dark mb-2">
              Lista em breve
            </p>
            <p className="font-sans text-sm text-charcoal/60 max-w-sm mb-8">
              Nossa lista de presentes está sendo preparada. Volte em breve.
            </p>
            <Link href="/#presentes">
              <Button variant="outline" size="sm">
                Voltar aos presentes
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Ordenação + Toggle Cards / Tabela */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="font-sans text-sm text-charcoal/60 whitespace-nowrap">
                  Ordenar:
                </span>
                <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                  <SelectTrigger
                    size="sm"
                    className="w-[180px] font-sans text-charcoal-dark border-charcoal/20 bg-white hover:bg-charcoal/[0.02] focus:ring-rose-earth/30"
                  >
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent className="font-sans border-charcoal/10 bg-warm-white">
                    <SelectItem value="a-z" className="text-charcoal-dark focus:bg-charcoal/5 focus:text-charcoal-dark">
                      A–Z
                    </SelectItem>
                    <SelectItem value="price-asc" className="text-charcoal-dark focus:bg-charcoal/5 focus:text-charcoal-dark">
                      Menor preço
                    </SelectItem>
                    <SelectItem value="price-desc" className="text-charcoal-dark focus:bg-charcoal/5 focus:text-charcoal-dark">
                      Maior preço
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div
                className="inline-flex rounded-lg border border-charcoal/10 bg-warm-white p-0.5"
                role="tablist"
                aria-label="Visualização"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === "cards"}
                  onClick={() => setViewMode("cards")}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-sans transition-colors",
                    viewMode === "cards"
                      ? "bg-charcoal-dark text-warm-white"
                      : "text-charcoal/70 hover:text-charcoal-dark"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />
                  Cards
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === "table"}
                  onClick={() => setViewMode("table")}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-sans transition-colors",
                    viewMode === "table"
                      ? "bg-charcoal-dark text-warm-white"
                      : "text-charcoal/70 hover:text-charcoal-dark"
                  )}
                >
                  <List className="w-4 h-4" strokeWidth={1.5} />
                  Tabela
                </button>
              </div>
            </div>

            {viewMode === "cards" ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedItems.map((item, index) => (
                  <li
                    key={item.id}
                    className="animate-fade-in-up"
                    style={{
                      animationDelay: `${index * 60}ms`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <Card className="overflow-hidden border-charcoal/5 bg-white shadow-none transition-shadow hover:shadow-sm h-full flex flex-col">
                      <div className="relative aspect-[4/3] bg-charcoal/5">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Gift className="w-12 h-12 text-charcoal/15" strokeWidth={1} />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4 flex flex-col flex-1 min-w-0">
                        <h2 className="font-serif text-lg font-light text-charcoal-dark tracking-tight">
                          {item.name}
                        </h2>
                        {item.description && (
                          <p className="font-sans text-sm text-charcoal/60 mt-1 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                        <p className="font-sans text-sm text-rose-earth mt-2 font-medium">
                          {formatPrice(item.price)}
                        </p>
                        <Button
                          size="sm"
                          className="mt-3 w-full"
                          onClick={() => addItem(item)}
                          disabled={isInCart(item.id)}
                        >
                          {isInCart(item.id) ? (
                            "No carrinho"
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-2" strokeWidth={1.5} />
                              Adicionar ao carrinho
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            ) : (
              <Card className="overflow-hidden border-charcoal/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-charcoal/10 bg-charcoal/5">
                        <th className="font-sans text-xs font-medium uppercase tracking-wider text-charcoal/60 py-3 px-4 w-20">
                          Imagem
                        </th>
                        <th className="font-sans text-xs font-medium uppercase tracking-wider text-charcoal/60 py-3 px-4">
                          Nome
                        </th>
                        <th className="font-sans text-xs font-medium uppercase tracking-wider text-charcoal/60 py-3 px-4 hidden sm:table-cell">
                          Descrição
                        </th>
                        <th className="font-sans text-xs font-medium uppercase tracking-wider text-charcoal/60 py-3 px-4 text-right whitespace-nowrap">
                          Preço
                        </th>
                        <th className="font-sans text-xs font-medium uppercase tracking-wider text-charcoal/60 py-3 px-4 w-32">
                          Ação
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedItems.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-charcoal/5 hover:bg-charcoal/[0.02] transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-charcoal/5 flex-shrink-0">
                              {item.imageUrl ? (
                                <Image
                                  src={item.imageUrl}
                                  alt=""
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Gift className="w-5 h-5 text-charcoal/20" strokeWidth={1} />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-serif font-light text-charcoal-dark">
                            {item.name}
                          </td>
                          <td className="py-3 px-4 font-sans text-sm text-charcoal/60 hidden sm:table-cell max-w-xs">
                            <span className="line-clamp-2 block">
                              {item.description || "—"}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-sans text-sm text-rose-earth font-medium text-right whitespace-nowrap">
                            {formatPrice(item.price)}
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full sm:w-auto"
                              onClick={() => addItem(item)}
                              disabled={isInCart(item.id)}
                            >
                              {isInCart(item.id) ? "No carrinho" : "Adicionar"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
