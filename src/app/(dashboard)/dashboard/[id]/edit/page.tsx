"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    ArrowLeft,
    Save,
    Eye,
    Plus,
    MoreVertical,
    Trash2,
    Settings,
    BarChart3,
    LineChart,
    TrendingUp,
    Loader2,
} from "lucide-react";
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
    globalDateRange?: string;
    globalFilters?: Record<string, any>;
}

interface Template {
    id: string;
    title: string;
    description: string;
    type: string;
    defaultProps: {
        dataSource: string;
        metric: string;
        format?: "currency" | "number" | "percentage";
        color?: string;
        index?: string;
        category?: string;
    };
}

// --- Marketplace Data ---

const WIDGET_TYPES = [
    { type: "kpi", title: "KPI Card", icon: TrendingUp, description: "Indicadores chave de performance" },
    { type: "line", title: "Gráfico de Linha", icon: LineChart, description: "Evolução temporal de métricas" },
    { type: "bar", title: "Gráfico de Barras", icon: BarChart3, description: "Comparativos e distribuições" },
];

const MARKETPLACE_TEMPLATES: Record<string, Template[]> = {
    kpi: [
        { id: "kpi_rev", title: "Receita Total", description: "KPI de receita com comparativo mensal", type: "kpi", defaultProps: { dataSource: "payment", metric: "total_revenue", format: "currency", color: "#8b5cf6" } },
        { id: "kpi_users", title: "Novos Usuários", description: "Contagem de novos cadastros", type: "kpi", defaultProps: { dataSource: "ga4", metric: "users", format: "number", color: "#3b82f6" } },
        { id: "kpi_roi", title: "ROI Marketing", description: "Retorno sobre investimento", type: "kpi", defaultProps: { dataSource: "meta_ads", metric: "roas", format: "percentage", color: "#10b981" } },
    ],
    line: [
        { id: "line_rev", title: "Tendência de Receita", description: "Histórico de receita (30 dias)", type: "line", defaultProps: { dataSource: "payment", metric: "daily", color: "#8b5cf6" } },
        { id: "line_traffic", title: "Tráfego Web", description: "Visitantes únicos por dia", type: "line", defaultProps: { dataSource: "ga4", metric: "daily", color: "#f59e0b" } },
        { id: "line_conv", title: "Conversão", description: "Conversões diárias", type: "line", defaultProps: { dataSource: "google_ads", metric: "daily", color: "#ec4899" } },
    ],
    bar: [
        { id: "bar_cat", title: "Métodos de Pagamento", description: "Receita por método", type: "bar", defaultProps: { dataSource: "payment", metric: "payment_methods", color: "#6366f1", index: "method", category: "revenue" } },
        { id: "bar_source", title: "Origem de Tráfego", description: "Sessões por canal de aquisição", type: "bar", defaultProps: { dataSource: "ga4", metric: "traffic_sources", color: "#3b82f6", index: "source", category: "sessions" } },
    ]
};

