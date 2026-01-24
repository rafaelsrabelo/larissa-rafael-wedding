"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown() {
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

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <h2 className="font-serif font-light text-3xl sm:text-4xl text-center text-charcoal/80">
        Contagem Regressiva
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {timeUnits.map((unit, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-6 sm:p-8 border border-charcoal/10 bg-warm-white/50 transition-all hover:border-rose-earth/30"
          >
            <span className="font-serif font-light text-4xl sm:text-5xl md:text-6xl text-charcoal mb-2">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="font-sans text-xs sm:text-sm uppercase tracking-widest text-charcoal/60">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
