# 🛠️ Referência Rápida de Comandos

Comandos mais usados durante o desenvolvimento.

## 📦 NPM / Dependências

```bash
# Instalar todas as dependências
npm install

# Instalar dependência específica
npm install nome-do-pacote

# Instalar como dev dependency
npm install -D nome-do-pacote

# Remover dependência
npm uninstall nome-do-pacote

# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar dependências desatualizadas
npm outdated

# Atualizar dependências
npm update
```

## 🚀 Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Iniciar em porta específica
PORT=3001 npm run dev

# Build para produção
npm run build

# Iniciar em produção (após build)
npm start

# Lint (verificar erros)
npm run lint

# Lint e corrigir automaticamente
npm run lint -- --fix
```

## 🗄️ Prisma / Database

```bash
# Gerar Prisma Client (após mudar schema)
npx prisma generate

# Sync schema com banco (desenvolvimento)
npx prisma db push

# Criar migration (produção)
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Abrir Prisma Studio (visualizar banco)
npx prisma studio

# Resetar banco de dados (⚠️ APAGA TUDO)
npx prisma db push --force-reset

# Seed database (se configurado)
npx prisma db seed

# Format schema
npx prisma format

# Validar schema
npx prisma validate

# Ver status das migrations
npx prisma migrate status
```

## 🎨 shadcn/ui

```bash
# Adicionar componente
npx shadcn-ui@latest add button

# Adicionar múltiplos componentes
npx shadcn-ui@latest add button card dialog

# Listar componentes disponíveis
npx shadcn-ui@latest add

# Atualizar componentes
npx shadcn-ui@latest update
```

## 🔧 Git

```bash
# Inicializar repositório
git init

# Adicionar remote
git remote add origin https://github.com/usuario/repo.git

# Status
git status

# Adicionar arquivos
git add .
git add src/app/page.tsx

# Commit
git commit -m "feat: adicionar login page"

# Push
git push origin main

# Pull
git pull origin main

# Criar branch
git checkout -b feature/nova-funcionalidade

# Ver branches
git branch

# Mudar de branch
git checkout main

# Merge
git merge feature/nova-funcionalidade

# Ver histórico
git log --oneline

# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1

# Desfazer mudanças em arquivo
git checkout -- src/app/page.tsx
```

## 🐛 Debug

```bash
# Ver logs do Next.js
npm run dev

# Verificar porta em uso
lsof -i :3000

# Matar processo em porta específica
npx kill-port 3000

# Ver variáveis de ambiente
env | grep DATABASE_URL

# Verificar versão do Node
node --version

# Verificar versão do npm
npm --version

# Limpar cache do Next.js
rm -rf .next

# Limpar tudo e reconstruir
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

## 📊 Database Queries (Prisma Studio alternativo)

```bash
# Conectar ao PostgreSQL direto (se tiver psql instalado)
psql "postgresql://user:pass@host:5432/dbname"

# Ou via Supabase SQL Editor
# Acesse: https://app.supabase.com/project/SEU_PROJETO/editor

# Ver todas as tabelas
\dt

# Descrever tabela
\d "User"

# Query SQL
SELECT * FROM "User";

# Sair
\q
```

## 🧪 Testing (quando implementado)

```bash
# Rodar todos os testes
npm test

# Rodar em watch mode
npm test -- --watch

# Rodar com coverage
npm test -- --coverage

# Rodar testes específicos
npm test -- src/app/api/dashboards
```

## 📦 Build & Deploy

```bash
# Build otimizado
npm run build

# Analisar bundle size
npm run build -- --analyze

# Testar build localmente
npm run build && npm start

# Deploy no Vercel
vercel

# Deploy em produção
vercel --prod

# Ver logs do deploy
vercel logs
```

## 🔐 Segurança

```bash
# Gerar secret para NextAuth
openssl rand -base64 32

# Gerar UUID
node -e "console.log(require('crypto').randomUUID())"

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades automaticamente
npm audit fix

# Forçar correção (pode quebrar)
npm audit fix --force
```

## 📝 Úteis

```bash
# Ver tamanho da pasta node_modules
du -sh node_modules

# Contar linhas de código
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l

# Buscar string em arquivos
grep -r "searchTerm" src/

# Buscar e substituir (usar com cuidado!)
find src/ -type f -exec sed -i '' 's/oldText/newText/g' {} +

# Ver processos Node rodando
ps aux | grep node

# Matar todos os processos Node
pkill -f node

# Limpar terminal
clear
# ou
Cmd+K (Mac) / Ctrl+L (Linux)
```

## 🎯 Workflows Comuns

### Adicionar Nova Funcionalidade

```bash
# 1. Criar branch
git checkout -b feature/nome-da-feature

# 2. Desenvolver...

# 3. Testar
npm run dev

# 4. Commit
git add .
git commit -m "feat: adicionar nova funcionalidade"

# 5. Push
git push origin feature/nome-da-feature

# 6. Criar Pull Request no GitHub
```

### Atualizar Database Schema

```bash
# 1. Editar prisma/schema.prisma

# 2. Gerar client
npx prisma generate

# 3. Aplicar mudanças
npx prisma db push

# 4. Verificar no Prisma Studio
npx prisma studio
```

### Adicionar Novo Componente UI

```bash
# 1. Adicionar via shadcn
npx shadcn-ui@latest add select

# 2. Importar no código
# import { Select } from "@/components/ui/select"

# 3. Usar
# <Select>...</Select>
```

### Deploy para Produção

```bash
# 1. Build local
npm run build

# 2. Testar build
npm start

# 3. Deploy
vercel --prod

# 4. Aplicar migrations
# (configurar DATABASE_URL de produção)
npx prisma migrate deploy
```

## 🆘 Solução de Problemas Rápida

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Port already in use"
```bash
npx kill-port 3000
```

### "Prisma Client error"
```bash
npx prisma generate
```

### "Database connection error"
```bash
# Verificar .env
cat .env | grep DATABASE_URL

# Testar conexão
npx prisma db push
```

### Build quebrado
```bash
rm -rf .next
npm run build
```

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

💡 **Dica**: Adicione este arquivo aos favoritos para referência rápida!
