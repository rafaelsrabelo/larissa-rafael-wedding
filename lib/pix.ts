type PixPayloadInput = {
  key: string;
  name: string;
  city: string;
  amount?: number;
  txid?: string;
};

function field(id: string, value: string): string {
  const length = value.length.toString().padStart(2, "0");
  return `${id}${length}${value}`;
}

function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function sanitize(value: string, maxLength: number): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .toUpperCase()
    .trim()
    .slice(0, maxLength);
}

export function generatePixPayload({
  key,
  name,
  city,
  amount,
  txid = "***",
}: PixPayloadInput): string {
  const merchantAccountInfo = field(
    "26",
    field("00", "br.gov.bcb.pix") + field("01", key)
  );

  const parts = [
    field("00", "01"),
    field("01", "11"),
    merchantAccountInfo,
    field("52", "0000"),
    field("53", "986"),
    ...(amount && amount > 0 ? [field("54", amount.toFixed(2))] : []),
    field("58", "BR"),
    field("59", sanitize(name, 25)),
    field("60", sanitize(city, 15)),
    field("62", field("05", txid)),
  ];

  const payloadWithoutCrc = parts.join("") + "6304";
  return payloadWithoutCrc + crc16(payloadWithoutCrc);
}

export const weddingPix = {
  key: "06817996333",
  name: "Larissa Garcia Freire",
  city: "FORTALEZA",
} as const;
