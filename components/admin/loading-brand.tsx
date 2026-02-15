"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export function LoadingBrand({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-charcoal/70",
        className
      )}
      aria-hidden
    >
      <div className="relative h-8 w-8 animate-pulse">
        <Image
          src="/assinatura.png"
          alt=""
          width={32}
          height={32}
          className="object-contain opacity-70 brightness-0 invert"
        />
      </div>
      <span className="font-serif text-xs tracking-widest">Larissa & Rafael</span>
    </div>
  );
}
