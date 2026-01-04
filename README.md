# Dashboard SaaS - Plataforma de Marketing Digital

Uma plataforma SaaS completa para criação e gestão de dashboards de marketing digital, com marketplace de templates desenvolvidos pela comunidade.

## 🚀 Características Principais

### ✅ Implementado (Fase 1 + 2 Parcial)

- **Sistema de Autenticação Completo**
  - Login/Registro com email/senha
  - OAuth com Google
  - Recuperação de senha
  - Sessões JWT seguras

- **CRUD de Dashboards**
  - Criar, editar, listar e excluir dashboards
  - Sistema de slugs únicos
  - Metadados (nome, descrição, etc.)
  - Controle de publicação

- **🎉 Widgets Funcionais com Dados Mock/Real**
  - ✅ KPI Cards com variação percentual
  - ✅ Line Charts (tendências temporais)
  - ✅ Bar Charts (comparações)
  - ✅ Sistema de dados mockados realistas
  - ✅ Arquitetura preparada para dados reais
  - ✅ Feature flags para alternar mock ↔ real
  - ✅ Página de demonstração completa

- **🔌 Sistema de Data Providers**
  - ✅ Abstração completa entre mock e real
  - ✅ Meta Ads Provider (mock + estrutura real)
  - ✅ Google Ads Provider (mock + estrutura real)
  - ✅ GA4 Provider (mock + estrutura real)
  - ✅ Payment Provider (mock + estrutura real)
  - ✅ API centralizada (`/api/data`)
  - ✅ Agregação cross-platform

- **Marketplace de Templates**
  - Sistema completo para desenvolvedores criarem e venderem templates
  - Revenue sharing (70% desenvolvedor / 30% plataforma)
  - Avaliações e reviews
  - Sistema de compras integrado
  - Tags e categorias

- **Arquitetura e Infraestrutura**
  - Next.js 15 com App Router
  - TypeScript strict mode
  - Prisma ORM com PostgreSQL
  - NextAuth.js v5
  - shadcn/ui + Recharts
  - Tailwind CSS dark mode

### 🔨 Próximas Implementações

#### Fase 2: Editor e Widgets (2 semanas)
- [ ] Editor de dashboard com grid layout
- [ ] Drag & drop de widgets
- [ ] Biblioteca de widgets:
  - KPI Cards
  - Line Charts
  - Bar Charts
  - Pie Charts
  - Tables
  - Funnels
- [ ] Configuração individual de widgets
- [ ] Preview em tempo real

#### Fase 3: Integrações (2 semanas)
- [ ] Meta Marketing API
  - OAuth flow
  - Seleção de contas de anúncios
  - Fetch de métricas (spend, impressions, clicks, conversions)
- [ ] Google Ads API
  - OAuth flow
  - Fetch de campanhas e métricas
- [ ] Google Analytics 4
  - Conexão e autenticação
  - Eventos e conversões
- [ ] APIs de Pagamento (Asaas, Mercado Pago)
  - Webhooks para boleto/Pix
  - Status de pagamentos

#### Fase 4: Agregação e Cache (1 semana)
- [ ] Sistema de agregação cross-platform
- [ ] Cálculo de métricas derivadas (ROAS, CPA, etc.)
- [ ] Cache layer com Redis/Upstash
- [ ] Background jobs para sincronização

#### Fase 5: Visualização Pública (1 semana)
- [ ] Rotas públicas para dashboards
- [ ] Proteção por senha
- [ ] Expiração de links
- [ ] Whitelabel mode
- [ ] Export para PDF

## 📁 Estrutura do Projeto

```
/
├── prisma/
│   └── schema.prisma           # Database schema
├── src/
│   ├── app/
│   │   ├── (auth)/             # Rotas de autenticação
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/        # Rotas protegidas
│   │   │   ├── dashboards/     # Lista de dashboards
│   │   │   ├── marketplace/    # Marketplace (TODO)
│   │   │   ├── integrations/   # Integrações (TODO)
│   │   │   └── settings/       # Configurações (TODO)
│   │   ├── (public)/           # Visualizações públicas (TODO)
│   │   │   └── view/[slug]/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/
│   │   │   │   └── register/
│   │   │   └── dashboards/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── toast.tsx
│   │   │   └── toaster.tsx
│   │   ├── layouts/
│   │   │   └── dashboard-nav.tsx
│   │   ├── dashboard/          # Dashboard components (TODO)
│   │   └── integrations/       # Integration components (TODO)
│   ├── lib/
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── prisma.ts           # Prisma client
│   │   └── utils.ts            # Utility functions
│   ├── hooks/
│   │   └── use-toast.ts
│   ├── types/
│   │   ├── next-auth.d.ts
│   │   └── template.ts         # Template system types
│   └── templates/              # Built-in templates
│       └── ecommerce-general.ts
├── public/
├── .env.example
├── .gitignore
├── components.json             # shadcn/ui config
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🛠️ Setup do Projeto

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Copie a `DATABASE_URL` do projeto
4. Cole no arquivo `.env`:

```bash
cp .env.example .env
# Edite o .env e adicione suas credenciais
```

### 3. Executar Migrations

```bash
npx prisma generate
npx prisma db push
```

### 4. Configurar NextAuth

Gere uma secret key:

```bash
openssl rand -base64 32
```

Adicione no `.env`:

```
NEXTAUTH_SECRET="sua-secret-key-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### 5. Configurar OAuth (Opcional)

