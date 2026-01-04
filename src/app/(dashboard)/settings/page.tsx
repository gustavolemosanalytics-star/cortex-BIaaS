"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
    User,
    Bell,
    Shield,
    CreditCard,
    Save,
    Moon,
    Sun,
    Monitor,
    Check
} from "lucide-react";

type Theme = "light" | "dark" | "system";

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [theme, setTheme] = useState<Theme>("system");
    const [profile, setProfile] = useState({
        name: "Usuário Teste",
        email: "teste@teste.com",
        company: "Minha Empresa",
    });
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        reports: true,
        marketing: false,
    });

    const handleSaveProfile = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        toast({
            title: "Perfil atualizado",
            description: "Suas informações foram salvas com sucesso.",
        });
    };

    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
        // In a real app, this would update the actual theme
        toast({
            title: "Tema alterado",
            description: `Tema ${newTheme === "light" ? "claro" : newTheme === "dark" ? "escuro" : "do sistema"} selecionado.`,
        });
    };

    const themeOptions = [
        { value: "light" as Theme, label: "Claro", icon: Sun },
        { value: "dark" as Theme, label: "Escuro", icon: Moon },
        { value: "system" as Theme, label: "Sistema", icon: Monitor },
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Configurações</h1>
                    <p className="text-muted-foreground">
                        Gerencie suas preferências e configurações da conta
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Profile Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                <CardTitle>Perfil</CardTitle>
                            </div>
                            <CardDescription>
                                Informações básicas da sua conta
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome</Label>
                                    <Input
                                        id="name"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Empresa</Label>
                                <Input
                                    id="company"
                                    value={profile.company}
                                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                                />
                            </div>
                            <Button onClick={handleSaveProfile} disabled={isSaving}>
                                {isSaving ? (
                                    <>Salvando...</>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Salvar Alterações
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Theme Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Monitor className="h-5 w-5 text-primary" />
                                <CardTitle>Aparência</CardTitle>
                            </div>
                            <CardDescription>
                                Personalize a aparência da plataforma
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                {themeOptions.map((option) => {
                                    const Icon = option.icon;
                                    const isSelected = theme === option.value;
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => handleThemeChange(option.value)}
                                            className={`
                        relative p-4 rounded-lg border-2 transition-all
                        ${isSelected
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:border-primary/50"
                                                }
                      `}
                                        >
                                            {isSelected && (
                                                <div className="absolute top-2 right-2">
                                                    <Check className="h-4 w-4 text-primary" />
                                                </div>
                                            )}
                                            <Icon className={`h-6 w-6 mx-auto mb-2 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                                            <p className={`text-sm font-medium ${isSelected ? "text-primary" : ""}`}>
                                                {option.label}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-primary" />
                                <CardTitle>Notificações</CardTitle>
                            </div>
                            <CardDescription>
                                Configure como você recebe notificações
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { key: "email", label: "Notificações por email", description: "Receba atualizações importantes por email" },
                                { key: "push", label: "Notificações push", description: "Notificações no navegador em tempo real" },
                                { key: "reports", label: "Relatórios semanais", description: "Resumo semanal do desempenho dos dashboards" },
                                { key: "marketing", label: "Novidades e ofertas", description: "Fique por dentro das novidades da plataforma" },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium">{item.label}</p>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                    <button
                                        onClick={() => setNotifications({
                                            ...notifications,
                                            [item.key]: !notifications[item.key as keyof typeof notifications]
                                        })}
                                        className={`
                      relative w-12 h-6 rounded-full transition-colors
                      ${notifications[item.key as keyof typeof notifications]
                                                ? "bg-primary"
                                                : "bg-muted"
                                            }
                    `}
                                    >
                                        <div
                                            className={`
                        absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
                        ${notifications[item.key as keyof typeof notifications]
                                                    ? "translate-x-7"
                                                    : "translate-x-1"
                                                }
                      `}
                                        />
                                    </button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Security Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                <CardTitle>Segurança</CardTitle>
                            </div>
                            <CardDescription>
                                Configurações de segurança da sua conta
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b">
                                <div>
                                    <p className="font-medium">Alterar senha</p>
                                    <p className="text-sm text-muted-foreground">Atualize sua senha de acesso</p>
                                </div>
                                <Button variant="outline">Alterar</Button>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                                <div>
                                    <p className="font-medium">Autenticação de dois fatores</p>
                                    <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                                </div>
                                <Button variant="outline">Configurar</Button>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-medium">Sessões ativas</p>
                                    <p className="text-sm text-muted-foreground">Gerencie dispositivos conectados</p>
                                </div>
                                <Button variant="outline">Ver sessões</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Billing Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" />
                                <CardTitle>Assinatura e Cobrança</CardTitle>
                            </div>
                            <CardDescription>
                                Gerencie seu plano e forma de pagamento
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 mb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Plano atual</p>
                                        <p className="text-xl font-bold">Gratuito</p>
                                    </div>
                                    <Button>Fazer Upgrade</Button>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground text-center">
                                Você está usando o plano gratuito com limite de 3 dashboards.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="border-destructive/50">
                        <CardHeader>
                            <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                            <CardDescription>
                                Ações irreversíveis para sua conta
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Excluir conta</p>
                                    <p className="text-sm text-muted-foreground">
                                        Exclua permanentemente sua conta e todos os dados
                                    </p>
                                </div>
                                <Button variant="destructive">Excluir Conta</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
}
