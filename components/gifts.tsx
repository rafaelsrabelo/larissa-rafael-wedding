import Link from "next/link";
import { Gift, Home } from "lucide-react";

const giftOptions = [
  {
    icon: Home,
    title: "Lista de presentes",
    description: "Escolha um presente da nossa lista",
    href: "/presentes",
    linkText: "Ver lista",
  },
  {
    icon: Gift,
    title: "PIX",
    description: "Prefere enviar um presente em dinheiro?",
    href: "#",
    linkText: "Ver dados",
  },
];

export function Gifts() {
  return (
    <section className="py-24 px-4 bg-warm-white" id="presentes">
      <div className="w-full max-w-3xl mx-auto">
        <h2 className="font-serif font-light text-4xl sm:text-5xl text-center text-charcoal-dark mb-6">
          Presentes
        </h2>
        <p className="font-sans font-light text-sm sm:text-base text-center text-charcoal/60 mb-16 max-w-xl mx-auto">
          Sua presença já é o nosso maior presente, mas se desejar nos
          presentear, ficaremos muito gratos.
        </p>

        <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {giftOptions.map((option, index) => (
            <div
              key={index}
              className="text-center space-y-4 p-8 bg-warm-white/50 border border-charcoal/5 transition-colors hover:border-charcoal/10"
            >
              <div className="flex justify-center">
                <option.icon className="w-8 h-8 text-charcoal/70" strokeWidth={1} />
              </div>
              <h3 className="font-serif font-light text-xl sm:text-2xl text-charcoal-dark">
                {option.title}
              </h3>
              <p className="font-sans font-light text-sm text-charcoal/60 min-h-[3rem]">
                {option.description}
              </p>
              <Link
                href={option.href}
                className="inline-block font-sans text-xs uppercase tracking-widest text-charcoal-dark border-b border-charcoal/20 hover:border-rose-earth hover:text-rose-earth transition-colors pb-1"
              >
                {option.linkText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
