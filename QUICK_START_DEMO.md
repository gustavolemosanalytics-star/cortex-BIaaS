# ⚡ Quick Start - Testar Widgets Agora!

Guia super rápido para ver os widgets funcionando em 2 minutos.

## 🚀 Passos Rápidos

### 1. Instalar Dependências (se ainda não fez)

```bash
npm install
```

### 2. Configurar Banco (se ainda não fez)

```bash
# Copiar .env
cp .env.example .env

# Adicionar sua DATABASE_URL e NEXTAUTH_SECRET no .env

# Criar tabelas
npx prisma db push
```

### 3. Iniciar Servidor

```bash
npm run dev
```

### 4. Acessar Demo

Abra no browser:

```
http://localhost:3000/demo
```

## 🎉 Pronto!

Você verá:

- ✅ 7 KPI cards funcionando
- ✅ 2 Line charts animados
- ✅ 1 Bar chart
- ✅ Todos com dados mockados realistas
- ✅ Loading states
- ✅ Formatação brasileira (R$, pontos, vírgulas)

---

## 🔄 Alternar entre Mock e Real

### Ver dados MOCK (padrão):

Nada a fazer! Já está ativo.

### Usar dados REAIS:

1. Edite `/src/lib/config.ts`
2. Mude `USE_MOCK_DATA: false`
3. Implemente APIs reais (veja [MOCK_TO_REAL_GUIDE.md](./MOCK_TO_REAL_GUIDE.md))

---

## 📊 Widgets Disponíveis

### KPI Widget

```tsx
import { KPIWidget } from "@/components/dashboard/widgets";

<KPIWidget
  title="Receita Total"
  dataSource="payment"      // meta_ads, google_ads, ga4, payment
  metric="total_revenue"    // métrica específica
  format="currency"         // currency, number, percentage
  color="#10b981"          // cor customizada
/>
```

### Line Chart

```tsx
import { LineChartWidget } from "@/components/dashboard/widgets";

<LineChartWidget
  title="Evolução da Receita"
  dataSource="payment"
  metric="daily"
  color="#6366f1"
  height={300}
/>
```

### Bar Chart

```tsx
import { BarChartWidget } from "@/components/dashboard/widgets";

<BarChartWidget
  title="Comparação"
  dataSource="ga4"
  metric="traffic_sources"
  colors={["#6366f1", "#8b5cf6"]}
  height={300}
/>
```

---

## 🎯 Dados Disponíveis (Mock)

### Meta Ads (`dataSource="meta_ads"`)

**Métricas**:
- `summary` - Todas as métricas agregadas
- `daily` - Dados diários (30 dias)
- `campaigns` - Lista de campanhas
- `spend` - Investimento total
- `impressions` - Impressões totais
- `clicks` - Cliques totais
- `purchases` - Conversões
- `roas` - Return on Ad Spend

### Google Ads (`dataSource="google_ads"`)

**Métricas**:
- `summary` - Resumo
- `daily` - Diário
- `campaigns` - Campanhas
- `cost` - Custo total
- `conversions` - Conversões
- `roas` - ROAS

### GA4 (`dataSource="ga4"`)

**Métricas**:
- `summary` - Resumo
- `daily` - Diário
- `traffic_sources` - Fontes de tráfego
- `top_pages` - Páginas mais visitadas
- `users` - Usuários totais
- `sessions` - Sessões
- `transactions` - Transações
- `bounce_rate` - Taxa de rejeição

### Payments (`dataSource="payment"`)

**Métricas**:
- `summary` - Resumo
- `daily` - Receita diária
- `payment_methods` - Métodos de pagamento
- `recent_transactions` - Transações recentes
- `total_revenue` - Receita total
- `total_orders` - Total de pedidos

---

## 🐛 Problemas Comuns

### "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install
```

### "Database connection failed"

Verifique se o `DATABASE_URL` está correto no `.env`

### Widgets não carregam

Abra DevTools (F12) e veja erros no console

---

## 📖 Documentação Completa

- [README.md](./README.md) - Visão geral
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Setup completo
- [MOCK_TO_REAL_GUIDE.md](./MOCK_TO_REAL_GUIDE.md) - Como usar dados reais
- [WHATS_NEW.md](./WHATS_NEW.md) - Novas funcionalidades

---

## 🎨 Customizar Widgets

### Mudar cores:

```tsx
<KPIWidget
  // ... props
  color="#ff6b6b"  // vermelho
/>

<LineChartWidget
  // ... props
  color="#4ecdc4"  // turquesa
/>
```

### Mudar formato:

```tsx
<KPIWidget
  // ... props
  format="currency"    // R$ 1.234,56
  format="number"      // 1.234
  format="percentage"  // 12,34%
/>
```

### Altura dos gráficos:

```tsx
<LineChartWidget
  // ... props
  height={400}  // padrão é 300
/>
```

---

## 💡 Dicas

1. **Performance**: Os dados mockados têm delay artificial de ~200-400ms para simular API real

2. **Cache**: Quando usar dados reais, implemente cache para evitar rate limits

3. **Debugging**: Veja a propriedade `source` na response da API:
   - `"mock"` = dados simulados
   - `"real"` = dados reais das APIs

4. **Customização**: Todos os widgets são componentes React normais - customize à vontade!

---

## 🚀 Próximo Passo

Depois de testar a demo, veja como criar seus próprios dashboards:

1. **Página de Dashboards**: http://localhost:3000/dashboards
2. **Criar novo dashboard**: Clique em "Novo Dashboard"
3. **Adicionar widgets**: (em breve - editor drag & drop)

---

**Divirta-se testando! 🎉**

Se tiver dúvidas, veja a [documentação completa](./README.md).
