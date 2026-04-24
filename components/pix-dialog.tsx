"use client";

import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { generatePixPayload, weddingPix } from "@/lib/pix";
import { toast } from "sonner";

export function PixDialog({ triggerLabel }: { triggerLabel: string }) {
  const [copied, setCopied] = useState(false);
  const payload = useMemo(() => generatePixPayload(weddingPix), []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Não foi possível copiar. Selecione manualmente.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-block font-sans text-xs uppercase tracking-widest text-charcoal-dark border-b border-charcoal/20 hover:border-rose-earth hover:text-rose-earth transition-colors pb-1 cursor-pointer"
        >
          {triggerLabel}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>PIX para presentear</DialogTitle>
          <DialogDescription>
            Escaneie o QR code com o app do seu banco ou copie o código abaixo.
            O valor é livre — você escolhe quanto presentear.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-4">
          <div className="rounded-lg bg-white p-4 border border-charcoal/10">
            <QRCodeSVG value={payload} size={220} level="M" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-sm font-sans">
            <span className="text-charcoal/60">Chave (CPF)</span>
            <span className="col-span-2 font-medium text-charcoal-dark">
              068.179.963-33
            </span>
            <span className="text-charcoal/60">Favorecido</span>
            <span className="col-span-2 font-medium text-charcoal-dark">
              Larissa Garcia Freire
            </span>
            <span className="text-charcoal/60">Banco</span>
            <span className="col-span-2 text-charcoal-dark">
              Bradesco
            </span>
          </div>

          <div className="space-y-2">
            <p className="font-sans text-xs uppercase tracking-widest text-charcoal/50">
              PIX copia e cola
            </p>
            <div className="rounded-md border border-charcoal/10 bg-charcoal/[0.02] p-3 max-h-24 overflow-y-auto">
              <code className="font-mono text-[11px] break-all text-charcoal/70 leading-relaxed">
                {payload}
              </code>
            </div>
          </div>

          <Button
            onClick={handleCopy}
            className="w-full"
            variant={copied ? "outline" : "default"}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" strokeWidth={1.5} />
                Copiado
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" strokeWidth={1.5} />
                Copiar código PIX
              </>
            )}
          </Button>

          <p className="font-sans text-xs text-charcoal/50 text-center pt-2">
            Após o pagamento, se quiser, envie o comprovante para nos avisar.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
