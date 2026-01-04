# 🔄 Guia: Alternando entre Dados Mock e Dados Reais

Este guia explica como mudar da visualização com dados mockados para dados reais das APIs.

## 📋 Visão Geral

O sistema foi desenvolvido com **abstração completa** entre dados mock e reais:

- **Mock Data**: Dados simulados realistas para desenvolvimento e testes
- **Real Data**: Dados das APIs reais (Meta Ads, Google Ads, GA4, Payments)
- **Feature Flags**: Sistema centralizado para alternar entre os dois

## 🎯 Como Está Estruturado

```
/src/lib/
├── config.ts                    # ⚙️ Feature flags centralizadas
├── mock-data.ts                 # 📊 Geradores de dados mockados
└── data-providers/              # 🔌 Providers com abstração
    ├── base-provider.ts         # Interface base
    ├── meta-ads-provider.ts     # Meta Ads (mock + real)
    ├── index.ts                 # Factory e outros providers
    └── [outros providers]
```

## 🚀 Passo a Passo: Mock → Real

### Opção 1: Alternar TUDO de uma vez

#### 1. Editar `src/lib/config.ts`

```typescript
export const config = {
  // Altere de true para false
  USE_MOCK_DATA: false, // ← AQUI

  // ... resto da config
};
```

✅ **Pronto!** Agora todo o sistema tentará usar dados reais.

⚠️ **Importante**: Você precisará ter implementado os métodos reais primeiro (veja abaixo).

---

### Opção 2: Alternar por Integração (Gradual)

Você pode ativar dados reais para cada integração separadamente:

#### Editar `src/lib/config.ts`

```typescript
AVAILABLE_INTEGRATIONS: [
  {
    id: 'meta_ads',
    name: 'Meta Ads',
    // ...
    useMock: false, // ← Alterar para false quando Meta Ads estiver configurado
  },
  {
    id: 'google_ads',
    name: 'Google Ads',
    // ...
    useMock: true, // ← Ainda usa mock
  },
  // ... outros
]
```

Assim você pode testar uma integração por vez!

---

## 🔧 Implementando Dados Reais

### 1. Configurar Credenciais (.env)

```bash
# Meta Marketing API
META_APP_ID="seu-app-id"
META_APP_SECRET="seu-app-secret"

# Google Ads API
GOOGLE_ADS_CLIENT_ID="seu-client-id"
GOOGLE_ADS_CLIENT_SECRET="seu-client-secret"
GOOGLE_ADS_DEVELOPER_TOKEN="seu-developer-token"

# Google Analytics 4
GA4_PROPERTY_ID="seu-property-id"

# Payment APIs
ASAAS_API_KEY="sua-api-key"
MERCADO_PAGO_ACCESS_TOKEN="seu-access-token"
```

### 2. Implementar Método `fetchRealData()`

Cada provider tem um método `fetchRealData()` que precisa ser implementado.

#### Exemplo: Meta Ads

Abra `/src/lib/data-providers/meta-ads-provider.ts`:

