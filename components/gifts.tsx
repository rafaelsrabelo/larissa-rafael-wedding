import { Gift, Home, Plane } from "lucide-react";

const giftOptions = [
  {
    icon: Home,
    title: "Lista de presentes",
    description: "Escolha um presente da nossa lista",
    link: "#",
    linkText: "Ver lista",
  },
  {
    icon: Plane,
    title: "Lua de mel",
    description: "Contribua para a nossa viagem dos sonhos",
    link: "#",
    linkText: "Contribuir",
  },
  {
    icon: Gift,
    title: "PIX",
    description: "Prefere enviar um presente em dinheiro?",
    link: "#",
    linkText: "Ver dados",
  },
];

export function Gifts() {
  return (
    <section className="py-24 px-4 bg-sand/30" id="presentes">
      <div className="w-full max-w-3xl mx-auto">
        <h2 className="font-serif font-light text-4xl sm:text-5xl text-center text-charcoal mb-6">
          Presentes
        </h2>
        <p className="font-sans text-base sm:text-lg text-center text-charcoal/60 mb-16 max-w-xl mx-auto">
          Sua presença já é o nosso maior presente, mas se desejar nos
          presentear, ficaremos muito gratos.
        </p>

        <div className="grid sm:grid-cols-3 gap-8">
          {giftOptions.map((option, index) => (
            <div
              key={index}
              className="text-center space-y-4 p-8 bg-warm-white/50 transition-colors hover:bg-warm-white"
            >
              <div className="flex justify-center">
                <option.icon className="w-8 h-8 text-charcoal/70" strokeWidth={1} />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-charcoal">
                {option.title}
              </h3>
              <p className="font-sans text-sm text-charcoal/60 min-h-[3rem]">
                {option.description}
              </p>
              <a
                href={option.link}
                className="inline-block font-sans text-xs uppercase tracking-widest text-charcoal border-b border-charcoal/20 hover:border-rose-earth hover:text-rose-earth transition-colors pb-1"
              >
                {option.linkText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
