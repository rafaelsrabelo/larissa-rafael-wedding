"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Gift } from "lucide-react";
import { formatPrice } from "@/lib/format-price";

type GiftItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
};

export function GiftList() {
  const [items, setItems] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gifts")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="font-sans text-sm text-charcoal/50">Carregando lista…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
      {items.map((item) => (
        <article
          key={item.id}
          className="bg-warm-white/50 border border-charcoal/5 rounded-lg overflow-hidden transition-colors hover:border-charcoal/10"
        >
          <div className="aspect-[4/3] relative bg-charcoal/5">
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
                <Gift className="w-12 h-12 text-charcoal/20" strokeWidth={1} />
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-serif font-light text-lg text-charcoal-dark">
              {item.name}
            </h3>
            {item.description && (
              <p className="font-sans text-sm text-charcoal/60 mt-1 line-clamp-2">
                {item.description}
              </p>
            )}
            <p className="font-sans text-sm text-rose-earth mt-2">
              {formatPrice(item.price)}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
