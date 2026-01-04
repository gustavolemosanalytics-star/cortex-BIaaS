import { TemplateCode } from "@/types/template";

/**
 * E-commerce General Dashboard Template
 *
 * A comprehensive dashboard for e-commerce businesses tracking:
 * - Revenue metrics (daily, weekly, monthly)
 * - Ad performance (Meta Ads + Google Ads)
 * - Conversion funnel (GA4)
 * - Payment metrics
 * - ROI and ROAS
 */
export const ecommerceGeneralTemplate: TemplateCode = {
  metadata: {
    name: "E-commerce Performance Dashboard",
    description:
      "Visão completa do seu e-commerce: vendas, anúncios, conversões e ROI em um só lugar. Ideal para lojas online que anunciam no Meta Ads e Google Ads.",
    category: "ecommerce",
    tags: ["e-commerce", "vendas", "meta-ads", "google-ads", "conversão", "roi"],
    thumbnail: "/templates/ecommerce-general.png",
    version: "1.0.0",
    author: {
      name: "Dashboard SaaS Team",
      email: "templates@dashboardsaas.com.br",
      website: "https://dashboardsaas.com.br",
    },
    requiredIntegrations: ["meta_ads", "google_ads", "ga4", "payment"],
    price: 0,
    isFree: true,
  },

  layout: {
    cols: 12,
    rowHeight: 80,
    breakpoints: {
      lg: 1200,
      md: 996,
      sm: 768,
      xs: 480,
    },
  },

  globalFilters: {
    currency: "BRL",
  },

  refreshInterval: 300, // 5 minutes auto-refresh

  widgets: [
    // ROW 1: Main KPIs
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
        colors: ["#10b981"],
      },
    },
    {
      id: "total-orders",
      type: "kpi",
      title: "Pedidos",
      description: "Total de pedidos realizados",
      dataSource: "payment",
      metric: "total_orders",
      dateRange: { type: "last_30_days" },
      position: { x: 3, y: 0, w: 3, h: 2 },
      chartConfig: {
        colors: ["#6366f1"],
      },
    },
    {
      id: "ad-spend",
      type: "kpi",
      title: "Investimento em Anúncios",
      description: "Total investido em Meta Ads + Google Ads",
      dataSource: "custom",
      metric: "total_ad_spend",
      dateRange: { type: "last_30_days" },
      position: { x: 6, y: 0, w: 3, h: 2 },
      chartConfig: {
        colors: ["#f59e0b"],
      },
      transform: `
        // Aggregate Meta Ads + Google Ads spend
        function transform(data) {
          const metaSpend = data.meta_ads?.spend || 0;
          const googleSpend = data.google_ads?.cost || 0;
          return metaSpend + googleSpend;
        }
      `,
    },
    {
      id: "roas",
      type: "kpi",
      title: "ROAS",
      description: "Return on Ad Spend (Retorno sobre investimento em anúncios)",
      dataSource: "custom",
      metric: "roas",
      dateRange: { type: "last_30_days" },
      position: { x: 9, y: 0, w: 3, h: 2 },
      chartConfig: {
        colors: ["#8b5cf6"],
      },
      transform: `
        // Calculate ROAS: Revenue / Ad Spend
        function transform(data) {
          const revenue = data.payment?.total_revenue || 0;
          const adSpend = (data.meta_ads?.spend || 0) + (data.google_ads?.cost || 0);
          return adSpend > 0 ? (revenue / adSpend).toFixed(2) : 0;
        }
      `,
    },

    // ROW 2: Revenue Trend
    {
      id: "revenue-trend",
      type: "line",
      title: "Evolução da Receita",
      description: "Receita diária nos últimos 30 dias",
      dataSource: "payment",
      metric: "daily_revenue",
      dateRange: { type: "last_30_days" },
      position: { x: 0, y: 2, w: 8, h: 4 },
      chartConfig: {
        colors: ["#10b981"],
        showLegend: true,
        showGrid: true,
        curve: "monotone",
      },
    },
    {
      id: "conversion-funnel",
      type: "funnel",
      title: "Funil de Conversão",
      description: "Jornada do visitante até a compra",
      dataSource: "ga4",
      metric: "conversion_funnel",
      dateRange: { type: "last_30_days" },
      position: { x: 8, y: 2, w: 4, h: 4 },
      chartConfig: {
        colors: ["#6366f1", "#8b5cf6", "#10b981"],
      },
    },

    // ROW 3: Ad Performance
    {
      id: "ad-performance-comparison",
      type: "bar",
      title: "Performance de Anúncios: Meta vs Google",
      description: "Comparação de métricas entre plataformas",
      dataSource: "custom",
      metric: "ad_comparison",
      dateRange: { type: "last_30_days" },
      position: { x: 0, y: 6, w: 6, h: 4 },
      chartConfig: {
        colors: ["#3b82f6", "#ef4444"],
        showLegend: true,
        showGrid: true,
        stacked: false,
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
      `,
    },
    {
      id: "ctr-cpc-metrics",
      type: "area",
      title: "CTR e CPC ao Longo do Tempo",
      description: "Evolução do CTR e CPC agregado",
      dataSource: "custom",
      metric: "ctr_cpc_trend",
      dateRange: { type: "last_30_days" },
      position: { x: 6, y: 6, w: 6, h: 4 },
      chartConfig: {
        colors: ["#10b981", "#f59e0b"],
        showLegend: true,
        showGrid: true,
        curve: "monotone",
      },
    },

    // ROW 4: Detailed Tables
    {
      id: "top-campaigns",
      type: "table",
      title: "Top 10 Campanhas",
      description: "Campanhas com melhor desempenho (ordenado por ROAS)",
      dataSource: "custom",
      metric: "top_campaigns",
      dateRange: { type: "last_30_days" },
      position: { x: 0, y: 10, w: 12, h: 4 },
      transform: `
        function transform(data) {
          // Combine Meta Ads and Google Ads campaigns
          const campaigns = [];

          if (data.meta_ads?.campaigns) {
            campaigns.push(...data.meta_ads.campaigns.map(c => ({
              name: c.name,
              platform: 'Meta Ads',
              spend: c.spend,
              revenue: c.purchase_value,
              roas: c.purchase_value / c.spend,
              conversions: c.purchases
            })));
          }

          if (data.google_ads?.campaigns) {
            campaigns.push(...data.google_ads.campaigns.map(c => ({
              name: c.name,
              platform: 'Google Ads',
              spend: c.cost,
              revenue: c.conversion_value,
              roas: c.conversion_value / c.cost,
              conversions: c.conversions
            })));
          }

          return campaigns
            .sort((a, b) => b.roas - a.roas)
            .slice(0, 10);
        }
      `,
    },
  ],

  onInit: `
    // Initialize dashboard
    console.log('E-commerce Dashboard initialized');
  `,

  onDataFetch: `
    // Before fetching data
    function beforeFetch(config) {
      // Add any custom headers or parameters
      return config;
    }
  `,

  onDataTransform: `
    // After fetching all data, before passing to widgets
    function afterFetch(rawData) {
      // Normalize data structure
      return {
        ...rawData,
        timestamp: new Date().toISOString()
      };
    }
  `,
};

export default ecommerceGeneralTemplate;
