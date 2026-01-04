/**
 * Data Provider Factory
 *
 * Centraliza acesso a todos os provedores de dados.
 * Alterna automaticamente entre mock e real baseado em config.
 */

import { shouldUseMock, type IntegrationId } from '../config';
import { MetaAdsProvider } from './meta-ads-provider';
import { BaseDataProvider } from './base-provider';
import { mockGoogleAdsData, mockGA4Data, mockPaymentData, getMockAggregatedData } from '../mock-data';

// Providers simplificados (seguem mesmo padrão do MetaAdsProvider)
class GoogleAdsProvider extends BaseDataProvider {
  async fetchData(metric: string) {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 250));
      const data = metric === 'summary' ? mockGoogleAdsData.summary :
                   metric === 'daily' ? mockGoogleAdsData.daily :
                   metric === 'campaigns' ? mockGoogleAdsData.campaigns :
                   mockGoogleAdsData.summary[metric as keyof typeof mockGoogleAdsData.summary] ?? mockGoogleAdsData;
      return this.createResponse(data, 'mock');
    }
    throw new Error('Google Ads API não configurada');
  }

  async validateConnection() {
    return this.useMock;
  }
}

class GA4Provider extends BaseDataProvider {
  async fetchData(metric: string) {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const data = metric === 'summary' ? mockGA4Data.summary :
                   metric === 'daily' ? mockGA4Data.daily :
                   metric === 'traffic_sources' ? mockGA4Data.traffic_sources :
                   metric === 'top_pages' ? mockGA4Data.top_pages :
                   mockGA4Data.summary[metric as keyof typeof mockGA4Data.summary] ?? mockGA4Data;
      return this.createResponse(data, 'mock');
    }
    throw new Error('GA4 API não configurada');
  }

  async validateConnection() {
    return this.useMock;
  }
}

class PaymentProvider extends BaseDataProvider {
  async fetchData(metric: string) {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 150));
      const data = metric === 'summary' ? mockPaymentData.summary :
                   metric === 'daily' ? mockPaymentData.daily :
                   metric === 'payment_methods' ? mockPaymentData.payment_methods :
                   metric === 'recent_transactions' ? mockPaymentData.recent_transactions :
                   metric === 'total_revenue' ? mockPaymentData.summary.total_revenue :
                   metric === 'total_orders' ? mockPaymentData.summary.total_orders :
                   mockPaymentData.summary[metric as keyof typeof mockPaymentData.summary] ?? mockPaymentData;
      return this.createResponse(data, 'mock');
    }
    throw new Error('Payment API não configurada');
  }

  async validateConnection() {
    return this.useMock;
  }
}

// Factory para criar providers
export class DataProviderFactory {
  private static providers: Map<string, BaseDataProvider> = new Map();

  static getProvider(source: IntegrationId): BaseDataProvider {
    const useMock = shouldUseMock(source);

    // Cache de providers
    const key = `${source}_${useMock ? 'mock' : 'real'}`;
    if (this.providers.has(key)) {
      return this.providers.get(key)!;
    }

    let provider: BaseDataProvider;

    switch (source) {
      case 'meta_ads':
        provider = new MetaAdsProvider(useMock);
        break;
      case 'google_ads':
        provider = new GoogleAdsProvider(useMock);
        break;
      case 'ga4':
        provider = new GA4Provider(useMock);
        break;
      case 'payment':
        provider = new PaymentProvider(useMock);
        break;
      default:
        throw new Error(`Provider desconhecido: ${source}`);
    }

    this.providers.set(key, provider);
    return provider;
  }

  /**
   * Fetch data de qualquer fonte
   */
  static async fetchData(
    source: IntegrationId,
    metric: string,
    dateRange?: any,
    options?: any
  ) {
    const provider = this.getProvider(source);
    return provider.fetchData(metric, dateRange, options);
  }

  /**
   * Fetch agregado cross-platform
   */
  static async fetchAggregatedData() {
    const useMock = shouldUseMock();

    if (useMock) {
      // Retornar dados mockados agregados
      await new Promise(resolve => setTimeout(resolve, 400));
      return {
        data: getMockAggregatedData(),
        cached: false,
        timestamp: new Date().toISOString(),
        source: 'mock' as const,
      };
    }

    // TODO: Implementar agregação real
    throw new Error('Agregação real não implementada');
  }
}

// Exports
export * from './base-provider';
export * from './meta-ads-provider';
