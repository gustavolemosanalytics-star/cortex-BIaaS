/**
 * Meta Ads Data Provider
 *
 * MOCK: Retorna dados simulados
 * REAL: Conecta com Meta Marketing API
 *
 * Para ativar dados reais:
 * 1. Configure META_APP_ID e META_APP_SECRET no .env
 * 2. Implemente o método fetchRealData()
 * 3. Altere useMock para false em config.ts
 */

import { BaseDataProvider, DateRange, DataProviderResponse } from './base-provider';
import { mockMetaAdsData } from '../mock-data';

export class MetaAdsProvider extends BaseDataProvider {
  async fetchData(
    metric: string,
    dateRange: DateRange,
    options?: Record<string, any>
  ): Promise<DataProviderResponse> {
    if (this.useMock) {
      return this.fetchMockData(metric, dateRange, options);
    }

    return this.fetchRealData(metric, dateRange, options);
  }

  async validateConnection(): Promise<boolean> {
    if (this.useMock) return true;

    // TODO: Implementar validação real
    try {
      // const response = await fetch('https://graph.facebook.com/v18.0/me', {
      //   headers: {
      //     'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`
      //   }
      // });
      // return response.ok;
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * MOCK DATA
   */
  private async fetchMockData(
    metric: string,
    dateRange: DateRange,
    options?: Record<string, any>
  ): Promise<DataProviderResponse> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 300));

    let data;

    switch (metric) {
      case 'summary':
        data = mockMetaAdsData.summary;
        break;
      case 'daily':
      case 'daily_data':
        data = mockMetaAdsData.daily;
        break;
      case 'campaigns':
        data = mockMetaAdsData.campaigns;
        break;
      case 'spend':
        data = mockMetaAdsData.summary.spend;
        break;
      case 'impressions':
        data = mockMetaAdsData.summary.impressions;
        break;
      case 'clicks':
        data = mockMetaAdsData.summary.clicks;
        break;
      case 'purchases':
        data = mockMetaAdsData.summary.purchases;
        break;
      case 'roas':
        data = mockMetaAdsData.summary.roas;
        break;
      default:
        data = mockMetaAdsData;
    }

    return this.createResponse(data, 'mock');
  }

  /**
   * REAL DATA - Implementar quando configurar Meta Marketing API
   */
  private async fetchRealData(
    metric: string,
    dateRange: DateRange,
    options?: Record<string, any>
  ): Promise<DataProviderResponse> {
    /*
     * IMPLEMENTAÇÃO REAL:
     *
     * 1. Obter access token do banco de dados (tabela Integration)
     * 2. Fazer request para Meta Marketing API
     * 3. Processar e normalizar dados
     * 4. Retornar no formato esperado
     *
     * Exemplo:
     *
     * const accessToken = await getAccessToken('meta_ads');
     * const accountId = options?.accountId;
     *
     * const response = await fetch(
     *   `https://graph.facebook.com/v18.0/act_${accountId}/insights?` +
     *   `fields=spend,impressions,clicks,purchases,purchase_value&` +
     *   `time_range=${JSON.stringify({since: dateRange.startDate, until: dateRange.endDate})}&` +
     *   `access_token=${accessToken}`
     * );
     *
     * const data = await response.json();
     *
     * // Normalizar dados
     * const normalized = {
     *   summary: {
     *     spend: parseFloat(data.spend),
     *     impressions: parseInt(data.impressions),
     *     // ... etc
     *   }
     * };
     *
     * return this.createResponse(normalized, 'real');
     */

    throw new Error(
      'Meta Ads API não configurada. ' +
      'Configure META_APP_ID e META_APP_SECRET no .env e implemente fetchRealData()'
    );
  }
}