```typescript
private async fetchRealData(
  metric: string,
  dateRange: DateRange,
  options?: Record<string, any>
): Promise<DataProviderResponse> {
  // 1. Obter access token do banco (tabela Integration)
  const userId = options?.userId;
  const integration = await prisma.integration.findFirst({
    where: {
      userId,
      platform: 'meta_ads',
    },
  });

  if (!integration) {
    throw new Error('Meta Ads não conectado');
  }

  const accessToken = integration.accessToken;
  const accountId = integration.accountId;

  // 2. Fazer request para Meta Marketing API
  const since = dateRange.startDate || '2024-01-01';
  const until = dateRange.endDate || '2024-12-31';

  const url = `https://graph.facebook.com/v18.0/act_${accountId}/insights?` +
    `fields=spend,impressions,clicks,ctr,cpc,purchases,purchase_value&` +
    `time_range=${JSON.stringify({since, until})}&` +
    `access_token=${accessToken}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Meta API error: ${response.statusText}`);
  }

  const apiData = await response.json();

  // 3. Normalizar dados para o formato esperado
  const normalized = {
    summary: {
      spend: parseFloat(apiData.data[0].spend),
      impressions: parseInt(apiData.data[0].impressions),
      clicks: parseInt(apiData.data[0].clicks),
      ctr: parseFloat(apiData.data[0].ctr),
      cpc: parseFloat(apiData.data[0].cpc),
      purchases: parseInt(apiData.data[0].purchases || 0),
      purchase_value: parseFloat(apiData.data[0].purchase_value || 0),
      roas: parseFloat(apiData.data[0].purchase_value || 0) / parseFloat(apiData.data[0].spend),
    }
  };

  // 4. Retornar
  return this.createResponse(normalized, 'real');
}
```

### 3. Implementar OAuth Flow (se necessário)

Para Meta Ads e Google Ads, você precisará implementar o fluxo OAuth:

#### Criar rota de OAuth (`/app/api/integrations/meta/auth/route.ts`)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect("/login");
  }

  const appId = process.env.META_APP_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/integrations/meta/callback`;

  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
    `client_id=${appId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=ads_read,ads_management`;

  return NextResponse.redirect(authUrl);
}
```

#### Criar callback (`/app/api/integrations/meta/callback/route.ts`)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect("/login");
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("/integrations?error=no_code");
  }

  // Exchange code por access token
  const tokenResponse = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?` +
    `client_id=${process.env.META_APP_ID}&` +
    `client_secret=${process.env.META_APP_SECRET}&` +
    `redirect_uri=${encodeURIComponent(process.env.NEXTAUTH_URL + '/api/integrations/meta/callback')}&` +
    `code=${code}`
  );

  const tokenData = await tokenResponse.json();

  // Salvar no banco
  await prisma.integration.create({
    data: {
      userId: session.user.id,
      platform: 'meta_ads',
      accessToken: tokenData.access_token,
      expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
    },
  });

  return NextResponse.redirect("/integrations?success=meta_connected");
}
```

---

## 📊 Testando a Migração

### 1. Testar com Mock (Padrão)

Acesse: http://localhost:3000/demo

Você verá dados mockados funcionando.

### 2. Implementar Uma Integração Real

1. Escolha uma integração (ex: Meta Ads)
2. Configure credenciais no `.env`
3. Implemente `fetchRealData()` no provider
4. Altere `useMock: false` apenas para essa integração
5. Teste novamente

### 3. Verificar Fonte dos Dados

Cada response da API inclui a propriedade `source`:

```json
{
  "data": {...},
  "cached": false,
  "timestamp": "2024-01-01T00:00:00Z",
  "source": "real" // ← "mock" ou "real"
}
```

---

## 🔍 Debugging

### Como saber se estou usando mock ou real?

#### No Browser DevTools:

1. Abra a aba **Network**
2. Veja requests para `/api/data`
3. Na response, veja o campo `source`

#### No Código:

```typescript
const result = await DataProviderFactory.fetchData('meta_ads', 'summary');
console.log('Fonte:', result.source); // "mock" ou "real"
```

### Erros Comuns

#### ❌ "Meta Ads API não configurada"

**Causa**: `USE_MOCK_DATA` está `false` mas `fetchRealData()` não foi implementado.

**Solução**:
1. Implemente `fetchRealData()`
2. OU volte `USE_MOCK_DATA` para `true`

#### ❌ "Access token expired"

**Causa**: Token da integração expirou.

**Solução**: Implementar refresh token automático ou pedir re-autenticação.

---

## 📝 Checklist de Migração

### Por Integração:

- [ ] Credenciais configuradas no `.env`
- [ ] OAuth flow implementado (se necessário)
- [ ] Método `fetchRealData()` implementado no provider
- [ ] Normalização de dados implementada
- [ ] Error handling implementado
- [ ] Testado com dados reais
- [ ] `useMock: false` ativado em `config.ts`

### Geral:

- [ ] Todas as integrações necessárias migradas
- [ ] Sistema de cache configurado (opcional)
- [ ] Monitoramento de erros configurado (Sentry, etc.)
- [ ] Rate limiting implementado
- [ ] `USE_MOCK_DATA: false` ativado

---

## 🎯 Exemplo Completo: Meta Ads

Veja o arquivo `/src/lib/data-providers/meta-ads-provider.ts` para exemplo completo com:

- ✅ Método mock implementado
- ⏳ Método real com comentários de como implementar
- ✅ Error handling
- ✅ Validação de conexão

---

## 💡 Dicas

### 1. Migração Gradual

Não precisa migrar tudo de uma vez! Faça por etapas:

1. Primeiro: Meta Ads (geralmente mais fácil)
2. Depois: Google Ads
3. Depois: GA4
4. Por último: Payments

### 2. Manter Mock para Desenvolvimento

Mesmo em produção, você pode querer manter mock ativo para:

- Testes automatizados
- Demonstrações
- Desenvolvimento de novas features

### 3. Usar Cache

Para dados reais, implemente cache para:

- Reduzir custos de API
- Melhorar performance
- Evitar rate limits

```typescript
// Exemplo de cache simples
const cacheKey = `${source}_${metric}_${dateRange}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

const data = await fetchRealData(...);
await redis.setex(cacheKey, 300, JSON.stringify(data)); // 5 min
```

---

## 🆘 Precisa de Ajuda?

1. Veja exemplos em `/src/lib/data-providers/meta-ads-provider.ts`
2. Leia a documentação das APIs:
   - [Meta Marketing API](https://developers.facebook.com/docs/marketing-apis)
   - [Google Ads API](https://developers.google.com/google-ads/api)
   - [Google Analytics 4](https://developers.google.com/analytics/devguides/reporting/data/v1)
3. Verifique os logs no console

---

**Com este sistema, você pode desenvolver e testar tudo com dados mockados, e migrar para dados reais quando estiver pronto!** 🚀
