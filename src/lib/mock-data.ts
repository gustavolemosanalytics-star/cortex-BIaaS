/**
 * Mock Data Generators
 *
 * Gera dados realistas para desenvolvimento e testes.
 * Quando as APIs reais estiverem configuradas, este arquivo não será mais usado.
 */

import { format, subDays } from 'date-fns';

// Helper para gerar dados diários
const generateDailyData = (days: number, baseValue: number, variance: number = 0.3) => {
  return Array.from({ length: days }, (_, i) => {
    const date = format(subDays(new Date(), days - i - 1), 'yyyy-MM-dd');
    const randomFactor = 1 + (Math.random() - 0.5) * variance;
    const value = Math.round(baseValue * randomFactor);
    return { date, value };
  });
};

// Mock Data: Meta Ads
export const mockMetaAdsData = {
  summary: {
    spend: 15430.50,
    impressions: 487520,
    clicks: 12340,
    ctr: 2.53,
    cpc: 1.25,
    purchases: 342,
    purchase_value: 68925.80,
    roas: 4.47,
  },
  daily: generateDailyData(30, 500, 0.4).map(d => ({
    date: d.date,
    spend: d.value,
    impressions: d.value * 32,
    clicks: Math.round(d.value * 0.8),
    purchases: Math.round(d.value * 0.02),
    purchase_value: d.value * 4.2,
  })),
  campaigns: [
    {
      id: '1',
      name: 'Black Friday 2024',
      spend: 5200.00,
      impressions: 165000,
      clicks: 4120,
      ctr: 2.50,
      purchases: 125,
      purchase_value: 28500.00,
      roas: 5.48,
      status: 'active',
    },
    {
      id: '2',
      name: 'Retargeting Q1',
      spend: 3850.00,
      impressions: 98000,
      clicks: 2940,
      ctr: 3.00,
      purchases: 87,
      purchase_value: 19580.00,
      roas: 5.09,
      status: 'active',
    },
    {
      id: '3',
      name: 'Lookalike Audience',
      spend: 4100.00,
      impressions: 142000,
      clicks: 3280,
      ctr: 2.31,
      purchases: 95,
      purchase_value: 15245.00,
      roas: 3.72,
      status: 'active',
    },
    {
      id: '4',
      name: 'Instagram Stories',
      spend: 2280.50,
      impressions: 82520,
      clicks: 2000,
      ctr: 2.42,
      purchases: 35,
      purchase_value: 5600.80,
      roas: 2.46,
      status: 'paused',
    },
  ],
};

// Mock Data: Google Ads
export const mockGoogleAdsData = {
  summary: {
    cost: 12890.00,
    impressions: 625400,
    clicks: 18750,
    ctr: 3.00,
    cpc: 0.69,
    conversions: 285,
    conversion_value: 62480.00,
    roas: 4.85,
  },
  daily: generateDailyData(30, 430, 0.35).map(d => ({
    date: d.date,
    cost: d.value,
    impressions: d.value * 48,
    clicks: Math.round(d.value * 1.4),
    conversions: Math.round(d.value * 0.022),
    conversion_value: d.value * 4.8,
  })),
  campaigns: [
    {
      id: '1',
      name: 'Search - Branded',
      cost: 4200.00,
      impressions: 215000,
      clicks: 6450,
      ctr: 3.00,
      conversions: 98,
      conversion_value: 21560.00,
      roas: 5.13,
      status: 'active',
    },
    {
      id: '2',
      name: 'Search - Generic',
      cost: 5100.00,
      impressions: 285000,
      clicks: 8550,
      ctr: 3.00,
      conversions: 115,
      conversion_value: 25300.00,
      roas: 4.96,
      status: 'active',
    },
    {
      id: '3',
      name: 'Display Network',
      cost: 2390.00,
      impressions: 98400,
      clicks: 2952,
      ctr: 3.00,
      conversions: 52,
      conversion_value: 11420.00,
      roas: 4.78,
      status: 'active',
    },
    {
      id: '4',
      name: 'Shopping Campaigns',
      cost: 1200.00,
      impressions: 27000,
      clicks: 798,
      ctr: 2.96,
      conversions: 20,
      conversion_value: 4200.00,
      roas: 3.50,
      status: 'active',
    },
  ],
};

