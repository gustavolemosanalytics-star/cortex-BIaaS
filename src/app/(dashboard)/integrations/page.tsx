"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
    Check,
    Link2,
    RefreshCw,
    ExternalLink,
    AlertCircle,
    Loader2
} from "lucide-react";
import { config } from "@/lib/config";

type ConnectionStatus = "connected" | "disconnected" | "connecting";

interface Integration {
    id: string;
    name: string;
    description: string;
    icon: string;
    status: ConnectionStatus;
    lastSync?: string;
    accountName?: string;
}

export default function IntegrationsPage() {
    const router = useRouter();
    const [integrations, setIntegrations] = useState<Integration[]>(
        config.AVAILABLE_INTEGRATIONS.map((integration) => ({
            id: integration.id,
            name: integration.name,
            description: integration.description,
            icon: integration.icon,
            status: "disconnected" as ConnectionStatus,
            lastSync: undefined,
            accountName: undefined,
        }))
    );

    const handleCreateAutoDashboard = async (integrationId: string) => {
        toast({
            title: "Gerando dashboard...",
            description: "Criando visualizações com seus dados...",
        });

        // Simulate dashboard creation simulation
        await new Promise(resolve => setTimeout(resolve, 2000));

        toast({
            title: "Dashboard Criado!",
            description: "Seu relatório automático está pronto.",
            action: (
                <Button variant="default" size="sm" onClick={() => router.push('/dashboards')}>
                    Ver Dashboards
                </Button>
            ),
        });
    };

    const handleConnect = async (integrationId: string) => {
        // Update status to connecting
        setIntegrations(prev =>
            prev.map(i =>
                i.id === integrationId ? { ...i, status: "connecting" as ConnectionStatus } : i
            )
        );

        // Simulate API connection with mock delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock successful connection
        const mockAccountNames: Record<string, string> = {
            meta_ads: "Minha Empresa - Facebook Business",
            google_ads: "minha-empresa@ads.google.com",
            ga4: "UA-123456789 - Meu Site",
            payment: "Conta Principal - PIX/Cartão",
        };

        setIntegrations(prev =>
            prev.map(i =>
                i.id === integrationId
                    ? {
                        ...i,
                        status: "connected" as ConnectionStatus,
                        lastSync: new Date().toLocaleString("pt-BR"),
                        accountName: mockAccountNames[integrationId] || "Conta conectada",
                    }
                    : i
            )
        );

        toast({
            title: "Integração conectada!",
            description: `${integrations.find(i => i.id === integrationId)?.name} foi conectado com sucesso.`,
            action: (
                <Button variant="outline" size="sm" onClick={() => handleCreateAutoDashboard(integrationId)}>
                    Gerar Relatório
                </Button>
            ),
        });
    };

    const handleDisconnect = async (integrationId: string) => {
        setIntegrations(prev =>
            prev.map(i =>
                i.id === integrationId
                    ? {
                        ...i,
                        status: "disconnected" as ConnectionStatus,
                        lastSync: undefined,
                        accountName: undefined,
                    }
                    : i
            )
        );

        toast({
            title: "Integração desconectada",
            description: "A conexão foi removida com sucesso.",
        });
    };

    const handleSync = async (integrationId: string) => {
        const integration = integrations.find(i => i.id === integrationId);

        toast({
            title: "Sincronizando dados...",
            description: `Buscando dados mais recentes de ${integration?.name}`,
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        setIntegrations(prev =>
            prev.map(i =>
                i.id === integrationId
                    ? { ...i, lastSync: new Date().toLocaleString("pt-BR") }
                    : i
            )
        );

        toast({
            title: "Dados sincronizados!",
            description: "Os dados mock foram atualizados com sucesso.",
        });
    };

    const connectedCount = integrations.filter(i => i.status === "connected").length;

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Integrações</h1>
                    <p className="text-muted-foreground">
                        Conecte suas plataformas para visualizar dados nos dashboards
                    </p>
                </div>

                {/* Status Overview */}
                <Card className="mb-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">Status das Integrações</h3>
                                <p className="text-muted-foreground">
                                    {connectedCount} de {integrations.length} plataformas conectadas
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {integrations.filter(i => i.status === "connected").map((i) => (
                                        <div
                                            key={i.id}
                                            className="w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center text-lg"
                                            title={i.name}
                                        >
                                            {i.icon}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Banner */}
                <div className="mb-8 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-amber-600 dark:text-amber-400">Modo Demonstração</h4>
                        <p className="text-sm text-muted-foreground">
                            As integrações estão usando dados fictícios para demonstração.
                            Ao conectar, você verá dados mock que simulam uma integração real.
                        </p>
                    </div>
                </div>

                {/* Integration Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                    {integrations.map((integration, index) => (
                        <motion.div
                            key={integration.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className={`${integration.status === "connected"
                                    ? "border-green-500/50 bg-green-500/5"
                                    : ""
                                }`}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="text-3xl">{integration.icon}</div>
                                            <div>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    {integration.name}
                                                    {integration.status === "connected" && (
                                                        <Check className="h-4 w-4 text-green-500" />
                                                    )}
                                                </CardTitle>
                                                <CardDescription>{integration.description}</CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {integration.status === "connected" ? (
                                        <div className="space-y-4">
                                            <div className="p-3 rounded-lg bg-secondary/50">
                                                <p className="text-sm font-medium">{integration.accountName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Última sincronização: {integration.lastSync}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => handleSync(integration.id)}
                                                >
                                                    <RefreshCw className="h-4 w-4 mr-2" />
                                                    Sincronizar
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => handleDisconnect(integration.id)}
                                                >
                                                    Desconectar
                                                </Button>
                                            </div>
                                        </div>
                                    ) : integration.status === "connecting" ? (
                                        <div className="flex items-center justify-center py-6">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                            <span className="ml-2 text-muted-foreground">Conectando...</span>
                                        </div>
                                    ) : (
                                        <Button
                                            className="w-full"
                                            onClick={() => handleConnect(integration.id)}
                                        >
                                            <Link2 className="h-4 w-4 mr-2" />
                                            Conectar {integration.name}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Help Section */}
                <Card className="mt-8">
                    <CardContent className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold">Precisa de ajuda?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Consulte nossa documentação sobre como configurar as integrações
                                </p>
                            </div>
                            <Button variant="outline">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Ver Documentação
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
