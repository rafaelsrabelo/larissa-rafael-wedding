# Task: Migrar pagamentos de Stripe para Mercado Pago

## Contexto

O site de casamento já possui integração completa com Stripe Checkout para pagamento de presentes. Porém, o Stripe apresenta limitações para pagamentos no Brasil — PIX exige configuração extra e a experiência de parcelamento no cartão não é ideal para o público brasileiro.

O Mercado Pago resolve esses problemas nativamente com o **Checkout Pro**, que oferece PIX, boleto e parcelamento no cartão com uma UX familiar ao usuário brasileiro.

## Integração atual (Stripe)

| Arquivo | Função |
|---------|--------|
| `lib/stripe.ts` | Instância server-side do Stripe SDK |
| `app/api/checkout/route.ts` | Criação de Checkout Session |
| `app/api/webhook/stripe/route.ts` | Webhook `checkout.session.completed` |
| `app/api/orders/route.ts` | API admin para listar pedidos |
| `app/carrinho/page.tsx` | Página do carrinho (dispara checkout) |
| `app/carrinho/sucesso/page.tsx` | Página de confirmação pós-pagamento |
| `app/admin/pedidos/page.tsx` | Painel admin de pedidos |
| `prisma/schema.prisma` | Models Order e OrderItem (campos `stripeSessionId`, `stripePaymentId`) |

Dependências npm: `stripe`, `@stripe/stripe-js`

## Variáveis de ambiente

### Remover

