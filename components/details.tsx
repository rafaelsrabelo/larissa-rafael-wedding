import { MapPin } from "lucide-react";

export function Details() {
  return (
    <section className="py-24 px-4 bg-sand/30" id="detalhes">
      <div className="w-full max-w-xl mx-auto">
        <h2 className="font-serif font-light text-4xl sm:text-5xl text-center text-charcoal mb-16">
          Detalhes
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
              18h00
            </p>
          </div>

          <div className="w-12 h-px bg-charcoal/20 mx-auto" />

          <div className="text-center space-y-4">
            <h3 className="font-sans text-xs sm:text-sm uppercase tracking-widest text-charcoal/60 mb-2">
              Local
            </h3>
            <p className="font-serif text-2xl sm:text-3xl text-charcoal">
              [Nome do Local]
            </p>
            <p className="font-sans text-base text-charcoal/70">
              [Endereço completo]
            </p>

            <a
              href="https://maps.google.com"
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
  );
}
