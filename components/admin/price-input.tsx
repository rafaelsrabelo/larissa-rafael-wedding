"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  formatPriceForInput,
  parsePrice,
  maskPriceInput,
} from "@/lib/format-price";

type PriceInputProps = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

export function PriceInput({
  value,
  onChange,
  disabled,
  placeholder = "0,00",
  className,
}: PriceInputProps) {
  const [display, setDisplay] = useState(() => formatPriceForInput(value));

  useEffect(() => {
    setDisplay(formatPriceForInput(value));
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const masked = maskPriceInput(raw);
    setDisplay(masked);
    const num = parsePrice(masked);
    onChange(num);
  }

  function handleBlur() {
    setDisplay(formatPriceForInput(value));
  }

  return (
    <Input
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={display}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
      placeholder={placeholder}
      className={className}
    />
  );
}
