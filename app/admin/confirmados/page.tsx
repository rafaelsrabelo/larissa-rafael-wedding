"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, UserCheck, Users, UserX, Mail, Phone, MessageCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingBrand } from "@/components/admin/loading-brand";
import { authFetch, getToken, clearToken } from "@/lib/admin-api";
import { cn } from "@/lib/utils";

type RsvpItem = {
  id: string;
  fullName: string;
  willAttend: boolean;
  extraAdultNames: string[];
  childNames: string[];
  email: string;
  phone: string;
  message: string | null;
  acceptedTerms: boolean;
  createdAt: string;
};

type Filter = "all" | "attending" | "not-attending";

export default function AdminConfirmadosPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    setMounted(true);
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
    data: list = [],
    isLoading,
    isError: listError,
  } = useQuery({
    queryKey: ["admin", "rsvp"],
    queryFn: async () => {
      const r = await authFetch("/api/rsvp");
      if (!r.ok) throw new Error("Failed to fetch");
      const data = await r.json();
      return Array.isArray(data) ? (data as RsvpItem[]) : [];
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

  const attending = useMemo(() => list.filter((r) => r.willAttend), [list]);
  const notAttending = useMemo(() => list.filter((r) => !r.willAttend), [list]);

  const totalGuests = useMemo(() => {
    return attending.reduce(
      (sum, r) => sum + 1 + r.extraAdultNames.length + r.childNames.length,
      0
    );
  }, [attending]);

  const filteredList = useMemo(() => {
    if (filter === "attending") return attending;
    if (filter === "not-attending") return notAttending;
    return list;
  }, [list, attending, notAttending, filter]);

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
            <UserCheck className="w-6 h-6 text-rose-earth" strokeWidth={1.5} />
            <h1 className="font-serif text-xl font-light text-charcoal-dark">
              Confirmações
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

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Resumo */}
        {!isLoading && list.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-charcoal/5">
              <CardContent className="p-4 text-center">
                <p className="font-serif text-2xl font-light text-charcoal-dark">
                  {attending.length}
                </p>
                <p className="font-sans text-xs text-charcoal/50 mt-1">
                  Confirmados
                </p>
              </CardContent>
            </Card>
            <Card className="border-charcoal/5">
              <CardContent className="p-4 text-center">
                <p className="font-serif text-2xl font-light text-charcoal-dark">
                  {totalGuests}
                </p>
                <p className="font-sans text-xs text-charcoal/50 mt-1">
                  Total de pessoas
                </p>
              </CardContent>
            </Card>
            <Card className="border-charcoal/5">
              <CardContent className="p-4 text-center">
                <p className="font-serif text-2xl font-light text-charcoal-dark">
                  {notAttending.length}
                </p>
                <p className="font-sans text-xs text-charcoal/50 mt-1">
                  Não vão
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtros */}
        <div className="flex items-center gap-2">
          <div
            className="inline-flex rounded-lg border border-charcoal/10 bg-warm-white p-0.5"
            role="tablist"
          >
            {([
              { key: "all" as const, label: "Todos", count: list.length },
              { key: "attending" as const, label: "Confirmados", count: attending.length },
              { key: "not-attending" as const, label: "Não vão", count: notAttending.length },
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

        {/* Lista */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : listError ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CardDescription>
                Erro ao carregar. Tente novamente.
              </CardDescription>
            </CardContent>
          </Card>
        ) : filteredList.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="w-12 h-12 text-charcoal/20 mb-3" strokeWidth={1} />
              <CardDescription>
                {filter === "all"
                  ? "Nenhuma confirmação ainda."
                  : filter === "attending"
                    ? "Nenhum confirmado ainda."
                    : "Ninguém recusou ainda."}
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <ul className="space-y-3">
            {filteredList.map((r) => {
              const guestCount = 1 + r.extraAdultNames.length + r.childNames.length;
              return (
                <Card key={r.id} className="border-charcoal/5">
                  <CardContent className="p-5 space-y-3">
                    {/* Nome + badge */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                            r.willAttend
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-charcoal/5 text-charcoal/40"
                          )}
                        >
                          {r.willAttend ? (
                            <UserCheck className="w-4 h-4" strokeWidth={1.5} />
                          ) : (
                            <UserX className="w-4 h-4" strokeWidth={1.5} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-serif text-base font-light text-charcoal-dark truncate">
                            {r.fullName}
                          </p>
                          {r.willAttend && guestCount > 1 && (
                            <p className="font-sans text-xs text-charcoal/50">
                              {guestCount} {guestCount === 1 ? "pessoa" : "pessoas"} no total
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          r.willAttend
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-charcoal/5 text-charcoal/50"
                        )}
                      >
                        {r.willAttend ? "Confirmado" : "Não vai"}
                      </span>
                    </div>

                    {/* Contato */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-sans text-charcoal/50">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="w-3 h-3" strokeWidth={1.5} />
                        {r.email}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3 h-3" strokeWidth={1.5} />
                        {r.phone}
                      </span>
                    </div>

                    {/* Acompanhantes */}
                    {r.willAttend && (r.extraAdultNames.length > 0 || r.childNames.length > 0) && (
                      <div className="flex flex-wrap gap-1.5">
                        {r.extraAdultNames.map((name) => (
                          <span
                            key={name}
                            className="inline-flex items-center gap-1 rounded-md bg-charcoal/5 px-2 py-0.5 text-xs font-sans text-charcoal/70"
                          >
                            <Users className="w-3 h-3" strokeWidth={1.5} />
                            {name}
                          </span>
                        ))}
                        {r.childNames.map((name) => (
                          <span
                            key={name}
                            className="inline-flex items-center gap-1 rounded-md bg-charcoal/5 px-2 py-0.5 text-xs font-sans text-charcoal/70"
                          >
                            {name}
                            <span className="text-[10px] text-charcoal/40">(criança)</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Recado */}
                    {r.message && (
                      <div className="flex gap-2 pt-2 border-t border-charcoal/5">
                        <MessageCircle className="w-3.5 h-3.5 text-charcoal/30 shrink-0 mt-0.5" strokeWidth={1.5} />
                        <p className="font-sans text-sm text-charcoal/60 italic leading-relaxed">
                          {r.message}
                        </p>
                      </div>
                    )}

                    {/* Data */}
                    <p className="font-sans text-[11px] text-charcoal/30">
                      {new Date(r.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
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
