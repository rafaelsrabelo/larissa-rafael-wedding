"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingBrand } from "@/components/admin/loading-brand";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => {
      if (r.ok) {
        router.replace("/admin");
        router.refresh();
      }
    });
  }, [router]);

  async function onSubmit(values: LoginForm) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Erro ao fazer login.");
        return;
      }
      if (data.token) {
        localStorage.setItem("admin_token", data.token);
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setSubmitError("Erro de conexão. Tente novamente.");
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block relative w-1/2 min-h-screen">
        <Image
          src="/DSC00142.jpg"
          alt="Larissa e Rafael"
          fill
          className="object-cover"
          style={{ objectPosition: "50% 65%" }}
          priority
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-black/30" aria-hidden />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <p className="font-serif text-2xl sm:text-3xl text-white/90 text-center max-w-md">
            Área administrativa
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 bg-warm-white">
        <Card className="border-charcoal/10 max-w-sm mx-auto w-full">
          <CardHeader>
            <CardTitle className="font-serif">Entrar</CardTitle>
            <CardDescription>
              Use seu email e senha para acessar o painel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {submitError && (
                  <Alert variant="destructive">
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          placeholder="seu@email.com"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            disabled={isSubmitting}
                            className="pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 text-charcoal/50 hover:text-charcoal"
                            onClick={() => setShowPassword((v) => !v)}
                            tabIndex={-1}
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <LoadingBrand className="py-1" />
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </Form>
            <p className="mt-6 font-sans text-xs text-charcoal/50 text-center">
              Acesso restrito aos noivos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
