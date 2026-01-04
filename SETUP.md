# Setup Instructions

## 1. Instalar Dependências

Execute o seguinte comando na pasta raiz do projeto:

```bash
npm install
```

## 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais (por enquanto, use placeholders).

## 3. Configurar Prisma

Após configurar o banco de dados no Supabase, execute:

```bash
npx prisma generate
npx prisma db push
```

## 4. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

## Próximos Passos

1. Configurar conta no Supabase e obter a DATABASE_URL
2. Configurar OAuth providers (Google, Meta)
3. Gerar NEXTAUTH_SECRET: `openssl rand -base64 32`

## Estrutura do Projeto

```
/src
  /app               # Next.js App Router
    /(auth)          # Rotas de autenticação
    /(dashboard)     # Rotas do dashboard
    /(public)        # Visualizações públicas
    /api             # API Routes
  /components        # Componentes React
    /ui              # shadcn/ui components
    /dashboard       # Dashboard-specific
    /integrations    # Integration components
    /layouts         # Layout components
  /lib               # Utilities e helpers
    /api             # API clients
    /aggregation     # Data aggregation logic
    /cache           # Caching layer
  /hooks             # React hooks
  /types             # TypeScript types
```
