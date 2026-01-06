"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, TrendingUp, Loader2 } from "lucide-react";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";
import { useEffect, useState } from "react";

interface KPIWidgetProps {
  title: string;
  dataSource: string;
  metric: string;
  format?: "currency" | "number" | "percentage";
  icon?: React.ReactNode;
  color?: string;
  dateRange?: { type: string; from?: string; to?: string };
}

export function KPIWidget({
  title,
  dataSource,
  metric,
  format = "number",
  icon,
  color = "#6366f1",
  dateRange,
}: KPIWidgetProps) {
  const [value, setValue] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock de variação (pode vir da API futuramente)
  const variation = Math.random() > 0.5 ? Math.random() * 20 : -Math.random() * 20;
  const isPositive = variation >= 0;

  useEffect(() => {
    fetchData();
  }, [dataSource, metric]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: dataSource,
          metric,
          dateRange: dateRange || { type: "last_30_days" },
        }),
      });

      if (!response.ok) throw new Error("Erro ao buscar dados");

      const result = await response.json();
      setValue(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatValue = (val: number) => {
    switch (format) {
      case "currency":
        return formatCurrency(val);
      case "percentage":
        return formatPercentage(val);
      default:
        return formatNumber(val);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon || <TrendingUp className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : (
          <>
            <div className="text-2xl font-bold" style={{ color }}>
              {value !== null ? formatValue(value) : "-"}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              {isPositive ? (
                <ArrowUp className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500" />
              )}
              <span className={isPositive ? "text-green-500" : "text-red-500"}>
                {Math.abs(variation).toFixed(1)}%
              </span>
              <span>vs. período anterior</span>
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
