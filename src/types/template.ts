/**
 * Template System Types
 *
 * Developers can create custom dashboard templates using JavaScript/TypeScript
 * Templates define widget configurations, layouts, and data transformations
 */

export type WidgetType =
  | "kpi"
  | "line"
  | "bar"
  | "pie"
  | "table"
  | "funnel"
  | "area"
  | "scatter"
  | "heatmap";

export type DataSource =
  | "meta_ads"
  | "google_ads"
  | "ga4"
  | "payment"
  | "custom";

export interface WidgetPosition {
  x: number;
  y: number;
  w: number; // width in grid columns
  h: number; // height in grid rows
}

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;

  // Data configuration
  dataSource: DataSource;
  metric: string;
  dimensions?: string[];
  filters?: Record<string, any>;

  // Date range
  dateRange?: {
    type: "last_7_days" | "last_30_days" | "last_90_days" | "custom";
    startDate?: string;
    endDate?: string;
  };

  // Chart-specific config
  chartConfig?: {
    colors?: string[];
    showLegend?: boolean;
    showGrid?: boolean;
    curve?: "linear" | "monotone" | "step";
    stacked?: boolean;
    // Add more chart options as needed
  };

  // Custom transformation function (as string, will be eval'd safely)
  transform?: string;

  // Position in grid
  position: WidgetPosition;
}

export interface TemplateMetadata {
  name: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail?: string;
  version: string;
  author: {
    name: string;
    email?: string;
    website?: string;
  };

  // Required integrations
  requiredIntegrations: DataSource[];

  // Pricing
  price: number; // in BRL
  isFree: boolean;
}

export interface TemplateCode {
  metadata: TemplateMetadata;
  widgets: WidgetConfig[];
  layout: {
    cols: number; // Grid columns (default 12)
    rowHeight: number; // Height of each grid row in pixels
    breakpoints?: {
      lg: number;
      md: number;
      sm: number;
      xs: number;
    };
  };

  // Global configuration
  globalFilters?: Record<string, any>;
  refreshInterval?: number; // Auto-refresh in seconds (0 = manual only)

  // Custom init function (runs when dashboard is loaded)
  onInit?: string;

  // Custom hooks
  onDataFetch?: string; // Runs before fetching data
  onDataTransform?: string; // Runs after fetching data
}

/**
 * Example Template Structure:
 *
 * const myTemplate: TemplateCode = {
 *   metadata: {
 *     name: "E-commerce Performance Dashboard",
 *     description: "Complete overview of your e-commerce metrics",
 *     category: "ecommerce",
 *     tags: ["sales", "conversion", "roi"],
 *     version: "1.0.0",
 *     author: {
 *       name: "John Doe",
 *       email: "john@example.com"
 *     },
 *     requiredIntegrations: ["meta_ads", "google_ads", "ga4"],
 *     price: 49.90,
 *     isFree: false
 *   },
 *   layout: {
 *     cols: 12,
 *     rowHeight: 80
 *   },
 *   widgets: [
 *     {
 *       id: "total-revenue",
 *       type: "kpi",
 *       title: "Total Revenue",
 *       dataSource: "payment",
 *       metric: "total_revenue",
 *       dateRange: { type: "last_30_days" },
 *       position: { x: 0, y: 0, w: 3, h: 2 }
 *     },
 *     {
 *       id: "revenue-trend",
 *       type: "line",
 *       title: "Revenue Trend",
 *       dataSource: "payment",
 *       metric: "daily_revenue",
 *       dateRange: { type: "last_30_days" },
 *       chartConfig: {
 *         colors: ["#6366f1"],
 *         curve: "monotone"
 *       },
 *       position: { x: 3, y: 0, w: 9, h: 4 }
 *     }
 *   ]
 * };
 */

export interface TemplateSubmission {
  code: TemplateCode;
  readme?: string; // Markdown documentation
  changelog?: string; // Version history
}

// Validation schema for templates
export interface TemplateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface TemplateEarnings {
  totalSales: number;
  totalEarnings: number;
  platformFees: number;
  pendingPayout: number;
  paidOut: number;
}
