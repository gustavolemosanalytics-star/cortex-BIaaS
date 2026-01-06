'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Loader2, Brain, CreditCard, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Dashboard {
  id: string;
  name: string;
  slug: string;
}

interface AIAgentSession {
  id: string;
  campaignName: string;
  campaignGoal: string;
  status: string;
  amount: number;
  paidAt: Date | null;
  dashboard?: Dashboard;
  analyses: Array<{
    id: string;
    type: string;
    title: string;
    content: string;
    createdAt: string;
  }>;
}

declare global {
  interface Window {
    Stripe?: any;
  }
}

export default function AIAgentPage() {
  const [sessions, setSessions] = useState<AIAgentSession[]>([]);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<AIAgentSession | null>(null);
  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false);

  // Form state
  const [campaignName, setCampaignName] = useState('');
  const [campaignGoal, setCampaignGoal] = useState('');
  const [selectedDashboard, setSelectedDashboard] = useState('');

  useEffect(() => {
    fetchSessions();
    fetchDashboards();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/ai-agent');
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao carregar sessões do agente IA',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboards = async () => {
    try {
      const response = await fetch('/api/dashboards');
      if (response.ok) {
        const data = await response.json();
        setDashboards(data);
      }
    } catch (error) {
      console.error('Error fetching dashboards:', error);
    }
  };

  const handleCreateSession = async () => {
    if (!campaignName || !campaignGoal) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignName,
          campaignGoal,
          dashboardId: selectedDashboard || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Initialize Stripe payment
        if (window.Stripe && data.paymentIntent) {
          const stripe = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
          const { error } = await stripe.confirmPayment({
            elements: null,
            confirmParams: {
              return_url: `${window.location.origin}/ai-agent/payment-success?session_id=${data.session.id}`,
            },
          });

          if (error) {
            toast({
              title: 'Erro no Pagamento',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Sessão Criada',
            description: 'Sessão criada com sucesso! Complete o pagamento para usar o agente IA.',
          });
          setIsDialogOpen(false);
          resetForm();
          fetchSessions();
        }
      } else {
        const error = await response.json();
        toast({
          title: 'Erro',
          description: error.error || 'Falha ao criar sessão',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao conectar com o servidor',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleAnalyzeCampaign = async (sessionId: string) => {
    setAnalyzing(sessionId);
    try {
      const response = await fetch(`/api/ai-agent/${sessionId}/analyze`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Análise Concluída',
          description: 'Análise da campanha realizada com sucesso!',
        });
        fetchSessions();

        // Show analysis results
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
          setSelectedSession({
            ...session,
            analyses: [{
              id: data.analysis.id,
              type: 'campaign_analysis',
              title: data.analysis.title,
              content: data.analysis.content,
              createdAt: data.analysis.createdAt,
            }]
          });
          setIsAnalysisDialogOpen(true);
        }
      } else {
        const error = await response.json();
        toast({
          title: 'Erro',
          description: error.error || 'Falha ao analisar campanha',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao conectar com o servidor',
        variant: 'destructive',
      });
    } finally {
      setAnalyzing(null);
    }
  };

  const resetForm = () => {
    setCampaignName('');
    setCampaignGoal('');
    setSelectedDashboard('');
  };

  const formatStatus = (status: string, paidAt: Date | null) => {
    if (status === 'active' && paidAt) {
      return { label: 'Pago', variant: 'default' as const, icon: CheckCircle };
    } else if (status === 'active' && !paidAt) {
      return { label: 'Aguardando Pagamento', variant: 'secondary' as const, icon: AlertCircle };
    }
    return { label: status, variant: 'outline' as const, icon: Brain };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agente IA</h1>
          <p className="text-muted-foreground">
            Análise inteligente de campanhas com IA - R$ 20,00 por análise
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Brain className="h-4 w-4 mr-2" />
              Nova Análise
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Análise de Campanha com IA</DialogTitle>
              <DialogDescription>
                Descreva sua campanha e objetivos para receber uma análise completa com recomendações.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="campaignName">Nome da Campanha</Label>
                <Input
                  id="campaignName"
                  placeholder="Ex: Campanha Black Friday 2024"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="campaignGoal">Objetivo da Campanha</Label>
                <Textarea
                  id="campaignGoal"
                  placeholder="Descreva os objetivos da campanha..."
                  value={campaignGoal}
                  onChange={(e) => setCampaignGoal(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="dashboard">Dashboard (Opcional)</Label>
                <Select value={selectedDashboard} onValueChange={setSelectedDashboard}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vincular dashboard para análise de dados" />
                  </SelectTrigger>
                  <SelectContent>
                    {dashboards.map((dashboard) => (
                      <SelectItem key={dashboard.id} value={dashboard.id}>
                        {dashboard.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <CreditCard className="h-4 w-4" />
                  <span className="font-medium">Custo: R$ 20,00</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Você será redirecionado para o pagamento seguro após criar a sessão.
                </p>
              </div>

              <Button onClick={handleCreateSession} disabled={creating} className="w-full">
                {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Criar Sessão e Pagar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Brain className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma análise realizada</h3>
              <p className="text-muted-foreground text-center mb-4">
                Crie sua primeira análise de campanha com IA para receber insights estratégicos e recomendações.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                Iniciar Primeira Análise
              </Button>
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => {
            const statusInfo = formatStatus(session.status, session.paidAt);
            const StatusIcon = statusInfo.icon;

            return (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {session.campaignName}
                        <Badge variant={statusInfo.variant}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {session.campaignGoal}
                        {session.dashboard && ` • Dashboard: ${session.dashboard.name}`}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {session.paidAt && session.analyses.length === 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAnalyzeCampaign(session.id)}
                          disabled={analyzing === session.id}
                        >
                          {analyzing === session.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Brain className="h-4 w-4 mr-2" />
                          )}
                          Analisar
                        </Button>
                      )}
                      {session.analyses.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedSession(session);
                            setIsAnalysisDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Análise
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>R$ {session.amount.toFixed(2)}</span>
                    <span>{session.analyses.length} análises realizadas</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Analysis Results Dialog */}
      <Dialog open={isAnalysisDialogOpen} onOpenChange={setIsAnalysisDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Análise da Campanha: {selectedSession?.campaignName}</DialogTitle>
            <DialogDescription>
              Resultados da análise inteligente realizada pela IA
            </DialogDescription>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-6">
              {selectedSession.analyses.map((analysis) => (
                <Card key={analysis.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{analysis.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                        {analysis.content}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