// Mock Data: Google Analytics 4
export const mockGA4Data = {
  summary: {
    sessions: 45280,
    users: 32140,
    bounce_rate: 42.5,
    avg_session_duration: 185, // seconds
    transactions: 627,
    revenue: 131405.80,
    events: 285420,
  },
  daily: generateDailyData(30, 1510, 0.3).map(d => ({
    date: d.date,
    sessions: d.value,
    users: Math.round(d.value * 0.71),
    transactions: Math.round(d.value * 0.014),
    revenue: d.value * 87,
  })),
  traffic_sources: [
    { source: 'Direct', sessions: 12580, percentage: 27.8 },
    { source: 'Organic Search', sessions: 11320, percentage: 25.0 },
    { source: 'Paid Search', sessions: 9960, percentage: 22.0 },
    { source: 'Social', sessions: 7240, percentage: 16.0 },
    { source: 'Referral', sessions: 4180, percentage: 9.2 },
  ],
  top_pages: [
    { page: '/', views: 18540, avg_time: 42 },
    { page: '/produtos', views: 12840, avg_time: 125 },
    { page: '/produto/camisa-basica', views: 8420, avg_time: 89 },
    { page: '/carrinho', views: 6250, avg_time: 156 },
    { page: '/checkout', views: 3840, avg_time: 235 },
  ],
};

// Mock Data: Payments
export const mockPaymentData = {
  summary: {
    total_revenue: 131405.80,
    total_orders: 627,
    avg_ticket: 209.58,
    pending_payments: 12,
    paid_payments: 615,
    failed_payments: 18,
  },
  daily: generateDailyData(30, 4380, 0.35).map(d => ({
    date: d.date,
    revenue: d.value,
    orders: Math.round(d.value / 210),
    pending: Math.round(Math.random() * 3),
    paid: Math.round(d.value / 210) - Math.round(Math.random() * 3),
  })),
  payment_methods: [
    { method: 'Pix', count: 342, revenue: 71820.00, percentage: 54.7 },
    { method: 'Cartão de Crédito', count: 245, revenue: 51345.80, percentage: 39.1 },
    { method: 'Boleto', count: 40, revenue: 8240.00, percentage: 6.2 },
  ],
  recent_transactions: [
    {
      id: 'TXN001',
      date: new Date().toISOString(),
      amount: 459.90,
      method: 'Pix',
      status: 'paid',
      customer: 'João Silva',
    },
    {
      id: 'TXN002',
      date: new Date(Date.now() - 3600000).toISOString(),
      amount: 189.90,
      method: 'Cartão de Crédito',
      status: 'paid',
      customer: 'Maria Santos',
    },
    {
      id: 'TXN003',
      date: new Date(Date.now() - 7200000).toISOString(),
      amount: 299.90,
      method: 'Pix',
      status: 'paid',
      customer: 'Pedro Oliveira',
    },
    {
      id: 'TXN004',
      date: new Date(Date.now() - 10800000).toISOString(),
      amount: 129.90,
      method: 'Boleto',
      status: 'pending',
      customer: 'Ana Costa',
    },
  ],
};

// Função para obter mock data por fonte
export const getMockData = (source: string, metric?: string) => {
  const dataMap: Record<string, any> = {
    meta_ads: mockMetaAdsData,
    google_ads: mockGoogleAdsData,
    ga4: mockGA4Data,
    payment: mockPaymentData,
  };

  const data = dataMap[source];
  if (!data) return null;

  // Se métrica específica for solicitada
  if (metric) {
    return data.summary?.[metric] ?? data[metric] ?? null;
  }

  return data;
};

// Função para agregar dados cross-platform
export const getMockAggregatedData = () => {
  const totalAdSpend = mockMetaAdsData.summary.spend + mockGoogleAdsData.summary.cost;
  const totalRevenue = mockPaymentData.summary.total_revenue;
  const totalConversions = mockMetaAdsData.summary.purchases + mockGoogleAdsData.summary.conversions;

  return {
    total_ad_spend: totalAdSpend,
    total_revenue: totalRevenue,
    total_conversions: totalConversions,
    overall_roas: totalRevenue / totalAdSpend,
    avg_cpa: totalAdSpend / totalConversions,
    meta_ads: mockMetaAdsData,
    google_ads: mockGoogleAdsData,
    ga4: mockGA4Data,
    payment: mockPaymentData,
  };
};
