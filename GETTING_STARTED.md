# 🚀 Primeiros Passos - Dashboard SaaS

Guia rápido para rodar o projeto pela primeira vez.

## ✅ Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Conta no Supabase (gratuita)
- Git (opcional)

## 📦 Instalação Rápida (5 minutos)

### 1. Instalar Dependências

```bash
cd /Users/gustavolemos/Desktop/plataforma-BIaaS
npm install
```

**Aguarde a instalação de todas as dependências (~2 minutos)**

### 2. Configurar Banco de Dados (Supabase)

#### 2.1. Criar Conta no Supabase

1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Crie uma conta (pode usar GitHub)

#### 2.2. Criar Novo Projeto

1. No dashboard do Supabase, clique em "New Project"
2. Preencha:
   - **Name**: `dashboard-saas` (ou outro nome)
   - **Database Password**: Crie uma senha forte (anote!)
   - **Region**: `South America (São Paulo)` (recomendado para Brasil)
3. Clique em "Create new project"
4. **Aguarde ~2 minutos** enquanto o projeto é criado

#### 2.3. Copiar Connection String

1. No menu lateral, clique em ⚙️ **Settings**
2. Clique em **Database**
3. Role até "Connection string"
4. Selecione a tab **URI**
5. Copie a string que começa com `postgresql://...`
6. **IMPORTANTE**: Substitua `[YOUR-PASSWORD]` pela senha que você criou

Exemplo:
```
postgresql://postgres.abc123:SuaSenhaAqui@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

### 3. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env
```

Edite o arquivo `.env` e preencha:

```env
# 1. Cole sua connection string do Supabase aqui
DATABASE_URL="postgresql://postgres.abc123:SuaSenhaAqui@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"

# 2. Gere uma secret key para NextAuth
# Execute no terminal: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="cole-aqui-a-secret-key-gerada"

# 3. OAuth Google (OPCIONAL - pode pular por enquanto)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# 4. APIs de Marketing (OPCIONAL - configurar depois)
META_APP_ID=""
META_APP_SECRET=""
GOOGLE_ADS_CLIENT_ID=""
GOOGLE_ADS_CLIENT_SECRET=""
GA4_PROPERTY_ID=""
```

#### Gerar NEXTAUTH_SECRET:

**No macOS/Linux:**
```bash
openssl rand -base64 32
```

**No Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Cole o resultado no `.env` na variável `NEXTAUTH_SECRET`.

### 4. Criar Tabelas no Banco de Dados

```bash
# Gerar Prisma Client
npx prisma generate

# Criar tabelas no banco
npx prisma db push
```

Você verá uma saída similar a:
```
✔ Generated Prisma Client
...
🚀  Your database is now in sync with your Prisma schema.
```

### 5. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

Aguarde até ver:

```
✓ Ready in 3.2s
○ Local:   http://localhost:3000
```

### 6. Acessar Aplicação

Abra seu navegador em: **http://localhost:3000**

Você será redirecionado para `/login`

## 🎯 Criar Primeira Conta

1. Na tela de login, clique em **"Criar conta"**
2. Preencha:
   - Nome: Seu nome
   - Email: seu@email.com
   - Senha: Mínimo 6 caracteres
3. Clique em **"Criar conta"**
4. Você será logado automaticamente e redirecionado para `/dashboards`

## 📊 Criar Primeiro Dashboard

1. Na tela de dashboards, clique em **"Novo Dashboard"**
2. Preencha:
   - Nome: "Meu Primeiro Dashboard"
   - Descrição: "Dashboard de teste"
3. Clique em **"Criar Dashboard"**
4. Você será redirecionado para o editor (em construção)

## ✅ Checklist de Configuração

- [ ] Dependências instaladas (`npm install`)
- [ ] Conta no Supabase criada
- [ ] Projeto no Supabase criado
- [ ] `DATABASE_URL` configurada no `.env`
- [ ] `NEXTAUTH_SECRET` gerada e configurada
- [ ] Tabelas criadas (`npx prisma db push`)
- [ ] Servidor rodando (`npm run dev`)
- [ ] Primeira conta criada
- [ ] Primeiro dashboard criado

## 🔧 Comandos Úteis

```bash
# Iniciar desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start

# Lint (verificar erros)
npm run lint

# Prisma Studio (visualizar banco de dados)
npx prisma studio

# Resetar banco de dados (CUIDADO: apaga tudo)
npx prisma db push --force-reset
```

## 🐛 Problemas Comuns

### Erro: "Invalid `prisma.user.create()` invocation"

**Solução**: Verifique se:
1. A `DATABASE_URL` está correta no `.env`
2. Você executou `npx prisma db push`
3. O banco de dados está acessível

### Erro: "NEXTAUTH_SECRET is not set"

**Solução**:
1. Gere uma secret: `openssl rand -base64 32`
2. Cole no `.env` na variável `NEXTAUTH_SECRET`
3. Reinicie o servidor

### Erro: "Port 3000 is already in use"

**Solução**:
```bash
# Matar processo na porta 3000
npx kill-port 3000

# Ou usar outra porta
PORT=3001 npm run dev
```

### Erro ao instalar dependências

**Solução**:
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📝 Próximos Passos

Agora que o projeto está rodando, você pode:

### 1. Explorar a Aplicação
- Criar múltiplos dashboards
- Testar autenticação (login/logout)
- Ver a navegação

### 2. Configurar OAuth Google (Opcional)

Siga o tutorial: [SETUP_GOOGLE_OAUTH.md](./docs/SETUP_GOOGLE_OAUTH.md) (TODO)

### 3. Desenvolver Features

Próximas implementações (veja [README.md](./README.md)):
- Editor de dashboard
- Widgets (KPI, gráficos, tabelas)
- Integrações com APIs
- Marketplace de templates

### 4. Criar Templates

Leia o guia completo: [TEMPLATE_DEVELOPMENT_GUIDE.md](./TEMPLATE_DEVELOPMENT_GUIDE.md)

## 🆘 Precisa de Ajuda?

1. Verifique a documentação completa: [README.md](./README.md)
2. Veja exemplos em `src/templates/`
3. Abra uma issue no repositório (se configurado)

## 🎉 Parabéns!

Você configurou com sucesso a plataforma Dashboard SaaS!

Agora é hora de começar a desenvolver e criar dashboards incríveis! 🚀

---

**Última atualização**: Janeiro 2025
