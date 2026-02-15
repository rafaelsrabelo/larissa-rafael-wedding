/**
 * Formata preço para exibição no padrão brasileiro: R$ 1.234,56
 */
export function formatPrice(value: number): string {
  if (Number.isNaN(value) || value < 0) return "R$ 0,00";
  const [intPart, decPart] = value.toFixed(2).split(".");
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${intFormatted},${decPart}`;
}

/**
 * Formata para uso em input (sem "R$ "): 1.234,56
 */
export function formatPriceForInput(value: number): string {
  if (Number.isNaN(value) || value < 0) return "0,00";
  const [intPart, decPart] = value.toFixed(2).split(".");
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${intFormatted},${decPart}`;
}

/**
 * Converte string no formato BR (1.234,56 ou 1234,56) para número
 */
export function parsePrice(input: string): number {
  if (!input || typeof input !== "string") return 0;
  const cleaned = input.trim().replace(/\s/g, "");
  const noDots = cleaned.replace(/\./g, "");
  const withDot = noDots.replace(",", ".");
  const n = parseFloat(withDot);
  return Number.isNaN(n) ? 0 : Math.max(0, n);
}

/**
 * Limpa o valor digitado deixando apenas dígitos e uma vírgula decimal
 */
export function cleanPriceInput(raw: string): string {
  const hasComma = raw.includes(",");
  const digitsAndComma = raw.replace(/[^\d,]/g, "");
  const parts = digitsAndComma.split(",");
  if (parts.length === 0) return "";
  if (parts.length === 1) return hasComma ? `${parts[0]},` : parts[0];
  const intPart = parts[0];
  const decPart = parts.slice(1).join("").slice(0, 2);
  return `${intPart},${decPart}`;
}

/**
 * Aplica máscara de milhar no valor (ex: 1234,5 -> 1.234,5)
 */
export function maskPriceInput(raw: string): string {
  const cleaned = cleanPriceInput(raw);
  if (!cleaned) return "";
  const [intPart, decPart] = cleaned.split(",");
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return decPart !== undefined ? `${intFormatted},${decPart}` : intFormatted;
}
