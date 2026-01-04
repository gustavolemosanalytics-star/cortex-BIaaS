# 🎨 Guia de Desenvolvimento de Templates

Este guia explica como criar templates para o marketplace e ganhar dinheiro com cada venda.

## 📋 Índice

1. [Introdução](#introdução)
2. [Estrutura de um Template](#estrutura-de-um-template)
3. [Tipos de Widgets](#tipos-de-widgets)
4. [Fontes de Dados](#fontes-de-dados)
5. [Layout e Grid System](#layout-e-grid-system)
6. [Transformações de Dados](#transformações-de-dados)
7. [Publicando no Marketplace](#publicando-no-marketplace)
8. [Revenue Sharing](#revenue-sharing)
9. [Melhores Práticas](#melhores-práticas)

## Introdução

Templates são configurações JavaScript/TypeScript que definem:
- Layout do dashboard
- Widgets e suas posições
- Fontes de dados
- Transformações e agregações
- Metadata (nome, preço, categoria, etc.)

**Como Desenvolvedor de Templates, você ganha 70% de cada venda!**

## Estrutura de um Template

```typescript
import { TemplateCode } from "@/types/template";

export const meuTemplate: TemplateCode = {
  // 1. METADATA
  metadata: {
    name: "Nome do Template",
    description: "Descrição detalhada do que o template faz",
    category: "ecommerce", // ou 'saas', 'agency', 'finance', etc.
    tags: ["vendas", "marketing", "roi"],
    thumbnail: "/templates/meu-template.png", // opcional
    version: "1.0.0",
    author: {
      name: "Seu Nome",
      email: "seu@email.com",
      website: "https://seusite.com" // opcional
    },
    requiredIntegrations: ["meta_ads", "google_ads", "ga4", "payment"],
    price: 49.90, // em BRL
    isFree: false
  },

  // 2. LAYOUT
  layout: {
    cols: 12, // Grid de 12 colunas (padrão Bootstrap)
    rowHeight: 80, // Altura de cada linha em pixels
    breakpoints: { // Responsividade
      lg: 1200,
      md: 996,
      sm: 768,
      xs: 480
    }
  },

  // 3. WIDGETS
  widgets: [
    // Array de widgets (ver seção abaixo)
  ],

  // 4. CONFIGURAÇÕES GLOBAIS (opcional)
  globalFilters: {
    currency: "BRL",
    timezone: "America/Sao_Paulo"
  },
  refreshInterval: 300, // Auto-refresh a cada 5 minutos

  // 5. HOOKS (opcional)
  onInit: `
    console.log('Dashboard inicializado');
  `,
  onDataFetch: `
    function beforeFetch(config) {
      // Executado antes de buscar dados
      return config;
    }
  `,
  onDataTransform: `
    function afterFetch(rawData) {
      // Executado após buscar todos os dados
      return rawData;
    }
  `
};
```

## Tipos de Widgets

### 1. KPI Card (Métrica Única)

```typescript
{
  id: "total-revenue",
  type: "kpi",
  title: "Receita Total",
  description: "Receita total do período",
  dataSource: "payment",
  metric: "total_revenue",
  dateRange: { type: "last_30_days" },
  position: { x: 0, y: 0, w: 3, h: 2 },
  chartConfig: {
    colors: ["#10b981"]
  }
}
```

### 2. Line Chart (Tendências)

```typescript
{
  id: "revenue-trend",
  type: "line",
  title: "Evolução da Receita",
  dataSource: "payment",
  metric: "daily_revenue",
  dateRange: { type: "last_30_days" },
  position: { x: 0, y: 2, w: 8, h: 4 },
  chartConfig: {
    colors: ["#6366f1"],
    curve: "monotone", // 'linear', 'step', 'monotone'
    showLegend: true,
    showGrid: true
  }
}
```

### 3. Bar Chart (Comparações)

```typescript
{
  id: "platform-comparison",
  type: "bar",
  title: "Meta Ads vs Google Ads",
  dataSource: "custom",
  metric: "ad_comparison",
  position: { x: 0, y: 6, w: 6, h: 4 },
  chartConfig: {
    colors: ["#3b82f6", "#ef4444"],
    stacked: false
  },
  transform: `
    function transform(data) {
      return {
        labels: ['Impressões', 'Cliques', 'Conversões'],
        datasets: [
          {
            name: 'Meta Ads',
            data: [
              data.meta_ads?.impressions || 0,
              data.meta_ads?.clicks || 0,
              data.meta_ads?.purchases || 0
            ]
          },
          {
            name: 'Google Ads',
            data: [
              data.google_ads?.impressions || 0,
              data.google_ads?.clicks || 0,
              data.google_ads?.conversions || 0
            ]
          }
        ]
      };
    }
  `
}
```

### 4. Pie Chart (Distribuição)

```typescript
{
  id: "traffic-sources",
  type: "pie",
  title: "Origem do Tráfego",
  dataSource: "ga4",
  metric: "traffic_sources",
  position: { x: 8, y: 2, w: 4, h: 4 },
  chartConfig: {
    colors: ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b"]
  }
}
```

### 5. Table (Dados Tabulares)

```typescript
{
  id: "top-campaigns",
  type: "table",
  title: "Top 10 Campanhas por ROAS",
  dataSource: "custom",
  metric: "top_campaigns",
  position: { x: 0, y: 10, w: 12, h: 4 },
  transform: `
    function transform(data) {
      const campaigns = [];

      // Combinar campanhas de diferentes fontes
      if (data.meta_ads?.campaigns) {
        campaigns.push(...data.meta_ads.campaigns.map(c => ({
          name: c.name,
          platform: 'Meta Ads',
          spend: c.spend,
          revenue: c.purchase_value,
          roas: (c.purchase_value / c.spend).toFixed(2)
        })));
      }

      return campaigns
        .sort((a, b) => b.roas - a.roas)
        .slice(0, 10);
    }
  `
}
```

### 6. Funnel (Funil de Conversão)

```typescript
{
  id: "conversion-funnel",
  type: "funnel",
  title: "Funil de Conversão",
  dataSource: "ga4",
  metric: "conversion_funnel",
  position: { x: 8, y: 6, w: 4, h: 4 },
  chartConfig: {
    colors: ["#6366f1", "#8b5cf6", "#10b981"]
  }
}
```

## Fontes de Dados

### Disponíveis:

1. **`meta_ads`** - Meta Marketing API
   - Métricas: `spend`, `impressions`, `clicks`, `ctr`, `cpc`, `purchases`, `purchase_value`, `roas`

2. **`google_ads`** - Google Ads API
   - Métricas: `cost`, `impressions`, `clicks`, `ctr`, `cpc`, `conversions`, `conversion_value`, `roas`

3. **`ga4`** - Google Analytics 4
   - Métricas: `sessions`, `users`, `bounce_rate`, `avg_session_duration`, `transactions`, `revenue`, `events`

4. **`payment`** - APIs de Pagamento (Asaas, Mercado Pago)
   - Métricas: `total_revenue`, `total_orders`, `pending_payments`, `paid_payments`, `daily_revenue`

5. **`custom`** - Dados Customizados
   - Use transforms para agregar dados de múltiplas fontes

## Layout e Grid System

O sistema usa um grid de 12 colunas (similar ao Bootstrap):

```typescript
position: {
  x: 0,  // Coluna inicial (0-11)
  y: 0,  // Linha inicial
  w: 3,  // Largura em colunas (1-12)
  h: 2   // Altura em linhas
}
```

### Exemplos:

```typescript
// Widget ocupando largura total
{ x: 0, y: 0, w: 12, h: 4 }

// 3 widgets lado a lado (4 colunas cada)
{ x: 0, y: 0, w: 4, h: 2 }
{ x: 4, y: 0, w: 4, h: 2 }
{ x: 8, y: 0, w: 4, h: 2 }

// Widget pequeno no canto
{ x: 9, y: 0, w: 3, h: 2 }
```

## Transformações de Dados

Use a propriedade `transform` para manipular dados:

### Agregação Cross-Platform:

```typescript
transform: `
  function transform(data) {
    const totalSpend = (data.meta_ads?.spend || 0) + (data.google_ads?.cost || 0);
    const totalRevenue = data.payment?.total_revenue || 0;
    return totalRevenue / totalSpend; // ROAS
  }
`
```

### Formatação:

```typescript
transform: `
  function transform(data) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(data.payment?.total_revenue || 0);
  }
`
```

### Cálculos Complexos:

```typescript
transform: `
  function transform(data) {
    // Calcular ticket médio
    const revenue = data.payment?.total_revenue || 0;
    const orders = data.payment?.total_orders || 1;
    return (revenue / orders).toFixed(2);
  }
`
```

## Publicando no Marketplace

### 1. Preparar Template

```typescript
// meu-template.ts
export const meuTemplate: TemplateCode = {
  // ... configuração completa
};
```

### 2. Criar Thumbnail (opcional)

- Tamanho recomendado: 1200x630px
- Formato: PNG ou JPG
- Colocar em `/public/templates/`

### 3. Submeter via Dashboard

```typescript
// API call (será implementado na UI)
const submission: TemplateSubmission = {
  code: meuTemplate,
  readme: `
    # Meu Template Incrível

    ## O que faz
    - Análise de vendas
    - ROI de anúncios
    - Funil de conversão

    ## Integrações necessárias
    - Meta Ads
    - Google Ads
    - Google Analytics 4
  `,
  changelog: `
    ## v1.0.0
    - Versão inicial
  `
};
```

## Revenue Sharing

### Como Funciona:

- **Preço do Template**: Você define (ex: R$ 49,90)
- **Sua Parte**: 70% (R$ 34,93)
- **Plataforma**: 30% (R$ 14,97)

### Pagamentos:

- Pagos mensalmente via transferência bancária
- Mínimo para saque: R$ 50,00
- Conecte sua conta Stripe/Asaas no dashboard

### Exemplo de Ganhos:

| Vendas/Mês | Preço Template | Seu Ganho Mensal |
|------------|----------------|------------------|
| 10         | R$ 49,90       | R$ 349,30        |
| 50         | R$ 49,90       | R$ 1.746,50      |
| 100        | R$ 49,90       | R$ 3.493,00      |
| 500        | R$ 99,90       | R$ 34.965,00     |

## Melhores Práticas

### 1. Documentação

✅ Sempre inclua:
- Descrição clara do que o template faz
- Lista de integrações necessárias
- Screenshots ou demo
- Changelog de versões

### 2. Testes

✅ Antes de publicar:
- Teste com dados reais
- Verifique todos os widgets
- Teste em diferentes resoluções
- Valide transforms

### 3. Performance

✅ Otimizações:
- Use cache quando possível
- Evite transforms muito pesados
- Limite quantidade de widgets (máx 20)
- Use auto-refresh moderado (min 60s)

### 4. UX

✅ Design:
- Use cores consistentes
- Agrupe widgets relacionados
- Títulos claros e descritivos
- Loading states adequados

### 5. Manutenção

✅ Pós-publicação:
- Responda reviews
- Atualize regularmente
- Corrija bugs rapidamente
- Adicione features baseado em feedback

## Exemplos Completos

Ver templates prontos em:
- `src/templates/ecommerce-general.ts` - E-commerce completo
- `src/templates/saas-metrics.ts` - Métricas SaaS (TODO)
- `src/templates/agency-client-report.ts` - Relatório para clientes (TODO)

## Validação de Templates

Antes de publicar, seu template será validado:

```typescript
interface TemplateValidationResult {
  isValid: boolean;
  errors: string[];    // Erros críticos (bloqueiam publicação)
  warnings: string[];  // Avisos (não bloqueiam)
}
```

### Validações Automáticas:

✅ Metadata completo
✅ Pelo menos 1 widget
✅ Posições válidas (não sobrepostas)
✅ Integrações válidas
✅ Transforms sem erros de sintaxe
✅ Preço entre R$ 0 e R$ 999,90

## Suporte

Precisa de ajuda? Entre em contato:
- Email: templates@dashboardsaas.com.br
- Discord: [Link do servidor] (TODO)
- Documentação completa: https://docs.dashboardsaas.com.br (TODO)

---

**Boa sorte com seus templates! 🚀**
