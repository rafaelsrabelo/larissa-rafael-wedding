import Image from "next/image";

export function OurStory() {
  return (
    <section className="py-24 px-4 bg-sand/30" id="historia">
      <div className="w-full max-w-xl mx-auto">
        <h2 className="font-serif font-light text-4xl sm:text-5xl text-center text-charcoal mb-12">
          Nossa História
        </h2>

        {/* Foto do Casal */}
        <div className="relative w-full h-[400px] sm:h-[500px] mb-12">
          <Image
            src="/casallindo.jpeg"
            alt="Larissa e Rafael"
            fill
            className="object-contain"
          />
        </div>

        <div className="space-y-6 text-charcoal/80 leading-relaxed">
          <p className="font-sans text-base sm:text-lg">
            Há alguns anos, nossos caminhos se cruzaram de uma forma
            inesperada, mas que parecia ter sido sempre destinada a acontecer.
          </p>

          <p className="font-sans text-base sm:text-lg">
            Desde então, construímos uma história feita de pequenos momentos,
            risadas compartilhadas, desafios superados juntos e muito amor.
          </p>

          <p className="font-sans text-base sm:text-lg">
            Agora, queremos celebrar esse amor ao lado das pessoas que fazem
            parte das nossas vidas. Será uma honra ter você conosco neste dia
            tão especial.
          </p>
        </div>
      </div>
    </section>
  );
}
