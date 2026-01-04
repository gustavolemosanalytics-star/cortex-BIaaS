/**
 * Base Data Provider
 *
 * Interface base para todos os provedores de dados.
 * Implementações devem ter versão mock e real.
 */

export interface DateRange {
  type: 'last_7_days' | 'last_30_days' | 'last_90_days' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface DataProviderResponse<T = any> {
  data: T;
  cached: boolean;
  timestamp: string;
  source: 'mock' | 'real';
}

export abstract class BaseDataProvider {
  protected useMock: boolean;

  constructor(useMock: boolean = true) {
    this.useMock = useMock;
  }

  /**
   * Fetch data (implementação abstrata)
   */
  abstract fetchData(
    metric: string,
    dateRange: DateRange,
    options?: Record<string, any>
  ): Promise<DataProviderResponse>;

  /**
   * Validate connection
   */
  abstract validateConnection(): Promise<boolean>;

  /**
   * Helper para criar response
   */
  protected createResponse<T>(data: T, source: 'mock' | 'real' = 'mock'): DataProviderResponse<T> {
    return {
      data,
      cached: false,
      timestamp: new Date().toISOString(),
      source,
    };
  }
}
