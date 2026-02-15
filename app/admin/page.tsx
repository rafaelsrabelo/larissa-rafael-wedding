"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, LogOut, Gift } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingBrand } from "@/components/admin/loading-brand";
import { authFetch, getToken, clearToken } from "@/lib/admin-api";

type GiftItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

const giftFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Preço deve ser não negativo"),
  imageUrl: z
    .string()
    .optional()
    .refine((v) => !v || v === "" || /^https?:\/\//.test(v), "URL inválida"),
});

type GiftFormValues = z.infer<typeof giftFormSchema>;

const emptyForm: GiftFormValues = {
  name: "",
  description: "",
  price: 0,
  imageUrl: "",
};

export default function AdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

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
    data: items = [],
    isLoading: itemsLoading,
    isError: itemsError,
  } = useQuery({
    queryKey: ["admin", "gifts"],
    queryFn: async () => {
      const r = await authFetch("/api/gifts");
      if (!r.ok) throw new Error("Failed to fetch");
      const data = await r.json();
      return Array.isArray(data) ? data as GiftItem[] : [];
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const form = useForm<GiftFormValues>({
    resolver: zodResolver(giftFormSchema),
    defaultValues: emptyForm,
  });

  const createMutation = useMutation({
    mutationFn: async (body: GiftFormValues) => {
      const r = await authFetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: body.name.trim(),
          description: body.description?.trim() || null,
          price: body.price,
          imageUrl: body.imageUrl?.trim() || null,
        }),
      });
      if (!r.ok) {
        const data = await r.json();
        throw new Error(data.error ?? "Erro ao criar");
      }
      return r.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "gifts"] });
      setDialogOpen(false);
      form.reset(emptyForm);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      body,
    }: { id: string; body: GiftFormValues }) => {
      const r = await authFetch(`/api/gifts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: body.name.trim(),
          description: body.description?.trim() || null,
          price: body.price,
          imageUrl: body.imageUrl?.trim() || null,
        }),
      });
      if (!r.ok) {
        const data = await r.json();
        throw new Error(data.error ?? "Erro ao atualizar");
      }
      return r.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "gifts"] });
      setDialogOpen(false);
      setEditingId(null);
      form.reset(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const r = await authFetch(`/api/gifts/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Erro ao excluir");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "gifts"] });
      setDeleteId(null);
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function openCreate() {
    setEditingId(null);
    form.reset(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(item: GiftItem) {
    setEditingId(item.id);
    form.reset({
      name: item.name,
      description: item.description ?? "",
      price: item.price,
      imageUrl: item.imageUrl ?? "",
    });
    setDialogOpen(true);
  }

  function onDialogSubmit(values: GiftFormValues) {
    if (editingId) {
      updateMutation.mutate({ id: editingId, body: values });
    } else {
      createMutation.mutate(values);
    }
  }

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

  if (itemsLoading && items.length === 0) {
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

  return (
    <div className="min-h-screen bg-warm-white">
      <header className="border-b border-charcoal/10 bg-warm-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-rose-earth" strokeWidth={1.5} />
            <h1 className="font-serif text-xl font-light text-charcoal-dark">
              Lista de presentes
            </h1>
          </div>
          <div className="flex items-center gap-3">
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
        <div className="flex justify-end mb-6">
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4" />
            Novo item
          </Button>
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Gift className="w-12 h-12 text-charcoal/30 mb-3" />
              <CardDescription className="mb-4">
                Nenhum item na lista ainda.
              </CardDescription>
              <Button variant="outline" onClick={openCreate}>
                Adicionar primeiro item
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  {item.imageUrl ? (
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-charcoal/5">
                      <Image
                        src={item.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-charcoal/5 flex items-center justify-center flex-shrink-0">
                      <Gift className="w-6 h-6 text-charcoal/30" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base truncate">
                      {item.name}
                    </CardTitle>
                    {item.description && (
                      <CardDescription className="truncate">
                        {item.description}
                      </CardDescription>
                    )}
                    <p className="font-sans text-sm text-rose-earth mt-0.5">
                      R$ {Number(item.price).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(item)}
                      aria-label="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(item.id)}
                      aria-label="Excluir"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ul>
        )}
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar item" : "Novo item"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onDialogSubmit)}
              className="space-y-4"
            >
              {(createMutation.isError || updateMutation.isError) && (
                <p className="text-sm text-red-600">
                  {(createMutation.error ?? updateMutation.error)?.message}
                </p>
              )}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        {...field}
                        disabled={isSaving}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da imagem</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://..."
                        {...field}
                        disabled={isSaving}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <LoadingBrand className="py-1" />
                  ) : (
                    "Salvar"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir item</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <LoadingBrand className="py-1" />
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
