"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
    Loader2,
    Calendar,
    Filter,
    Share2,
    Download,
    ArrowLeft,
    Edit3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { KPIWidget, LineChartWidget, BarChartWidget } from "@/components/dashboard/widgets";

const ResponsiveGridLayout = WidthProvider(Responsive);

// --- Types ---

interface WidgetData {
    id: string;
    type: string;
    title: string;
    config: {
        dataSource: string;
        metric: string;
        format?: "currency" | "number" | "percentage";
        color?: string;
        [key: string]: any;
    };
    position: {
        x: number;
        y: number;
        w: number;
        h: number;
        i?: string;
    };
}

interface Dashboard {
    id: string;
    name: string;
    description?: string;
    isPublished: boolean;
    isPublic: boolean;
    widgets: WidgetData[];
    updatedAt: string;
}

export default function DashboardViewPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [dashboard, setDashboard] = useState<Dashboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [layouts, setLayouts] = useState<any>({ lg: [] });

    useEffect(() => {
        fetchDashboard();
    }, [resolvedParams.id]);

    const fetchDashboard = async () => {
        try {
            const response = await fetch(`/api/dashboards/${resolvedParams.id}`);
            if (!response.ok) throw new Error("Dashboard não encontrado ou privado");
            const data = await response.json();

            const widgets = data.dashboard.widgets || [];
            setDashboard({
                ...data.dashboard,
                widgets: widgets.map((w: any) => ({
                    ...w,
                    position: w.position && typeof w.position === 'object' && Object.keys(w.position).length > 0
                        ? w.position
                        : { x: 0, y: 0, w: 2, h: 2, i: w.id }
                }))
            });

            // Set layout
            const gridLayout = widgets.map((w: any) => ({
                i: w.id,
                x: w.position?.x || 0,
                y: w.position?.y || 0,
                w: w.position?.w || 2,
                h: w.position?.h || 2,
                static: true // Importante: desativa arraste/redimensionamento
            }));
            setLayouts({ lg: gridLayout });

        } catch (error) {
            toast({
                title: "Erro",
                description: "Não foi possível carregar o dashboard.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const renderWidget = (widget: WidgetData) => {
        switch (widget.type) {
            case "kpi":
                return <KPIWidget
                    title={widget.title}
                    dataSource={widget.config.dataSource}
                    metric={widget.config.metric}
                    format={widget.config.format}
                    color={widget.config.color}
                />;
            case "line":
                return <LineChartWidget
                    title={widget.title}
                    dataSource={widget.config.dataSource}
                    metric={widget.config.metric}
                    color={widget.config.color}
                />;
            case "bar":
                return <BarChartWidget
                    title={widget.title}
                    dataSource={widget.config.dataSource}
                    metric={widget.config.metric}
                    colors={[widget.config.color || "#6366f1"]}
                    index={widget.config.index}
                    category={widget.config.category}
                />;
            default:
                return (
                    <Card className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground">Widget Desconhecido</p>
                    </Card>
                );
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Carregando visualização...</p>
                </div>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
                <div className="text-center max-w-md px-4">
                    <h1 className="text-2xl font-bold mb-2">Dashboard não disponível</h1>
                    <p className="text-muted-foreground">
                        Este dashboard não existe ou você não tem permissão para visualizá-lo.
                    </p>
                    <Button className="mt-4" onClick={() => router.push("/dashboards")}>
                        Voltar aos Dashboards
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* View Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => router.push("/dashboards")}
                                className="gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Voltar ao Menu
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {dashboard.name}
                                </h1>
                                {dashboard.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {dashboard.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/${dashboard.id}/edit`)}>
                                <Edit3 className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Editar</span>
                            </Button>
                            <Button variant="outline" size="sm">
                                <Share2 className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Compartilhar</span>
                            </Button>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">PDF</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                {dashboard.widgets.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed">
                        <p className="text-muted-foreground">Este dashboard ainda não possui widgets.</p>
                        <Button className="mt-4" onClick={() => router.push(`/dashboard/${dashboard.id}/edit`)}>
                            Adicionar Widgets
                        </Button>
                    </div>
                ) : (
                    <ResponsiveGridLayout
                        className="layout"
                        layouts={layouts}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                        rowHeight={150}
                        isDraggable={false}
                        isResizable={false}
                    >
                        {dashboard.widgets.map((widget) => (
                            <div key={widget.id} className="overflow-hidden rounded-xl border bg-card">
                                {renderWidget(widget)}
                            </div>
                        ))}
                    </ResponsiveGridLayout>
                )}
            </div>
        </div>
    );
}
