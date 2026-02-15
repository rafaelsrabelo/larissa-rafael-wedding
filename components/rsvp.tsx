"use client";

import { useState } from "react";

export function RSVP() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    guests: "1",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio (substituir com sua lógica de backend)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsSubmitting(false);

    // Reset form após 3 segundos
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", guests: "1", message: "" });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isSubmitted) {
    return (
      <section className="py-24 px-4" id="confirmar">
        <div className="w-full max-w-xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h2 className="font-serif font-light text-4xl sm:text-5xl text-charcoal-dark mb-6">
              Obrigado!
            </h2>
            <p className="font-sans font-light text-base sm:text-lg text-charcoal/70">
              Sua confirmação foi recebida com carinho.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4" id="confirmar">
      <div className="w-full max-w-xl mx-auto">
        <h2 className="font-serif font-light text-4xl sm:text-5xl text-center text-charcoal-dark mb-4">
          Confirme sua presença
        </h2>
        <p className="font-sans font-light text-sm sm:text-base text-center text-charcoal/60 mb-12">
          Ficaremos felizes em ter você conosco
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block font-sans text-xs uppercase tracking-widest text-charcoal/70"
            >
              Nome completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-0 py-3 bg-transparent border-0 border-b border-charcoal/20 font-sans text-base text-charcoal-dark placeholder:text-charcoal/30 focus:outline-none focus:border-charcoal-dark transition-colors"
              placeholder="Seu nome"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block font-sans text-xs uppercase tracking-widest text-charcoal/70"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-0 py-3 bg-transparent border-0 border-b border-charcoal/20 font-sans text-base text-charcoal-dark placeholder:text-charcoal/30 focus:outline-none focus:border-charcoal-dark transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="guests"
              className="block font-sans text-xs uppercase tracking-widest text-charcoal/70"
            >
              Número de convidados
            </label>
            <select
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              required
              className="w-full px-0 py-3 bg-transparent border-0 border-b border-charcoal/20 font-sans text-base text-charcoal-dark focus:outline-none focus:border-charcoal-dark transition-colors"
            >
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "pessoa" : "pessoas"}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="message"
              className="block font-sans text-xs uppercase tracking-widest text-charcoal/70"
            >
              Mensagem (opcional)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-0 py-3 bg-transparent border-0 border-b border-charcoal/20 font-sans text-base text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-charcoal transition-colors resize-none"
              placeholder="Deixe uma mensagem para nós"
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-4 font-sans text-sm tracking-widest uppercase bg-charcoal text-warm-white transition-all hover:bg-rose-earth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Enviando..." : "Confirmar presença"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