export default function DashboardEditPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [dashboard, setDashboard] = useState<Dashboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Grid Layout State
    const [layouts, setLayouts] = useState<any>({ lg: [] });

    // Global filters / date range
    const [dateRange, setDateRange] = useState<string>("last_30_days");

    // UI State
    const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
    const [selectedWidgetType, setSelectedWidgetType] = useState<string | null>(null);
    const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

    useEffect(() => {
        fetchDashboard();
    }, [resolvedParams.id]);

    const fetchDashboard = async () => {
        try {
            const response = await fetch(`/api/dashboards/${resolvedParams.id}`);
            if (!response.ok) throw new Error("Dashboard não encontrado");
            const data = await response.json();

            const widgets = data.dashboard.widgets || [];
            setDashboard({
                ...data.dashboard,
                widgets: widgets.map((w: any) => ({
                    ...w,
                    position: w.position && typeof w.position === 'object' && Object.keys(w.position).length > 0
                        ? w.position
                        : { x: 0, y: 0, w: 2, h: 2, i: w.id }
                })),
                globalDateRange: data.dashboard.globalDateRange || "last_30_days",
                globalFilters: data.dashboard.globalFilters || {}
            });

            // Set initial layout
            const gridLayout = widgets.map((w: any) => ({
                i: w.id,
                x: w.position?.x || 0,
                y: w.position?.y || 0,
                w: w.position?.w || 2,
                h: w.position?.h || 2,
            }));
            setLayouts({ lg: gridLayout });

        } catch (error) {
            toast({
                title: "Erro",
                description: "Não foi possível carregar o dashboard.",
                variant: "destructive",
            });
            router.push("/dashboards");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLayoutChange = (currentLayout: any) => {
        if (!dashboard) return;

        const updatedWidgets = dashboard.widgets.map(w => {
            const layoutItem = currentLayout.find((l: any) => l.i === w.id);
            if (layoutItem) {
                return {
                    ...w,
                    position: {
                        x: layoutItem.x,
                        y: layoutItem.y,
                        w: layoutItem.w,
                        h: layoutItem.h,
                        i: layoutItem.i
                    }
                };
            }
            return w;
        });

        setDashboard({ ...dashboard, widgets: updatedWidgets });
    };

    const handleSave = async () => {
        if (!dashboard) return;

        setIsSaving(true);
        try {
            const response = await fetch(`/api/dashboards/${resolvedParams.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: dashboard.name,
                    description: dashboard.description,
                    isPublished: dashboard.isPublished,
                    isPublic: dashboard.isPublic,
                    globalDateRange: dashboard.globalDateRange || dateRange,
                    globalFilters: dashboard.globalFilters || {},
                    widgets: dashboard.widgets.map(w => ({
                        type: w.type,
                        title: w.title,
                        config: w.config,
                        position: w.position
                    }))
                }),
            });

            if (!response.ok) throw new Error("Erro ao salvar");

            toast({
                title: "Dashboard salvo!",
                description: "As alterações foram salvas com sucesso.",
            });
        } catch (error) {
            toast({
                title: "Erro",
                description: "Não foi possível salvar o dashboard.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddWidget = (template: Template) => {
        if (!dashboard) return;

        const widgetId = `widget-${Date.now()}`;
        const newWidget: WidgetData = {
            id: widgetId,
            type: template.type,
            title: template.title,
            config: { ...template.defaultProps },
            position: { x: 0, y: Infinity, w: template.type === 'kpi' ? 2 : 4, h: 2, i: widgetId }
        };

        const updatedWidgets = [...dashboard.widgets, newWidget];
        setDashboard({
            ...dashboard,
            widgets: updatedWidgets,
        });

        // Update layouts state
        setLayouts({
            ...layouts,
            lg: [...(layouts.lg || []), {
                i: widgetId,
                x: newWidget.position.x,
                y: newWidget.position.y,
                w: newWidget.position.w,
                h: newWidget.position.h
            }]
        });

        setIsAddWidgetOpen(false);
        setSelectedWidgetType(null);
        setPreviewTemplate(null);

        toast({
            title: "Widget adicionado!",
            description: `${template.title} foi adicionado ao dashboard.`,
        });
    };

    const handleRemoveWidget = (widgetId: string) => {
        if (!dashboard) return;

        setDashboard({
            ...dashboard,
            widgets: dashboard.widgets.filter((w) => w.id !== widgetId),
        });

        setLayouts({
            ...layouts,
            lg: (layouts.lg || []).filter((l: any) => l.i !== widgetId)
        });

        toast({
            title: "Widget removido",
            description: "O widget foi removido do dashboard.",
        });
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
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Carregando dashboard...</p>
                </div>
            </div>
        );
    }

    if (!dashboard) return null;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push("/dashboards")}
                                className="gap-2 mr-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden md:inline">Menu Principal</span>
                            </Button>
                            <div>
                                <Input
                                    value={dashboard.name}
                                    onChange={(e) =>
                                        setDashboard({ ...dashboard, name: e.target.value })
                                    }
                                    className="text-xl font-bold border-none bg-transparent px-0 h-auto focus-visible:ring-0"
                                />
                                <p className="text-sm text-muted-foreground">
                                    {dashboard.widgets.length} widgets • Arraste e redimensione como quiser
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Período:</span>
                                <select
                                    className="text-xs border rounded px-2 py-1 bg-background"
                                    value={dashboard.globalDateRange || dateRange}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setDateRange(value);
                                        setDashboard({
                                            ...dashboard,
                                            globalDateRange: value,
                                        });
                                    }}
                                >
                                    <option value="last_7_days">Últimos 7 dias</option>
                                    <option value="last_30_days">Últimos 30 dias</option>
                                    <option value="last_90_days">Últimos 90 dias</option>
                                </select>
                            </div>
                            <Button variant="outline" onClick={() => router.push(`/view/${resolvedParams.id}`)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Visualizar
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4 mr-2" />
                                )}
                                Salvar Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                {dashboard.widgets.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Dashboard vazio</h3>
                                <p className="text-muted-foreground text-center mb-6">Comece adicionando widgets do Marketplace</p>
                                <Button onClick={() => setIsAddWidgetOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Adicionar Primeiro Widget
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-end">
                            <Button onClick={() => setIsAddWidgetOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Widget
                            </Button>
                        </div>

                        <ResponsiveGridLayout
                            className="layout"
                            layouts={layouts}
                            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                            rowHeight={150}
                            draggableHandle=".drag-handle"
                            onLayoutChange={(current) => handleLayoutChange(current)}
                        >
                            {dashboard.widgets.map((widget) => (
                                <div key={widget.id} className="relative group overflow-hidden rounded-xl border bg-card">
                                    <div className="drag-handle absolute top-0 left-0 right-0 h-8 z-20 cursor-move opacity-0 group-hover:opacity-100 bg-black/5 flex items-center justify-center transition-opacity">
                                        <div className="w-8 h-1 bg-black/20 rounded-full" />
                                    </div>

                                    <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="secondary" size="icon" className="h-6 w-6">
                                                    <MoreVertical className="h-3 w-3" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleRemoveWidget(widget.id)} className="text-destructive">
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Remover
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="h-full pt-4">
                                        {renderWidget({
                                            ...widget,
                                            config: {
                                                ...widget.config,
                                                // inject global dateRange into widget config for API usage
                                                dateRange: dashboard.globalDateRange || dateRange,
                                            },
                                        })}
                                    </div>
                                </div>
                            ))}
                        </ResponsiveGridLayout>
                    </div>
                )}
            </div>

            {/* Marketplace Dialog */}
            <Dialog open={isAddWidgetOpen} onOpenChange={(open) => {
                if (!open) {
                    setIsAddWidgetOpen(false);
                    setSelectedWidgetType(null);
                    setPreviewTemplate(null);
                }
            }}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Marketplace de Widgets</DialogTitle>
                        <DialogDescription>Escolha um template profissional para seu dashboard</DialogDescription>
                    </DialogHeader>

                    {!selectedWidgetType ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                            {WIDGET_TYPES.map((type) => {
                                const Icon = type.icon;
                                return (
                                    <button
                                        key={type.type}
                                        onClick={() => setSelectedWidgetType(type.type)}
                                        className="p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left flex flex-col items-center text-center gap-3 group"
                                    >
                                        <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                            <Icon className="h-8 w-8 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">{type.title}</h4>
                                            <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-4">
                            <div className="flex items-center gap-4 mb-6">
                                <Button variant="outline" size="sm" onClick={() => setSelectedWidgetType(null)}>
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Voltar
                                </Button>
                                <h3 className="font-semibold">Templates</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {MARKETPLACE_TEMPLATES[selectedWidgetType]?.map((template) => (
                                    <div
                                        key={template.id}
                                        className="p-4 rounded-lg border-2 hover:border-primary cursor-pointer transition-all"
                                        onClick={() => handleAddWidget(template)}
                                    >
                                        <span className="font-semibold block">{template.title}</span>
                                        <span className="text-xs text-muted-foreground">{template.description}</span>
                                        <Button size="sm" className="w-full mt-3">Adicionar</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
