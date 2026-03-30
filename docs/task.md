# Task: Integrar Stripe Checkout na Lista de Presentes

## Contexto

O site de casamento já possui um fluxo completo de lista de presentes:
- **`/presentes`** — catálogo público com cards/tabela, ordenação e botão "Adicionar ao carrinho"
- **`/carrinho`** — revisão dos itens selecionados com total calculado
- O botão "Finalizar seleção" está **desabilitado** com texto "(em breve)" (`app/carrinho/page.tsx:135`)

O objetivo é conectar esse botão ao Stripe Checkout para que os convidados paguem pelos presentes selecionados.

## Stack atual relevante

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Banco | PostgreSQL via Prisma 7 (`@prisma/adapter-pg`) |
| Estado do carrinho | React Context + localStorage (`contexts/cart-context.tsx`) |
| Formatação de preços | `lib/format-price.ts` (BRL, centavos como Float) |
| Auth admin | JWT via `lib/auth.ts` (jose + bcryptjs) |
| UI | shadcn/ui + Tailwind CSS 4 |

## Variáveis de ambiente necessárias

Adicionar ao `.env` (já está no `.gitignore`):

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...   # gerado pelo Stripe CLI ou Dashboard
```

## Etapas de implementação

### 1. Instalar dependências

```bash
npm install stripe @stripe/stripe-js
```

- `stripe` — SDK do servidor (API Routes)
- `@stripe/stripe-js` — loader do Stripe.js no cliente

### 2. Criar lib do Stripe

**`lib/stripe.ts`** — instância server-side do Stripe:

```ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil", // usar a versão mais recente disponível
  typescript: true,
});
```

### 3. Criar API Route para Checkout Session

**`app/api/checkout/route.ts`**

- Recebe via POST o array de itens do carrinho (`{ items: CartItem[] }`)
- Para cada item, cria um `line_item` com `price_data`:
  - `currency: "brl"`
  - `unit_amount`: preço em **centavos** (o banco armazena como Float em reais, então multiplicar por 100 e arredondar)
  - `product_data.name`: nome do presente
  - `product_data.description`: descrição (se houver)
  - `product_data.images`: array com `imageUrl` (se houver)
- `mode: "payment"`
- `success_url`: `${origin}/carrinho/sucesso?session_id={CHECKOUT_SESSION_ID}`
- `cancel_url`: `${origin}/carrinho`
- Retorna `{ url: session.url }` para redirect no cliente

**Atenção**: converter preço de Float (R$) para inteiro em centavos:
```ts
unit_amount: Math.round(item.price * 100)
```

### 4. Conectar o botão "Finalizar" ao Checkout

**`app/carrinho/page.tsx`**

- Remover o `disabled` e o `title="Em breve"` do botão "Finalizar seleção"
- Ao clicar:
  1. Fazer POST para `/api/checkout` com os itens do carrinho
  2. Receber a `url` da Checkout Session
  3. Redirecionar com `window.location.href = url`
- Mostrar loading no botão durante a requisição
- Tratar erros com toast (sonner)

### 5. Criar página de sucesso

**`app/carrinho/sucesso/page.tsx`**

- Página de confirmação pós-pagamento
- Usar `searchParams.session_id` para buscar detalhes da session (opcional)
- Limpar o carrinho (`clearCart()` do contexto)
- Exibir mensagem de agradecimento seguindo o design minimalista do site
- Botão para voltar à página principal

### 6. Criar Webhook do Stripe

**`app/api/webhook/stripe/route.ts`**

- Receber eventos do Stripe (principalmente `checkout.session.completed`)
- Validar assinatura com `STRIPE_WEBHOOK_SECRET`
- **Importante**: usar `request.text()` (não `.json()`) para validar o raw body
- Ao receber `checkout.session.completed`:
  - Registrar o pagamento no banco (ver etapa 7)
  - Logar o evento para auditoria

**Config do Next.js**: a rota de webhook não deve fazer parse automático do body. No App Router do Next.js 16, `request.text()` já funciona sem config extra.

### 7. Criar modelo de Order no Prisma

Adicionar ao `prisma/schema.prisma`:

```prisma
model Order {
  id                String      @id @default(cuid())
  stripeSessionId   String      @unique
  stripePaymentId   String?
  customerName      String?
  customerEmail     String?
  totalAmount       Float       // valor total em reais
  status            String      @default("pending") // pending, paid, failed
  items             OrderItem[]
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
}

model OrderItem {
  id         String  @id @default(cuid())
  orderId    String
  order      Order   @relation(fields: [orderId], references: [id])
  giftItemId String
  giftItem   GiftItem @relation(fields: [giftItemId], references: [id])
  name       String  // snapshot do nome no momento da compra
  price      Float   // snapshot do preço no momento da compra
}
```

Adicionar relação inversa no `GiftItem`:
```prisma
model GiftItem {
  // ... campos existentes
  orderItems OrderItem[]
}
```

Depois rodar:
```bash
npx prisma db push
```

### 8. Registrar Order no fluxo

- **Na criação do Checkout Session** (`app/api/checkout/route.ts`): criar a `Order` com status `"pending"` e os `OrderItem` associados, salvando o `stripeSessionId`
- **No webhook** (`checkout.session.completed`): atualizar a Order para status `"paid"` e salvar `stripePaymentId`, `customerEmail`, `customerName`

### 9. Painel admin — visualizar pedidos

**`app/admin/pedidos/page.tsx`**

- Listar Orders com status, data, total e itens
- Acessível via link no header do admin (ao lado de "Confirmados")
- Rota API: `app/api/orders/route.ts` (GET, admin-only com JWT)

### 10. Testar localmente com Stripe CLI

```bash
# Instalar Stripe CLI (macOS)
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Escutar webhooks e encaminhar para o servidor local
stripe listen --forward-to localhost:3000/api/webhook/stripe

# Copiar o webhook signing secret (whsec_...) para .env
```

Usar cartão de teste: `4242 4242 4242 4242`, qualquer data futura, qualquer CVC.

## Arquivos a criar/modificar

| Ação | Arquivo |
|------|---------|
| Criar | `lib/stripe.ts` |
| Criar | `app/api/checkout/route.ts` |
| Criar | `app/api/webhook/stripe/route.ts` |
| Criar | `app/api/orders/route.ts` |
| Criar | `app/carrinho/sucesso/page.tsx` |
| Criar | `app/admin/pedidos/page.tsx` |
| Modificar | `app/carrinho/page.tsx` — ativar botão de finalizar |
| Modificar | `prisma/schema.prisma` — adicionar Order e OrderItem |
| Modificar | `app/admin/page.tsx` — adicionar link para pedidos no header |
| Modificar | `.env` — adicionar chaves do Stripe |

## Considerações

- **Preços em centavos**: o Stripe trabalha com inteiros (centavos). O banco armazena Float em reais. Sempre usar `Math.round(price * 100)` na conversão.
- **Idempotência**: o webhook pode ser chamado mais de uma vez. Usar `stripeSessionId` como chave única para evitar duplicatas.
- **Sem estoque**: presentes são contribuições, não itens físicos. Múltiplos convidados podem "comprar" o mesmo presente. Não precisa de controle de estoque.
- **Moeda**: sempre `"brl"` no Stripe.
- **Metadata**: enviar IDs dos gift items como metadata na session para rastreabilidade.
