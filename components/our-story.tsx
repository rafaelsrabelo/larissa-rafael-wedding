import Image from "next/image";

export function OurStory() {
  return (
    <section className="py-24 sm:py-28 px-4 bg-sand/30" id="historia">
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Foto — lado esquerdo no desktop */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] max-h-[520px] overflow-hidden">
              <Image
                src="/DSC00950.jpg"
                alt="Larissa e Rafael"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Moldura sutil */}
              <div
                className="absolute inset-0 border border-white/50 pointer-events-none"
                aria-hidden
              />
            </div>
          </div>

          {/* Texto — lado direito no desktop */}
          <div className="order-1 lg:order-2">
            <p className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.25em] text-charcoal/50 mb-6">
              Nosso amor
            </p>
            <h2 className="font-serif font-light text-4xl sm:text-5xl text-charcoal-dark mb-8">
              Nossa História
            </h2>
            <div className="w-12 h-px bg-charcoal/20 mb-10" />

            <div className="space-y-6 text-charcoal/75">
              <p className="font-sans font-light text-sm sm:text-base leading-relaxed">
                Nossos caminhos se cruzaram há quase dez anos, mas Deus ainda precisava nos preparar para o momento perfeito. Quando nos demos conta, nossas vidas já estavam entrelaçadas novamente — e, dessa vez, era diferente.
              </p>

              <p className="font-sans font-light text-sm sm:text-base leading-relaxed">
                Foi assim que começamos a escrever nossa caminhada juntos, fortalecendo, dia após dia, um amor cada vez mais sólido, com a certeza de que queríamos algo a mais.
              </p>

              <p className="font-sans font-light text-sm sm:text-base leading-relaxed">
                Hoje, queremos celebrar esse amor e a convicção de que, desde o início, Deus já havia planejado tudo. Será uma honra dividir esse dia tão especial com pessoas tão importantes para nós.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
