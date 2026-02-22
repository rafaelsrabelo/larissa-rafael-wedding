import { MapPin } from "lucide-react";

const detailCardClass =
  "p-6 sm:p-8 bg-warm-white/50 border border-charcoal/5 transition-colors hover:border-charcoal/10";
const labelClass =
  "font-sans text-[11px] sm:text-xs uppercase tracking-[0.2em] text-charcoal/50 mb-2";
const valueClass = "font-serif font-light text-base sm:text-lg text-charcoal-dark leading-relaxed";
const valueDisplayClass =
  "font-display font-light text-base sm:text-lg text-charcoal-dark tracking-[0.15em]";

export function Details() {
  return (
    <>
      {/* Cerimônia & Recepção — layout unificado */}
      <section className="py-24 px-4" id="detalhes">
        <div className="w-full max-w-4xl mx-auto">
          <h2 className="font-serif font-light text-4xl sm:text-5xl text-center text-charcoal-dark mb-16">
            Cerimônia
          </h2>

          <div className="flex flex-col items-center gap-4 sm:gap-6">
            {/* Local */}
            <div className={`${detailCardClass} w-full max-w-xl text-center`}>
              <p className={labelClass}>Local</p>
              <p className={valueClass}>Igreja Matriz Nossa Senhora dos Remédios</p>
              <p className="font-sans font-light text-sm text-charcoal/60 mt-2">
                Av. da Universidade 2974, Benfica — Fortaleza
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Av.+da+Universidade+2974,+Benfica,+Fortaleza,+CE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-4 font-sans text-xs tracking-widest uppercase text-charcoal/60 hover:text-charcoal-dark transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
                Ver no mapa
              </a>
            </div>

            {/* Data e Horário */}
            <div className={`${detailCardClass} w-full max-w-xl flex flex-col sm:flex-row sm:items-start sm:justify-center gap-6 sm:gap-8 text-center sm:text-left`}>
              <div className="flex flex-col items-center">
                <p className={labelClass}>Data</p>
                <p className="font-display font-light text-charcoal-dark tracking-[0.15em]">13 | 06 | 2026</p>
              </div>
              <div className="flex flex-col items-center">
                <p className={labelClass}>Horário</p>
                <p className="font-display font-light text-charcoal-dark tracking-[0.15em]">18h30</p>
              </div>
            </div>

            {/* Traje */}
            <div className={`${detailCardClass} w-full max-w-xl text-center`}>
              <p className={labelClass}>Traje</p>
              <p className={valueClass}>Passeio Completo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recepção — mesma estrutura */}
      <section className="py-24 px-4 bg-sand/30" id="recepcao">
        <div className="w-full max-w-4xl mx-auto">
          <h2 className="font-serif font-light text-4xl sm:text-5xl text-center text-charcoal-dark mb-16">
            Recepção
          </h2>

          <div className="flex justify-center">
            <div className={`${detailCardClass} w-full max-w-xl text-center`}>
              <p className={labelClass}>Local</p>
              <p className={valueClass}>North Buffet Eventos</p>
              <p className="font-sans font-light text-sm text-charcoal/60 mt-2">
                Tv. Antônio Joaquim, 55 — Antônio Bezerra, Fortaleza
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Tv.+Antônio+Joaquim,+55,+Antônio+Bezerra,+Fortaleza,+CE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-4 font-sans text-xs tracking-widest uppercase text-charcoal/60 hover:text-charcoal-dark transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
                Ver no mapa
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
