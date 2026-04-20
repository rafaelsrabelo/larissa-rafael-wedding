import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const alt = "Larissa & Rafael · 13 de junho de 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoBuffer = await readFile(
    path.join(process.cwd(), "public/logo-monogram.png")
  );
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f5f1ea",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt=""
          width={240}
          height={240}
          style={{ marginBottom: 24 }}
        />
        <div
          style={{
            fontSize: 84,
            fontWeight: 300,
            color: "#2b2b2b",
            letterSpacing: "-0.02em",
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          Larissa & Rafael
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginTop: 32,
          }}
        >
          <div style={{ width: 60, height: 1, background: "#b78d82" }} />
          <div
            style={{
              fontSize: 32,
              color: "#b78d82",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            13 · 06 · 2026
          </div>
          <div style={{ width: 60, height: 1, background: "#b78d82" }} />
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#8a8a8a",
            marginTop: 40,
            letterSpacing: "0.05em",
          }}
        >
          Celebre conosco o nosso casamento
        </div>
      </div>
    ),
    { ...size }
  );
}
