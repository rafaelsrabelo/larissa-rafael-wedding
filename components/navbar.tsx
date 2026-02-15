"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "Nossa História", href: "#historia" },
  { label: "Cerimônia", href: "#detalhes" },
  { label: "Recepção", href: "#recepcao" },
  { label: "Presentes", href: "#presentes" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-warm-white/95 backdrop-blur-sm border-b border-charcoal/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-20 sm:h-24 relative">
          {/* Logo - branca no topo, normal após scroll */}
          <Link href="#" className="md:absolute md:left-0 flex-shrink-0 group">
            <div
              className={`relative w-28 sm:w-36 h-10 sm:h-12 transition-all duration-500 group-hover:opacity-70 ${
                isScrolled ? "" : "brightness-0 invert"
              }`}
            >
              <Image
                src="/logo-monogram.png"
                alt="Larissa & Rafael"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Navigation Links - Desktop - brancos no topo, escuros após scroll */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-serif text-sm lg:text-base transition-colors tracking-wide ${
                  isScrolled
                    ? "text-charcoal-dark/90 hover:text-rose-earth"
                    : "text-white hover:text-white/80"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button - branco no topo, escuro após scroll */}
          <button
            className={`md:hidden absolute right-0 p-2 transition-colors ${
              isScrolled ? "text-charcoal-dark/90 hover:text-rose-earth" : "text-white hover:text-white/80"
            }`}
            aria-label="Menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-warm-white/98 backdrop-blur-sm border-b border-charcoal/5 animate-fade-in-up">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block py-3 font-serif text-lg text-charcoal-dark/90 hover:text-rose-earth transition-colors text-center border-b border-charcoal/5 last:border-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
