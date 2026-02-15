"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  variant?: "default" | "light";
}

export function Countdown({ variant = "default" }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const weddingDate = new Date("2026-06-13T18:00:00").getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = weddingDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { value: timeLeft.days, label: timeLeft.days === 1 ? "dia" : "dias" },
    { value: timeLeft.hours, label: timeLeft.hours === 1 ? "hora" : "horas" },
    { value: timeLeft.minutes, label: timeLeft.minutes === 1 ? "minuto" : "minutos" },
    { value: timeLeft.seconds, label: timeLeft.seconds === 1 ? "segundo" : "segundos" },
  ];

  const isLight = variant === "light";

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <h2
        className={`font-serif font-light text-3xl sm:text-4xl text-center ${
          isLight ? "text-white/90" : "text-charcoal-dark/90"
        }`}
      >
        Contagem Regressiva
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {timeUnits.map((unit, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center p-6 sm:p-8 border transition-all ${
              isLight
                ? "border-white/30 bg-white/10 hover:border-white/50"
                : "border-charcoal/10 bg-warm-white/50 hover:border-rose-earth/30"
            }`}
          >
            <span
              className={`font-display font-light text-2xl sm:text-3xl md:text-4xl mb-2 tracking-wide ${
                isLight ? "text-white/80" : "text-charcoal-dark/80"
              }`}
            >
              {String(unit.value).padStart(2, "0")}
            </span>
            <span
              className={`font-sans text-xs sm:text-sm uppercase tracking-widest ${
                isLight ? "text-white/80" : "text-charcoal-dark/80"
              }`}
            >
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
