"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MAX_ADULTS = 4;
const MAX_CHILDREN = 4;

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) {
    return digits ? `(${digits}` : "";
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function RSVP() {
  const [fullName, setFullName] = useState("");
  const [willAttend, setWillAttend] = useState<"sim" | "nao">("sim");
  const [adultCount, setAdultCount] = useState(1);
  const [extraAdultNames, setExtraAdultNames] = useState<string[]>([]);
  const [childCount, setChildCount] = useState(0);
  const [childNames, setChildNames] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const handleExtraAdultName = (index: number, value: string) => {
    setExtraAdultNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleChildName = (index: number, value: string) => {
    setChildNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const extraNames = adultCount > 1 ? extraAdultNames.slice(0, adultCount - 1) : [];
    const children = childCount > 0 ? childNames.slice(0, childCount) : [];

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          willAttend: willAttend === "sim",
          extraAdultNames: extraNames,
          childNames: children,
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim() || null,
          acceptedTerms,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erro ao enviar. Tente novamente.");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
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

  const needExtraAdultNames = willAttend === "sim" && adultCount > 1;
  const extraAdultFieldsCount = needExtraAdultNames ? adultCount - 1 : 0;
  const needChildNames = willAttend === "sim" && childCount > 0;

  const isFormValid =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0 &&
    acceptedTerms;

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
              htmlFor="fullName"
              className="block font-sans text-xs uppercase tracking-widest text-charcoal/70"
            >
              Nome completo *
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-0 py-3 bg-transparent border-0 border-b border-charcoal/20 font-sans text-base text-charcoal-dark placeholder:text-charcoal/30 focus:outline-none focus:border-charcoal-dark transition-colors"
              placeholder="Insira seu nome completo"
            />
          </div>

          <div className="space-y-2">
            <span className="block font-sans text-xs uppercase tracking-widest text-charcoal/70">
              Você irá ao evento?
            </span>
            <div className="flex gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="willAttend"
                  value="sim"
                  checked={willAttend === "sim"}
                  onChange={() => setWillAttend("sim")}
                  className="w-4 h-4 text-rose-earth border-charcoal/30 focus:ring-rose-earth/30"
                />
                <span className="font-sans text-base text-charcoal-dark">Sim</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="willAttend"
                  value="nao"
                  checked={willAttend === "nao"}
                  onChange={() => setWillAttend("nao")}
                  className="w-4 h-4 text-rose-earth border-charcoal/30 focus:ring-rose-earth/30"
                />
                <span className="font-sans text-base text-charcoal-dark">Não</span>
              </label>
            </div>
          </div>

          {willAttend === "sim" && (
            <>
              <div className="space-y-2">
                <label
                  htmlFor="adultCount"
                  className="block font-sans text-xs uppercase tracking-widest text-charcoal/70"
                >
                  Quantidade de adultos
                </label>
                <p className="font-sans text-xs text-charcoal/50 mb-1">
                  Já conta com você (1). Máximo {MAX_ADULTS} adultos.
                </p>
                <Select
                  value={String(adultCount)}
                  onValueChange={(v) => {
                    const n = Number(v);
                    setAdultCount(n);
                    setExtraAdultNames((prev) =>
                      prev.length >= n - 1 ? prev.slice(0, n - 1) : [...prev, ...Array(n - 1 - prev.length).fill("")]
                    );
                  }}
                >
                  <SelectTrigger
                    id="adultCount"
                    className="w-full h-12 rounded-none border-0 border-b border-charcoal/20 bg-transparent px-0 font-sans text-base text-charcoal-dark shadow-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 [&>span]:line-clamp-1"
                  >
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    sideOffset={4}
                    className="z-[100] bg-white border border-charcoal/10 shadow-xl"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} {n === 1 ? "adulto" : "adultos"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {extraAdultFieldsCount > 0 && (
                <div className="space-y-3">
                  <span className="block font-sans text-xs uppercase tracking-widest text-charcoal/70">
                    Nome das pessoas que vão junto
                  </span>
                  {Array.from({ length: extraAdultFieldsCount }).map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      value={extraAdultNames[i] ?? ""}
                      onChange={(e) => handleExtraAdultName(i, e.target.value)}
                      placeholder={`Nome do ${i + 2}º adulto`}
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-charcoal/20 font-sans text-base text-charcoal-dark placeholder:text-charcoal/30 focus:outline-none focus:border-charcoal-dark transition-colors"
                    />
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="childCount"
                  className="block font-sans text-xs uppercase tracking-widest text-charcoal/70"
                >
                  Quantidade de crianças
                </label>
                <p className="font-sans text-xs text-charcoal/50 mb-1">
                  Máximo {MAX_CHILDREN} crianças.
                </p>
                <Select
                  value={String(childCount)}
                  onValueChange={(v) => {
                    const n = Number(v);
                    setChildCount(n);
                    setChildNames((prev) =>
                      prev.length >= n ? prev.slice(0, n) : [...prev, ...Array(n - prev.length).fill("")]
                    );
                  }}
                >
                  <SelectTrigger
                    id="childCount"
                    className="w-full h-12 rounded-none border-0 border-b border-charcoal/20 bg-transparent px-0 font-sans text-base text-charcoal-dark shadow-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 [&>span]:line-clamp-1"
                  >
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    sideOffset={4}
                    className="z-[100] bg-white border border-charcoal/10 shadow-xl"
                  >
                    {[0, 1, 2, 3, 4].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} {n === 1 ? "criança" : "crianças"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {needChildNames && (
                <div className="space-y-3">
                  <span className="block font-sans text-xs uppercase tracking-widest text-charcoal/70">
                    Nome das crianças
                  </span>
                  {Array.from({ length: childCount }).map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      value={childNames[i] ?? ""}
                      onChange={(e) => handleChildName(i, e.target.value)}
                      placeholder={`Nome da criança ${i + 1}`}
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-charcoal/20 font-sans text-base text-charcoal-dark placeholder:text-charcoal/30 focus:outline-none focus:border-charcoal-dark transition-colors"
                    />
                  ))}
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block font-sans text-xs uppercase tracking-widest text-charcoal/70"
            >
              E-mail *
            </label>
            <p className="font-sans text-xs text-charcoal/50 mb-1">
              Você receberá a confirmação de presença neste e-mail
            </p>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-0 py-3 bg-transparent border-0 border-b border-charcoal/20 font-sans text-base text-charcoal-dark placeholder:text-charcoal/30 focus:outline-none focus:border-charcoal-dark transition-colors"
              placeholder="exemplo@email.com"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block font-sans text-xs uppercase tracking-widest text-charcoal/70"
            >
              Telefone para contato *
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              required
              className="w-full px-0 py-3 bg-transparent border-0 border-b border-charcoal/20 font-sans text-base text-charcoal-dark placeholder:text-charcoal/30 focus:outline-none focus:border-charcoal-dark transition-colors"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="message"
              className="block font-sans text-xs uppercase tracking-widest text-charcoal/70"
            >
              Recado (opcional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-0 py-3 bg-transparent border-0 border-b border-charcoal/20 font-sans text-base text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-charcoal transition-colors resize-none"
              placeholder="Deixe um recado para nós"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                required
                className="mt-1 w-4 h-4 rounded border-charcoal/30 text-rose-earth focus:ring-rose-earth/30"
              />
              <span className="font-sans text-sm text-charcoal/80">
                Declaro que li e aceito os{" "}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setTermsModalOpen(true); }}
                  className="underline underline-offset-2 hover:text-rose-earth transition-colors"
                >
                  Termos de uso
                </button>
                {" "}e a{" "}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setTermsModalOpen(true); }}
                  className="underline underline-offset-2 hover:text-rose-earth transition-colors"
                >
                  Política de Privacidade
                </button>
                {" "}do site. *
              </span>
            </label>
          </div>

          <Dialog open={termsModalOpen} onOpenChange={setTermsModalOpen}>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Termos de Uso e Política de Privacidade</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 font-sans text-sm text-charcoal/80">
                <section>
                  <h3 className="font-semibold text-charcoal-dark mb-2">Termos de Uso</h3>
                  <p className="mb-2">
                    Ao utilizar este site, você concorda em cumprir estes termos. O site destina-se a fornecer informações sobre o evento e permitir a confirmação de presença. O uso indevido do site, incluindo o envio de informações falsas ou abusivas, é proibido.
                  </p>
                  <p className="mb-2">
                    Não nos responsabilizamos por interrupções temporárias ou problemas técnicos. Reservamo-nos o direito de modificar estes termos a qualquer momento. O uso continuado do site após alterações constitui aceitação dos novos termos.
                  </p>
                </section>
                <section>
                  <h3 className="font-semibold text-charcoal-dark mb-2">Política de Privacidade</h3>
                  <p className="mb-2">
                    Respeitamos sua privacidade. Os dados informados no formulário de confirmação de presença (nome, e-mail, telefone e demais campos) são utilizados exclusivamente para fins de organização do evento, gerenciamento de convidados e contato relacionado ao casamento.
                  </p>
                  <p className="mb-2">
                    Não compartilhamos suas informações com terceiros para fins de marketing. Seus dados podem ser armazenados pelo período necessário à realização do evento e organização pós-evento. Você pode solicitar a exclusão de seus dados entrando em contato com os organizadores.
                  </p>
                  <p>
                    Ao enviar o formulário, você declara ter lido e aceito esta Política de Privacidade e os Termos de Uso.
                  </p>
                </section>
              </div>
            </DialogContent>
          </Dialog>

          {error && (
            <p className="font-sans text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="pt-6">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
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
