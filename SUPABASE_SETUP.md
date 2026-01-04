# 🔧 Configuração do Supabase

## ❌ Problema Encontrado

A connection string fornecida não está funcionando. Vamos obter a correta!

## ✅ Como Obter a Connection String Correta

### 1. Acessar o Painel do Supabase

1. Acesse: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione seu projeto **plataforma-BIaaS** (ou o nome que você criou)

### 2. Obter a Connection String

1. No menu lateral esquerdo, clique em **⚙️ Settings** (Configurações)
2. Clique em **Database**
3. Role até a seção **Connection string**
4. Selecione a aba **URI**
5. Copie a string que aparece

**A string deve ter este formato**:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

### 3. Opções de Connection String

O Supabase oferece 3 tipos:

#### **A) Connection Pooling (Recomendado para Produção)**
```
postgresql://postgres.[ref]:[password]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```
- ✅ Melhor para produção
- ✅ Suporta muitas conexões
- ⚠️ **Adicionar** `?pgbouncer=true` no final

#### **B) Direct Connection (Recomendado para Migrations)**
```
postgresql://postgres.[ref]:[password]@db.[ref].supabase.co:5432/postgres
```
- ✅ Necessário para Prisma migrations
- ⚠️ Limite de conexões simultâneas

#### **C) Session Mode**
```
postgresql://postgres.[ref]:[password]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

### 4. Qual Usar?

Para este projeto, use **Direct Connection** (opção B):

1. No Supabase Dashboard → Settings → Database
2. Procure por **Connection string**
3. Selecione **Direct connection**
4. Copie a string completa
5. Substitua `[YOUR-PASSWORD]` pela sua senha real

### 5. Atualizar o .env

Cole a string no arquivo `.env`:

```bash
# Database
DATABASE_URL="sua-connection-string-aqui"
```

**IMPORTANTE**: Se sua senha tiver caracteres especiais, use URL encoding:

| Caractere | Encode |
|-----------|--------|
| `!` | `%21` |
| `*` | `%2A` |
| `#` | `%23` |
| `@` | `%40` |
| `$` | `%24` |
| `%` | `%25` |
| `&` | `%26` |

**Exemplo**:
Se a senha é `Abc123!@#`, use: `Abc123%21%40%23`

### 6. Testar Conexão

Depois de atualizar o `.env`, teste:

```bash
npx prisma db push --skip-generate
```

Se funcionar, você verá:

```
✔ Applying migration...
The database is now in sync with the Prisma schema.
```

### 7. Criar as Tabelas

Após confirmar que a conexão funciona:

```bash
npx prisma db push
```

Isso criará todas as tabelas com o prefixo `biaas_`:
- `biaas_users`
- `biaas_dashboards`
- `biaas_widgets`
- `biaas_integrations`
- `biaas_templates`
- etc.

## 🔍 Troubleshooting

### Erro: "Can't reach database server"

**Causa**: URL incorreta ou projeto pausado

**Solução**:
1. Verifique se o projeto está ativo no Supabase
2. Confirme que copiou a connection string correta
3. Tente ambas as opções (Direct e Pooling)

### Erro: "Tenant or user not found"

**Causa**: Formato do usuário incorreto

**Solução**: Use a connection string exatamente como aparece no Supabase, apenas substituindo a senha

### Erro: "Invalid password"

**Causa**: Senha não está URL-encoded

**Solução**: Encode caracteres especiais (veja tabela acima)

## 📝 Exemplo Completo

Se seu projeto é `abc123` e senha é `Pass123!`:

```bash
# Direct Connection (para migrations)
DATABASE_URL="postgresql://postgres.abc123:Pass123%21@db.abc123.supabase.co:5432/postgres"

# OU Pooling (para produção)
DATABASE_URL="postgresql://postgres.abc123:Pass123%21@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

## ✅ Após Configurar

1. Teste a conexão: `npx prisma db push --skip-generate`
2. Crie as tabelas: `npx prisma db push`
3. Inicie o projeto: `npm run dev`
4. Acesse: http://localhost:3000

---

**Precisa de ajuda?** Copie a mensagem de erro completa e envie.
