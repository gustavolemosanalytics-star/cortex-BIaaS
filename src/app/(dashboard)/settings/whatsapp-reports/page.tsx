'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Loader2, MessageSquare, Send, Trash2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Dashboard {
  id: string;
  name: string;
  slug: string;
}

interface WhatsAppReportConfig {
  id: string;
  dashboardId: string;
  phoneNumber: string;
  frequency: string;
  time: string;
  isActive: boolean;
  dashboard: Dashboard;
  _count: {
    reports: number;
  };
}

export default function WhatsAppReportsPage() {
  const [reports, setReports] = useState<WhatsAppReportConfig[]>([]);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [selectedDashboard, setSelectedDashboard] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [frequency, setFrequency] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    fetchReports();
    fetchDashboards();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/whatsapp-reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao carregar relatórios WhatsApp',
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

  const handleCreateReport = async () => {
    if (!selectedDashboard || !phoneNumber || !frequency || !time) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/whatsapp-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dashboardId: selectedDashboard,
          phoneNumber,
          frequency,
          time,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Relatório WhatsApp configurado com sucesso!',
        });
        setIsDialogOpen(false);
        resetForm();
        fetchReports();
      } else {
        const error = await response.json();
        toast({
          title: 'Erro',
          description: error.error || 'Falha ao configurar relatório',
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

  const handleSendReport = async (reportId: string) => {
    setSending(reportId);
    try {
      const response = await fetch(`/api/whatsapp-reports/${reportId}/send`, {
        method: 'POST',
      });

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Relatório enviado com sucesso via WhatsApp!',
        });
        fetchReports();
      } else {
        const error = await response.json();
        toast({
          title: 'Erro',
          description: error.error || 'Falha ao enviar relatório',
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
      setSending(null);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta configuração de relatório?')) {
      return;
    }

    try {
      const response = await fetch(`/api/whatsapp-reports/${reportId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Configuração removida com sucesso!',
        });
        fetchReports();
      } else {
        const error = await response.json();
        toast({
          title: 'Erro',
          description: error.error || 'Falha ao remover configuração',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao conectar com o servidor',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setSelectedDashboard('');
    setPhoneNumber('');
    setFrequency('');
    setTime('');
  };

  const formatFrequency = (freq: string) => {
    const map = {
      daily: 'Diário',
      weekly: 'Semanal',
      monthly: 'Mensal',
    };
    return map[freq as keyof typeof map] || freq;
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
          <h1 className="text-3xl font-bold">Relatórios WhatsApp</h1>
          <p className="text-muted-foreground">
            Configure relatórios automáticos enviados via WhatsApp com análise de IA
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              Novo Relatório
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurar Relatório WhatsApp</DialogTitle>
              <DialogDescription>
                Configure um relatório automático baseado em um dashboard específico.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="dashboard">Dashboard</Label>
                <Select value={selectedDashboard} onValueChange={setSelectedDashboard}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um dashboard" />
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

              <div>
                <Label htmlFor="phone">Número do WhatsApp</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+55 11 99999-9999"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="frequency">Frequência</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="time">Horário</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              <Button onClick={handleCreateReport} disabled={creating} className="w-full">
                {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Configurar Relatório
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {reports.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum relatório configurado</h3>
              <p className="text-muted-foreground text-center mb-4">
                Configure seu primeiro relatório WhatsApp para receber análises automáticas dos seus dados.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                Configurar Primeiro Relatório
              </Button>
            </CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {report.dashboard.name}
                      <Badge variant={report.isActive ? 'default' : 'secondary'}>
                        {report.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      WhatsApp: {report.phoneNumber} • {formatFrequency(report.frequency)} às {report.time}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendReport(report.id)}
                      disabled={sending === report.id}
                    >
                      {sending === report.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteReport(report.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {report._count.reports} relatórios enviados
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
