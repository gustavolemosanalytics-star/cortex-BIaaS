"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BarChartWidgetProps {
  title: string;
  dataSource: string;
  metric: string;
  colors?: string[];
  height?: number;
  index?: string;
  category?: string;
  dateRange?: { type: string; from?: string; to?: string };
}

export function BarChartWidget({
  title,
  dataSource,
  metric,
  colors = ["#6366f1", "#8b5cf6", "#ec4899"],
  height = 300,
  index = "source",
  category = "sessions",
  dateRange,
}: BarChartWidgetProps) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setData(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center" style={{ height }}>
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center" style={{ height }}>
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : !Array.isArray(data) || data.length === 0 ? (
          <div className="flex items-center justify-center" style={{ height }}>
            <p className="text-sm text-muted-foreground">Sem dados disponíveis</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey={index}
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey={category} name="Valor" fill={colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