#### Google OAuth:
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto
3. Ative a Google+ API
4. Crie credenciais OAuth 2.0
5. Adicione ao `.env`:

```
GOOGLE_CLIENT_ID="seu-client-id"
GOOGLE_CLIENT_SECRET="seu-client-secret"
```

### 6. Iniciar Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

## 🎨 Sistema de Templates

Os desenvolvedores podem criar templates JavaScript/TypeScript para vender no marketplace.

### Exemplo de Template:

```typescript
import { TemplateCode } from "@/types/template";

export const meuTemplate: TemplateCode = {
  metadata: {
    name: "Meu Dashboard Incrível",
    description: "Dashboard para análise de vendas",
    category: "ecommerce",
    tags: ["vendas", "conversão"],
    version: "1.0.0",
    author: {
      name: "Seu Nome",
      email: "seu@email.com"
    },
    requiredIntegrations: ["meta_ads", "ga4"],
    price: 29.90,
    isFree: false
  },
  layout: {
    cols: 12,
    rowHeight: 80
  },
  widgets: [
    {
      id: "revenue-kpi",
      type: "kpi",
      title: "Receita Total",
      dataSource: "payment",
      metric: "total_revenue",
      dateRange: { type: "last_30_days" },
      position: { x: 0, y: 0, w: 3, h: 2 }
    }
    // ... mais widgets
  ]
};
```

Ver exemplo completo em: `src/templates/ecommerce-general.ts`

## 📊 Database Schema

### Principais Models:

- **User**: Usuários da plataforma
- **Dashboard**: Dashboards criados
- **Widget**: Widgets dentro dos dashboards
- **Integration**: Integrações com plataformas externas
- **Template**: Templates do marketplace
- **TemplatePurchase**: Compras de templates
- **TemplateReview**: Avaliações de templates
- **DataCache**: Cache de dados das APIs

## 🔐 Segurança

- ✅ Senhas hasheadas com bcrypt
- ✅ Sessões JWT com NextAuth.js
- ✅ CSRF protection
- ✅ SQL injection protection (Prisma ORM)
- ✅ XSS protection (React)
- ✅ Environment variables para secrets

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Configurar Variáveis de Ambiente:
1. Acesse o dashboard da Vercel
2. Settings → Environment Variables
3. Adicione todas as variáveis do `.env`

### Database:
- Supabase (gratuito até 500MB)
- Railway (alternativa)
- Neon (PostgreSQL serverless)

## 📝 Próximos Passos para Desenvolvimento

### Implementar Editor de Dashboard:
1. Instalar `react-grid-layout` ou `@dnd-kit`
2. Criar componente `DashboardEditor`
3. Implementar drag & drop
4. Salvar layout no banco

### Implementar Widgets:
1. Criar componentes de visualização (usar Recharts)
2. Criar sistema de configuração de widgets
3. Implementar data fetching
4. Adicionar loading states

### Integrar APIs:
1. Configurar OAuth flows
2. Implementar clients para cada API
3. Criar sistema de cache
4. Adicionar error handling

### Marketplace:
1. Criar UI de listagem de templates
2. Implementar sistema de compras
3. Integrar pagamento (Stripe/Asaas)
4. Sistema de earnings para desenvolvedores

## 🤝 Contribuindo

Este é um projeto privado, mas contribuições são bem-vindas!

## 📄 Licença

Proprietário - Todos os direitos reservados

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação acima
2. Veja os exemplos em `src/templates/`
3. Abra uma issue no repositório (se configurado)

---

**Desenvolvido com ❤️ usando Next.js, TypeScript e Tailwind CSS**
