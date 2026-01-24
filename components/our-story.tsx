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
            Nossos caminhos se cruzaram há quase dez anos, mas Deus ainda precisava nos preparar para o momento perfeito. Quando nos demos conta, nossas vidas já estavam entrelaçadas novamente — e, dessa vez, era diferente.
          </p>

          <p className="font-sans text-base sm:text-lg">
            Foi assim que começamos a escrever nossa caminhada juntos, fortalecendo, dia após dia, um amor cada vez mais sólido, com a certeza de que queríamos algo a mais.
          </p>

          <p className="font-sans text-base sm:text-lg">
            Hoje, queremos celebrar esse amor e a convicção de que, desde o início, Deus já havia planejado tudo. Será uma honra dividir esse dia tão especial com pessoas tão importantes para nós.
          </p>
        </div>
      </div>
    </section>
  );
}
