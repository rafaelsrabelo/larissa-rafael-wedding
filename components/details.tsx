import { MapPin } from "lucide-react";

export function Details() {
  return (
    <>
      {/* Cerimônia */}
      <section className="py-24 px-4" id="detalhes">
        <div className="w-full max-w-xl mx-auto">
          <h2 className="font-serif font-light text-4xl sm:text-5xl text-center text-charcoal mb-16">
            Cerimônia
          </h2>

          <div className="space-y-12">
            <div className="text-center space-y-3">
              <h3 className="font-sans text-xs sm:text-sm uppercase tracking-widest text-charcoal/60 mb-2">
                Data
              </h3>
              <p className="font-serif text-2xl sm:text-3xl text-charcoal">
                13 de junho de 2026
              </p>
            </div>

            <div className="w-12 h-px bg-charcoal/20 mx-auto" />

            <div className="text-center space-y-3">
              <h3 className="font-sans text-xs sm:text-sm uppercase tracking-widest text-charcoal/60 mb-2">
                Horário
              </h3>
              <p className="font-serif text-2xl sm:text-3xl text-charcoal">
                18h30
              </p>
            </div>

            <div className="w-12 h-px bg-charcoal/20 mx-auto" />

            <div className="text-center space-y-3">
              <h3 className="font-sans text-xs sm:text-sm uppercase tracking-widest text-charcoal/60 mb-2">
                Traje
              </h3>
              <p className="font-serif text-2xl sm:text-3xl text-charcoal">
                Passeio Completo
              </p>
            </div>

            <div className="w-12 h-px bg-charcoal/20 mx-auto" />

            <div className="text-center space-y-4">
              <h3 className="font-sans text-xs sm:text-sm uppercase tracking-widest text-charcoal/60 mb-2">
                Local
              </h3>
              <p className="font-serif text-2xl sm:text-3xl text-charcoal">
                Igreja Matriz Nossa Senhora dos Remédios
              </p>
              <p className="font-sans text-base text-charcoal/70">
                Av. da Universidade 2974, Benfica - Fortaleza - CE
              </p>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Av.+da+Universidade+2974,+Benfica,+Fortaleza,+CE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 font-sans text-sm tracking-wide border border-charcoal/20 text-charcoal transition-all hover:bg-charcoal hover:text-warm-white hover:border-charcoal"
              >
                <MapPin className="w-4 h-4" />
                Ver no mapa
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Recepção */}
      <section className="py-24 px-4 bg-sand/30" id="recepcao">
        <div className="w-full max-w-xl mx-auto">
          <h2 className="font-serif font-light text-4xl sm:text-5xl text-center text-charcoal mb-16">
            Recepção
          </h2>

          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h3 className="font-sans text-xs sm:text-sm uppercase tracking-widest text-charcoal/60 mb-2">
                Local
              </h3>
              <p className="font-serif text-2xl sm:text-3xl text-charcoal">
                North Buffet Eventos
              </p>
              <p className="font-sans text-base text-charcoal/70">
                Tv. Antônio Joaquim, 55 - Antônio Bezerra, Fortaleza - CE
              </p>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Tv.+Antônio+Joaquim,+55,+Antônio+Bezerra,+Fortaleza,+CE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 font-sans text-sm tracking-wide border border-charcoal/20 text-charcoal transition-all hover:bg-charcoal hover:text-warm-white hover:border-charcoal"
              >
                <MapPin className="w-4 h-4" />
                Ver no mapa
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
