import Image from "next/image";

export function Footer() {
  return (
    <footer className="py-16 px-4">
      <div className="w-full max-w-xl mx-auto text-center space-y-8">
        <p className="font-serif text-2xl sm:text-3xl text-charcoal">
          Com amor,
        </p>
        
        {/* Assinatura do casal */}
        <div className="relative w-full max-w-2xl h-32 sm:h-40 mx-auto">
          <Image
            src="/assinatura.png"
            alt="Larissa & Rafael"
            fill
            className="object-contain opacity-80"
          />
        </div>

        <div className="pt-4">
          <p className="font-sans text-sm tracking-widest text-charcoal/50">
            13.06.26
          </p>
        </div>
      </div>
    </footer>
  );
}
