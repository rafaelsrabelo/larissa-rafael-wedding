"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { LogOut, UserCheck, Gift } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingBrand } from "@/components/admin/loading-brand";
import { authFetch, getToken, clearToken } from "@/lib/admin-api";

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

export default function AdminConfirmadosPage() {
  const router = useRouter();

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
    isLoading: listLoading,
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
      return;
    }
  }, [router]);

  useEffect(() => {
    if (meError) {
      clearToken();
      router.replace("/admin/login");
    }
  }, [meError, router]);

  function logout() {
    clearToken();
    router.replace("/admin/login");
    router.refresh();
  }

  if (!getToken() || (meSuccess === false && !meError)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white">
        <LoadingBrand />
      </div>
    );
  }

  if (listLoading && list.length === 0) {
    return (
      <div className="min-h-screen bg-warm-white p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  const confirmados = list.filter((r) => r.willAttend);
  const naoConfirmados = list.filter((r) => !r.willAttend);

  return (
    <div className="min-h-screen bg-warm-white">
      <header className="border-b border-charcoal/10 bg-warm-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-rose-earth" strokeWidth={1.5} />
            <h1 className="font-serif text-xl font-light text-charcoal-dark">
              Confirmados
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <Gift className="w-4 h-4 mr-1.5" />
                Lista de presentes
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                Ver site
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-1.5" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {listError ? (
          <Card>
            <CardContent className="py-8 text-center">
              <CardDescription>
                Erro ao carregar as confirmações. Tente novamente.
              </CardDescription>
            </CardContent>
          </Card>
        ) : list.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <UserCheck className="w-12 h-12 text-charcoal/30 mb-3" />
              <CardDescription className="mb-4">
                Nenhuma confirmação de presença ainda.
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="font-sans text-sm font-medium uppercase tracking-widest text-charcoal/70 mb-4">
                Confirmados ({confirmados.length})
              </h2>
              <ul className="space-y-4">
                {confirmados.map((r) => (
                  <Card key={r.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        {r.fullName}
                        <span className="font-sans text-xs font-normal normal-case tracking-normal text-green-600 bg-green-50 px-2 py-0.5 rounded">
                          Vai
                        </span>
                      </CardTitle>
                      <CardDescription className="font-sans text-sm">
                        {r.email} · {r.phone}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm text-charcoal/80">
                      {r.extraAdultNames.length > 0 && (
                        <p>
                          <span className="text-charcoal/60">Acompanhantes (adultos):</span>{" "}
                          {r.extraAdultNames.join(", ")}
                        </p>
                      )}
                      {r.childNames.length > 0 && (
                        <p>
                          <span className="text-charcoal/60">Crianças:</span>{" "}
                          {r.childNames.join(", ")}
                        </p>
                      )}
                      {r.message && (
                        <p className="pt-2 border-t border-charcoal/10">
                          <span className="text-charcoal/60">Recado:</span> {r.message}
                        </p>
                      )}
                      <p className="text-charcoal/50 text-xs pt-1">
                        Confirmado em{" "}
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
                ))}
              </ul>
            </div>

            {naoConfirmados.length > 0 && (
              <div>
                <h2 className="font-sans text-sm font-medium uppercase tracking-widest text-charcoal/70 mb-4">
                  Não vão ({naoConfirmados.length})
                </h2>
                <ul className="space-y-4">
                  {naoConfirmados.map((r) => (
                    <Card key={r.id} className="border-charcoal/10">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          {r.fullName}
                          <span className="font-sans text-xs font-normal normal-case tracking-normal text-charcoal/50 bg-charcoal/5 px-2 py-0.5 rounded">
                            Não vai
                          </span>
                        </CardTitle>
                        <CardDescription className="font-sans text-sm">
                          {r.email} · {r.phone}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm text-charcoal/60">
                        {r.message && (
                          <p>
                            <span className="text-charcoal/50">Recado:</span> {r.message}
                          </p>
                        )}
                        <p className="text-charcoal/50 text-xs pt-1">
                          Resposta em{" "}
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
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
