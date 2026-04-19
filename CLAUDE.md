# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wedding website for Larissa & Rafael (June 13, 2026). Built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui (new-york style), and Prisma 7 with PostgreSQL.

Language: Portuguese (pt-BR). All UI text, labels, error messages, and user-facing content must be in Brazilian Portuguese.

## Commands

```bash
npm run dev          # Next.js dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run db:push      # Push Prisma schema to database
npm run db:seed      # Seed admin users (npx tsx prisma/seed.ts)
npm run db:setup     # db:push + db:seed (first-time setup)
```

## Environment Variables

Required in `.env`:
- `DATABASE_URL` — PostgreSQL connection string (e.g., `postgresql://postgres:postgres@localhost:5432/wedding`)
- `JWT_SECRET` — Secret for JWT token signing
- `MP_ACCESS_TOKEN` — Mercado Pago access token (use test token `APP_USR-...` in dev, production token in prod)
- `MP_WEBHOOK_SECRET` — Mercado Pago webhook secret for HMAC signature validation (optional in dev, recommended in prod)
- `NEXT_PUBLIC_MP_PUBLIC_KEY` — Mercado Pago public key (opcional; usada apenas se integrar Bricks no futuro)

## Architecture

### Public Site (`app/page.tsx`)
Single-page layout composed of section components: Navbar, Hero, Countdown, OurStory, Details, Gifts, RSVP. All rendered from `components/`.

### Gift Registry (`/presentes`)
Public gift list with cart functionality. Cart state managed via React Context (`contexts/cart-context.tsx`) with localStorage persistence. Checkout page at `/carrinho`.

### Admin Area (`/admin`)
JWT-authenticated admin panel for managing gift items and viewing RSVP confirmations. Auth flow: login at `/admin/login`, token stored client-side, API calls via `lib/admin-api.ts` (`authFetch` helper). Admin provider wraps with TanStack Query (`app/admin/providers.tsx`).

### API Routes
- `app/api/auth/login/` — Admin login (returns JWT)
- `app/api/auth/me/` — Verify current admin session
- `app/api/gifts/` — GET (public), POST (admin-only)
- `app/api/gifts/[id]/` — PUT/DELETE (admin-only)
- `app/api/rsvp/` — GET (admin-only), POST (public)
- `app/api/checkout/` — POST (public) cria Mercado Pago Preference e retorna `init_point`
- `app/api/webhook/mercadopago/` — POST (público) recebe notificações de pagamento do MP e atualiza o status da Order
- `app/api/orders/` — GET (admin-only) lista pedidos com items

All admin-protected routes check Bearer token via `lib/auth.ts` (`getBearerToken` + `verifyToken`).

### Database (Prisma)
Five models: `Admin` (login credentials), `GiftItem` (registry items), `Order` + `OrderItem` (pedidos de presentes com `mpPreferenceId`/`mpPaymentId` do Mercado Pago), `Rsvp` (attendance confirmations with guest names). Schema at `prisma/schema.prisma`. Uses `@prisma/adapter-pg` for PostgreSQL connection (`lib/db.ts`).

### Pagamentos (Mercado Pago Checkout Pro)
- SDK: `mercadopago` (client em `lib/mercadopago.ts`)
- Fluxo: `/carrinho` → POST `/api/checkout` → cria `Preference` → redirect para `init_point` → pagamento no ambiente MP → redirect para `/carrinho/sucesso` + notificação para `/api/webhook/mercadopago`
- Status da Order: `pending` (aguardando/PIX/boleto), `paid` (approved), `failed` (rejected/cancelled/refunded)
- O `external_reference` da preferência guarda o ID da Order para o webhook vincular

## Design System

- **Fonts**: Cormorant Garamond (serif, `--font-serif`), Inter (sans, `--font-sans`), Noto Sans TC (display, `--font-display`)
- **Colors**: warm-white, charcoal/charcoal-dark, sand, rose-earth (defined in `app/globals.css` as oklch values)
- **Style**: Minimalist, clean, mobile-first. shadcn/ui components in `components/ui/`
- **Icons**: Lucide React

## Key Patterns

- Forms use React Hook Form + Zod schemas + shadcn Form components
- Server state managed with TanStack React Query (admin area)
- Prices stored as `Float` in DB, formatted with `lib/format-price.ts`
- Path aliases: `@/` maps to project root
