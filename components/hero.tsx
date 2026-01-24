"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Countdown } from "./countdown";

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-6 pt-20 sm:pt-24 md:pt-28">
      <div className="w-full max-w-6xl mx-auto text-center">
        {/* Assinatura e Data - Muito próximas */}
        <div
          className={`transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ opacity: mounted ? 1 : 0 }}
        >
          {/* Assinatura - Aumentada */}
          <div className="relative w-full max-w-6xl h-48 sm:h-56 md:h-72 lg:h-80 mx-auto -mb-4">
            <Image
              src="/assinatura.png"
              alt="Larissa & Rafael"
              fill
              className="object-contain"
              priority
            />
          </div>
          
          {/* Data e Versículo Bíblico */}
          <div className="mt-0 space-y-6">
            {/* Versículo Bíblico */}
            <div className="max-w-2xl mx-auto">
              <p className="font-serif font-light text-base sm:text-lg italic text-charcoal/60 leading-relaxed mb-2">
                "Há um momento para tudo e um tempo para todo propósito debaixo do céu."
              </p>
              <p className="font-sans text-xs sm:text-sm text-charcoal/50 tracking-wider">
                Eclesiastes 3:1
              </p>
            </div>

            {/* Data */}
            <p className="font-serif font-light text-lg sm:text-xl tracking-wider text-charcoal/70 pt-4">
              13 de junho de 2026
            </p>
          </div>
        </div>

        {/* Aquarela da Igreja */}
        <div
          className={`mt-12 transition-all duration-1000 delay-400 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ opacity: mounted ? 1 : 0 }}
        >
          <div className="relative w-full max-w-4xl h-64 sm:h-80 md:h-96 mx-auto">
            <Image
              src="/aquarela.png"
              alt="Nossa Igreja"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Contagem Regressiva */}
        <div
          className={`mt-8 transition-all duration-1000 delay-600 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ opacity: mounted ? 1 : 0 }}
        >
          <Countdown />
        </div>
      </div>
    </section>
  );
}
