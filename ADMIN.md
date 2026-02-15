# Área administrativa – Casamento

## Usuários

Apenas dois acessos (criados pelo seed):

| Email | Senha |
|-------|--------|
| larissagarciafr@gmail.com | admin123 |
| rafaelrabelodev@gmail.com | admin123 |

## Banco: PostgreSQL

O projeto usa **PostgreSQL**. No `.env`:

```env
# Formato: postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/wedding"

# Segredo para o JWT (obrigatório)
JWT_SECRET="um-texto-aleatorio-seguro"
```

**Exemplos de onde pegar a URL:**
- **Local (Docker):** `postgresql://postgres:postgres@localhost:5432/wedding`
- **Vercel Postgres / Neon / Supabase:** use a connection string que o painel mostra (geralmente “Connection string” ou “URI”)

## Primeiro acesso

1. **Criar o banco e as tabelas, e já criar os admins** (uma vez):
   ```bash
   npm run db:setup
   ```
   Esse comando roda `prisma db push` (cria/atualiza as tabelas) e em seguida o seed (cria os dois usuários acima).

   Se preferir fazer em dois passos:
   ```bash
   npm run db:push    # cria as tabelas
   npm run db:seed    # cria os dois admins
   ```

2. **Login**
   - Acesse: **`/admin/login`**
   - Layout: imagem do pré-wedding à esquerda, formulário à direita
   - Após login, você é redirecionado para **`/admin`**

## Painel admin (`/admin`)

- **Lista de presentes:** criar, editar e excluir itens.
- Cada item tem: **nome**, **descrição** (opcional), **preço**, **URL da imagem** (opcional).
- Os itens aparecem na seção “Presentes” do site público.

## Segurança

- Login com **JWT** (token salvo no navegador).
- APIs de criação/edição/exclusão de presentes exigem o token.
- Em produção: use `JWT_SECRET` forte.
