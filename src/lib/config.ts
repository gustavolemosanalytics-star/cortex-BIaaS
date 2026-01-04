/**
 * Feature Flags e Configurações
 *
 * Para alternar entre dados mockados e reais:
 * 1. Altere USE_MOCK_DATA para false
 * 2. Configure as credenciais das APIs no .env
 * 3. Implemente os métodos reais nos data providers
 */

export const config = {
  // ⚠️ IMPORTANTE: Altere para false quando tiver APIs reais configuradas
  USE_MOCK_DATA: true,

  // Configurações de cache
  CACHE_TTL: 5 * 60, // 5 minutos em segundos

  // Auto-refresh padrão (em segundos)
  DEFAULT_REFRESH_INTERVAL: 300, // 5 minutos

  // Limites
  MAX_WIDGETS_PER_DASHBOARD: 20,
  MAX_DASHBOARDS_FREE: 3,

  // Integrações disponíveis
  AVAILABLE_INTEGRATIONS: [
    {
      id: 'meta_ads',
      name: 'Meta Ads',
      description: 'Facebook & Instagram Ads',
      icon: '📘',
      authType: 'oauth',
      isEnabled: true,
      useMock: true, // Altere para false quando configurar a API real
    },
    {
      id: 'google_ads',
      name: 'Google Ads',
      description: 'Google Ads Campaigns',
      icon: '🔍',
      authType: 'oauth',
      isEnabled: true,
      useMock: true,
    },
    {
      id: 'ga4',
      name: 'Google Analytics 4',
      description: 'Website Analytics',
      icon: '📊',
      authType: 'oauth',
      isEnabled: true,
      useMock: true,
    },
    {
      id: 'payment',
      name: 'Pagamentos',
      description: 'Asaas, Mercado Pago',
      icon: '💳',
      authType: 'api_key',
      isEnabled: true,
      useMock: true,
    },
  ] as const,
};

export type IntegrationId = typeof config.AVAILABLE_INTEGRATIONS[number]['id'];

// Helper para verificar se deve usar mock
export const shouldUseMock = (integrationId?: IntegrationId): boolean => {
  if (!integrationId) return config.USE_MOCK_DATA;

  const integration = config.AVAILABLE_INTEGRATIONS.find(i => i.id === integrationId);
  return integration?.useMock ?? config.USE_MOCK_DATA;
};
