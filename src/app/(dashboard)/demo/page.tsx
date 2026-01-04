"use client";

import { KPIWidget, LineChartWidget, BarChartWidget } from "@/components/dashboard/widgets";
import { TrendingUp, DollarSign, ShoppingCart, Users } from "lucide-react";

export default function DemoPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard de Demonstração</h1>
        <p className="text-muted-foreground mt-1">
          Visualização completa com dados mockados - Pronto para usar dados reais!
        </p>
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>💡 Modo Mock Ativo:</strong> Os dados exibidos são simulados.
            Para usar dados reais, configure as APIs no arquivo <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">/src/lib/config.ts</code>
            e altere <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">USE_MOCK_DATA</code> para <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">false</code>.
          </p>
        </div>
      </div>

      {/* Row 1: KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPIWidget
          title="Receita Total"
          dataSource="payment"
          metric="total_revenue"
          format="currency"
          icon={<DollarSign className="h-4 w-4 text-green-600" />}
          color="#10b981"
        />
        <KPIWidget
          title="Pedidos"
          dataSource="payment"
          metric="total_orders"
          format="number"
          icon={<ShoppingCart className="h-4 w-4 text-blue-600" />}
          color="#3b82f6"
        />
        <KPIWidget
          title="Investimento Ads"
          dataSource="meta_ads"
          metric="spend"
          format="currency"
          icon={<TrendingUp className="h-4 w-4 text-orange-600" />}
          color="#f59e0b"
        />
        <KPIWidget
          title="ROAS Meta Ads"
          dataSource="meta_ads"
          metric="roas"
          format="number"
          icon={<TrendingUp className="h-4 w-4 text-purple-600" />}
          color="#8b5cf6"
        />
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <LineChartWidget
          title="Evolução da Receita (Últimos 30 dias)"
          dataSource="payment"
          metric="daily"
          color="#10b981"
          height={300}
        />
        <LineChartWidget
          title="Investimento Meta Ads (Últimos 30 dias)"
          dataSource="meta_ads"
          metric="daily"
          color="#3b82f6"
          height={300}
        />
      </div>

      {/* Row 3: More KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <KPIWidget
          title="Usuários (GA4)"
          dataSource="ga4"
          metric="users"
          format="number"
          icon={<Users className="h-4 w-4 text-indigo-600" />}
          color="#6366f1"
        />
        <KPIWidget
          title="Transações (GA4)"
          dataSource="ga4"
          metric="transactions"
          format="number"
          color="#ec4899"
        />
        <KPIWidget
          title="Taxa de Rejeição"
          dataSource="ga4"
          metric="bounce_rate"
          format="percentage"
          color="#f59e0b"
        />
      </div>

      {/* Row 4: More Charts */}
      <div className="grid grid-cols-1 gap-6">
        <BarChartWidget
          title="Fontes de Tráfego (GA4)"
          dataSource="ga4"
          metric="traffic_sources"
          colors={["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]}
          height={300}
        />
      </div>

      {/* Instructions */}
      <div className="mt-8 p-6 bg-muted rounded-lg">
        <h3 className="font-semibold mb-3">📚 Como Funciona</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>1. Dados Mockados:</strong> Todos os widgets estão usando dados simulados realistas.
          </p>
          <p>
            <strong>2. Trocar para Dados Reais:</strong>
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Configure as credenciais das APIs no arquivo <code className="bg-muted-foreground/10 px-1 rounded">.env</code></li>
            <li>Implemente os métodos <code className="bg-muted-foreground/10 px-1 rounded">fetchRealData()</code> nos providers em <code className="bg-muted-foreground/10 px-1 rounded">/src/lib/data-providers/</code></li>
            <li>Altere <code className="bg-muted-foreground/10 px-1 rounded">USE_MOCK_DATA</code> para <code className="bg-muted-foreground/10 px-1 rounded">false</code> em <code className="bg-muted-foreground/10 px-1 rounded">/src/lib/config.ts</code></li>
          </ul>
          <p>
            <strong>3. Widgets Disponíveis:</strong> KPI Cards, Line Charts, Bar Charts (mais em breve)
          </p>
          <p>
            <strong>4. Próximo Passo:</strong> Editor drag & drop para criar dashboards personalizados
          </p>
        </div>
      </div>
    </div>
  );
}
