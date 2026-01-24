# Larissa & Rafael Wedding Website

Site de casamento minimalista e elegante construído com Next.js, TypeScript, Tailwind CSS e shadcn/ui.

## 🎨 Conceito Visual

- **Minimalismo absoluto**: Layout limpo, arejado e silencioso
- **Paleta de cores**: Off-white/branco quente, charcoal/grafite, tons de areia
- **Tipografia**: Cormorant Garamond (serif) + Inter (sans-serif)
- **Animações**: Transições suaves e imperceptíveis
- **Mobile-first**: Totalmente responsivo

## 🏗️ Arquitetura

```
larissa-rafael-wedding/
├── app/
│   ├── layout.tsx          # Layout raiz com fontes
│   ├── page.tsx            # Página principal
│   ├── globals.css         # Estilos globais e tema
│   └── favicon.ico
├── components/
│   ├── navbar.tsx          # Navbar fixo com logo
│   ├── hero.tsx            # Seção hero com animação
│   ├── our-story.tsx       # História do casal
│   ├── details.tsx         # Detalhes do evento
│   ├── rsvp.tsx            # Formulário de confirmação
│   ├── gifts.tsx           # Lista de presentes
│   └── footer.tsx          # Rodapé com assinatura
├── lib/
│   └── utils.ts            # Utilitários
├── public/                 # Arquivos estáticos
│   ├── logo-monogram.png   # Monograma LR
│   └── logo-signature.png  # Assinatura do casal
└── ...
```

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 📦 Stack Tecnológica

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS 4
- **Componentes**: shadcn/ui
- **Ícones**: Lucide React
- **Fontes**: Google Fonts (Cormorant Garamond, Inter)

## 🎯 Seções do Site

### Navbar
- Logo/monograma do casal no canto esquerdo
- Links de navegação suave entre seções
- Efeito de transparência que muda ao fazer scroll
- Menu mobile responsivo com animação
- Tipografia delicada seguindo o padrão do site

### Hero
- Nomes do casal em tipografia grande e elegante
- Data do casamento
- Animação suave de fade-in

### Nossa História
- Texto curto e emocional sobre o casal
- Layout em coluna única
- Tipografia hierárquica

### Detalhes
- Data, horário e local do evento
- Link para Google Maps
- Background com tom de areia sutil

### RSVP
- Formulário minimalista de confirmação
- Campos: nome, e-mail, número de convidados, mensagem
- Feedback visual de sucesso

### Presentes
- Três opções: Lista de presentes, Lua de mel, PIX
- Cards limpos com ícones
- Links para cada opção

### Rodapé
- Assinatura do casal
- Data formatada

## 🎨 Customização

### Cores
As cores estão definidas em `app/globals.css`:

```css
--color-warm-white: oklch(0.99 0.005 85);
--color-charcoal: oklch(0.25 0.01 0);
--color-sand: oklch(0.88 0.02 75);
```

### Tipografia
As fontes são configuradas em `app/layout.tsx`:

- **Títulos**: Cormorant Garamond (serif)
- **Corpo**: Inter (sans-serif)

### Conteúdo
Edite os textos diretamente nos componentes em `components/`.

## 📝 Próximos Passos

1. **Integrar formulário RSVP** com backend (ex: API Routes, Supabase, Firebase)
2. **Adicionar links reais** para lista de presentes e PIX
3. **Configurar Google Maps** com coordenadas reais
4. **Otimizar SEO** (meta tags, Open Graph, etc.)
5. **Adicionar Analytics** (Google Analytics, Vercel Analytics)
6. **Configurar domínio customizado**

## ⚡ Performance

- Fontes com `display: swap` para carregamento otimizado
- CSS inline via Tailwind
- Componentes client-side apenas quando necessário
- Imagens otimizadas via Next.js Image (quando adicionadas)

## ♿ Acessibilidade

- Semântica HTML apropriada
- Labels em todos os inputs
- Contraste de cores adequado (WCAG AA)
- Navegação por teclado funcional
- Smooth scroll entre seções

## 📱 Responsividade

O site é 100% responsivo e otimizado para:
- Mobile (320px+)
- Tablet (640px+)
- Desktop (1024px+)

---

**Desenvolvido com ❤️ para Larissa & Rafael**
# larissa-rafael-wedding
