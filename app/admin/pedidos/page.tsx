"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Package, Gift } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingBrand } from "@/components/admin/loading-brand";
import { authFetch, getToken, clearToken } from "@/lib/admin-api";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  giftItemId: string;
};

type Order = {
  id: string;
  mpPreferenceId: string;
  mpPaymentId: string | null;
  customerName: string | null;
  customerEmail: string | null;
  totalAmount: number;
  status: string;
  items: OrderItem[];
  createdAt: string;
};

const statusLabel: Record<string, { text: string; className: string }> = {
  paid: { text: "Pago", className: "bg-emerald-100 text-emerald-800" },
  pending: { text: "Pendente", className: "bg-yellow-100 text-yellow-800" },
  failed: { text: "Falhou", className: "bg-red-100 text-red-800" },
};

type StatusFilter = "all" | "paid" | "pending";

export default function PedidosPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    setMounted(true);
    localStorage.setItem("admin_pedidos_last_seen", String(Date.now()));
  }, []);

  const { data: me, isSuccess: meSuccess, isError: meError } = useQuery({
    queryKey: ["admin", "me"],
    queryFn: async () => {
      const r = await authFetch("/api/auth/me");
      if (!r.ok) throw new Error("Unauthorized");
      return r.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: orders = [],
    isLoading,
  } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const r = await authFetch("/api/orders");
      if (!r.ok) throw new Error("Failed to fetch");
      const data = await r.json();
      return Array.isArray(data) ? (data as Order[]) : [];
    },
    enabled: meSuccess,
  });

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    if (meError) {
      clearToken();
      router.replace("/admin/login");
    }
  }, [meError, router]);

  const paidCount = useMemo(() => orders.filter((o) => o.status === "paid").length, [orders]);
  const pendingCount = useMemo(() => orders.filter((o) => o.status === "pending").length, [orders]);

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  if (!mounted || !getToken()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white">
        <LoadingBrand />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <header className="border-b border-charcoal/10 bg-warm-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-rose-earth" strokeWidth={1.5} />
            <h1 className="font-serif text-xl font-light text-charcoal-dark">
              Pedidos
            </h1>
          </div>
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="flex items-center gap-2 mb-6">
          <div
            className="inline-flex rounded-lg border border-charcoal/10 bg-warm-white p-0.5"
            role="tablist"
          >
            {([
              { key: "all" as const, label: "Todos", count: orders.length },
              { key: "paid" as const, label: "Pagos", count: paidCount },
              { key: "pending" as const, label: "Pendentes", count: pendingCount },
            ]).map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={filter === tab.key}
                onClick={() => setFilter(tab.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-sans transition-colors",
                  filter === tab.key
                    ? "bg-charcoal-dark text-warm-white"
                    : "text-charcoal/70 hover:text-charcoal-dark"
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-medium",
                    filter === tab.key
                      ? "bg-warm-white/20 text-warm-white"
                      : "bg-charcoal/10 text-charcoal/60"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="w-12 h-12 text-charcoal/30 mb-3" />
              <CardDescription>
                {filter === "all"
                  ? "Nenhum pedido ainda."
                  : filter === "paid"
                    ? "Nenhum pedido pago."
                    : "Nenhum pedido pendente."}
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <ul className="space-y-4">
            {filteredOrders.map((order) => {
              const st = statusLabel[order.status] ?? {
                text: order.status,
                className: "bg-gray-100 text-gray-800",
              };
              return (
                <Card key={order.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${st.className}`}
                        >
                          {st.text}
                        </span>
                        <CardTitle className="text-base truncate">
                          {order.customerName ?? "Convidado anônimo"}
                        </CardTitle>
                      </div>
                      <p className="font-sans text-sm text-rose-earth font-medium whitespace-nowrap">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>

                    {order.customerEmail && (
                      <p className="font-sans text-xs text-charcoal/50">
                        {order.customerEmail}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item) => (
                        <span
                          key={item.id}
                          className="inline-flex items-center gap-1.5 rounded-md bg-charcoal/5 px-2.5 py-1 text-xs font-sans text-charcoal/70"
                        >
                          <Gift className="w-3 h-3" strokeWidth={1.5} />
                          {item.name} — {formatPrice(item.price)}
                        </span>
                      ))}
                    </div>

                    <p className="font-sans text-xs text-charcoal/40">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
