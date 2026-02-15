"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Foto do pré-wedding como fundo - posicionada para mostrar o casal */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/DSC00142.jpg"
          alt="Larissa e Rafael - pré-wedding"
          fill
          className="object-cover"
          style={{ objectPosition: "50% 65%" }}
          priority
          sizes="100vw"
        />
        {/* Overlay para legibilidade do texto */}
        <div className="absolute inset-0 bg-black/45" aria-hidden />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto text-center px-4 py-6 pt-20 sm:pt-24 md:pt-28">
        {/* Nomes e Data */}
        <div
          className={`transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Assinatura (imagem) - Larissa e Rafael, branca e menor */}
          <div className="relative w-full max-w-xl sm:max-w-2xl h-28 sm:h-36 md:h-40 mx-auto -mb-2">
            <Image
              src="/assinatura.png"
              alt="Larissa e Rafael"
              fill
              className="object-contain brightness-0 invert drop-shadow-sm"
              priority
            />
          </div>

          {/* Data */}
          <p
            className="font-display font-light text-base sm:text-lg tracking-[0.3em] text-white mt-4 sm:mt-6 drop-shadow-sm"
          >
            13 | 06 | 2026
          </p>

          {/* Versículo Bíblico */}
          <div className="max-w-2xl mx-auto mt-8 sm:mt-10">
            <p className="font-serif font-light text-base sm:text-lg italic text-white/85 leading-relaxed">
              "Há um momento para tudo e um tempo para todo propósito debaixo do céu."
            </p>
            <p className="font-sans text-xs sm:text-sm text-white/70 tracking-wider mt-1">
              Eclesiastes 3:1
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