```env
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

### Adicionar

```env
MP_ACCESS_TOKEN=APP_USR-...         # Token de produção do Mercado Pago
MP_WEBHOOK_SECRET=...               # Secret para validação HMAC (opcional, mas recomendado)
```

Credenciais obtidas em: Mercado Pago Developers → Suas integrações → Credenciais de produção.

---

## Etapas de implementação

### 1. Trocar dependências npm

```bash
npm uninstall stripe @stripe/stripe-js
npm install mercadopago
```

- `mercadopago` — SDK oficial v2+ (server-side, compatível com Node/Next.js)

---

### 2. Criar `lib/mercadopago.ts` (substitui `lib/stripe.ts`)

Instância do client Mercado Pago:

```ts
import { MercadoPagoConfig } from "mercadopago";

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});
```

Depois: **deletar** `lib/stripe.ts`.

---

### 3. Reescrever `app/api/checkout/route.ts`

Substituir `stripe.checkout.sessions.create()` por `new Preference(mpClient).create()`.

Mapeamento de campos:

| Stripe | Mercado Pago |
|--------|--------------|
| `line_items[].price_data.unit_amount` (centavos) | `items[].unit_price` (reais, Float) |
| `line_items[].price_data.product_data.name` | `items[].title` |
| `line_items[].quantity` | `items[].quantity` |
| `success_url` | `back_urls.success` |
| `cancel_url` | `back_urls.failure` |
| `mode: "payment"` | Não necessário (padrão) |
| `payment_method_types: ["card"]` | Não necessário (PIX, cartão, boleto habilitados por padrão) |
| `metadata` | `metadata` ou `external_reference` |

Pontos de atenção:
- **Preço em reais** (Float), não centavos — o MP já trabalha com reais
- Configurar `payment_methods.installments` para definir máximo de parcelas
- Configurar `auto_return: "approved"` para redirect automático após pagamento aprovado
- Usar `external_reference` com o ID da Order para vincular no webhook
- Criar Order no banco com status `"pending"` (mesma lógica atual)
- Salvar `mpPreferenceId` no lugar de `stripeSessionId`
- Retornar `{ url: preference.init_point }` para redirect no cliente

---

### 4. Reescrever webhook: `app/api/webhook/stripe/route.ts` → `app/api/webhook/mercadopago/route.ts`

O Mercado Pago envia notificações (IPN/Webhooks) com estrutura diferente do Stripe.

Fluxo:
1. Receber POST com `{ action, data: { id } }` ou query params `?topic=payment&id=123`
2. Validar assinatura HMAC via header `x-signature` (se `MP_WEBHOOK_SECRET` configurado)
3. Buscar dados do pagamento: `new Payment(mpClient).get({ id: data.id })`
4. Verificar `payment.status`:
   - `"approved"` → atualizar Order para status `"paid"`
   - `"pending"` / `"in_process"` → manter `"pending"` (PIX aguardando, boleto emitido)
   - `"rejected"` → atualizar para `"failed"`
5. Salvar `mpPaymentId` (ID do pagamento) na Order
6. Vincular via `external_reference` (ID da Order salvo na criação da preferência)

Depois: **deletar** `app/api/webhook/stripe/route.ts`.

---

### 5. Atualizar `prisma/schema.prisma`

Renomear campos Stripe para Mercado Pago:

```prisma
model Order {
  id                String      @id @default(cuid())
  mpPreferenceId    String      @unique    // era stripeSessionId
  mpPaymentId       String?                // era stripePaymentId
  customerName      String?
  customerEmail     String?
  totalAmount       Float
  status            String      @default("pending") // pending, paid, failed
  items             OrderItem[]
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
}
```

O model `OrderItem` permanece **inalterado**.

Após alteração:

```bash
npm run db:push
```

> **Nota**: se já existem pedidos no banco, será necessário uma migration ao invés de `db:push`. Se o banco estiver vazio/dev, `db:push` é suficiente.

---

### 6. Ajustar `app/carrinho/page.tsx`

Mudança mínima — o fluxo é o mesmo (POST → receber URL → redirect):
- A URL de resposta muda de `session.url` para `preference.init_point`
- O campo enviado e recebido pode permanecer `{ url }` se a API retornar assim
- Nenhuma mudança na lógica do carrinho/contexto

---

### 7. Ajustar `app/carrinho/sucesso/page.tsx`

O Mercado Pago redireciona com query params diferentes:
- Stripe: `?session_id=cs_...`
- Mercado Pago: `?payment_id=123&status=approved&external_reference=order_id`

Ajustar a leitura dos `searchParams` para usar os params do MP (se necessário para exibir algo).

---

### 8. Ajustar `app/api/orders/route.ts`

- Substituir referências a `stripeSessionId` e `stripePaymentId` por `mpPreferenceId` e `mpPaymentId`
- Lógica de query (listar, filtrar por status) permanece idêntica

---

### 9. Ajustar `app/admin/pedidos/page.tsx`

- Atualizar referências de campos (`stripeSessionId` → `mpPreferenceId`, etc.)
- Adicionar badge para status `"in_process"` (PIX/boleto aguardando) se desejado
- Restante da UI permanece igual

---

### 10. Atualizar `CLAUDE.md` e documentação

- Remover referências ao Stripe
- Documentar novas variáveis de ambiente (`MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`)
- Atualizar seção de API Routes (webhook endpoint muda de `/api/webhook/stripe` para `/api/webhook/mercadopago`)

---

### 11. Testar localmente

O Mercado Pago oferece credenciais de teste e usuários de teste:

1. Usar `ACCESS_TOKEN` de teste (começa com `APP_USR-` no ambiente sandbox)
2. Criar usuários de teste via API do MP para simular comprador
3. No Checkout Pro de teste, usar cartões de teste documentados pelo MP
4. Para testar webhook localmente, usar `ngrok` ou similar:
   ```bash
   ngrok http 3000
   ```
   Configurar a URL do ngrok como webhook no painel do MP.

---

## Checklist resumido

- [ ] `npm uninstall stripe @stripe/stripe-js`
- [ ] `npm install mercadopago`
- [ ] Criar `lib/mercadopago.ts`
- [ ] Deletar `lib/stripe.ts`
- [ ] Reescrever `app/api/checkout/route.ts` (Preference API)
- [ ] Criar `app/api/webhook/mercadopago/route.ts`
- [ ] Deletar `app/api/webhook/stripe/route.ts`
- [ ] Atualizar `prisma/schema.prisma` (renomear campos)
- [ ] Rodar `npm run db:push`
- [ ] Ajustar `app/carrinho/page.tsx` (mudança mínima)
- [ ] Ajustar `app/carrinho/sucesso/page.tsx` (query params)
- [ ] Ajustar `app/api/orders/route.ts` (campos renomeados)
- [ ] Ajustar `app/admin/pedidos/page.tsx` (campos renomeados)
- [ ] Atualizar `.env` com credenciais do MP
- [ ] Atualizar `CLAUDE.md`
- [ ] Testar checkout completo (cartão + PIX)
- [ ] Testar webhook (pagamento aprovado, pendente, rejeitado)

## Arquivos — resumo de ações

| Ação | Arquivo |
|------|---------|
| Criar | `lib/mercadopago.ts` |
| Criar | `app/api/webhook/mercadopago/route.ts` |
| Deletar | `lib/stripe.ts` |
| Deletar | `app/api/webhook/stripe/route.ts` |
| Reescrever | `app/api/checkout/route.ts` |
| Ajustar | `prisma/schema.prisma` |
| Ajustar | `app/carrinho/page.tsx` |
| Ajustar | `app/carrinho/sucesso/page.tsx` |
| Ajustar | `app/api/orders/route.ts` |
| Ajustar | `app/admin/pedidos/page.tsx` |
| Atualizar | `.env` |
| Atualizar | `CLAUDE.md` |
