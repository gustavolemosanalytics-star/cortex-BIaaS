"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, BarChart3, Trash2, Edit, ExternalLink } from "lucide-react";

interface Dashboard {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isPublished: boolean;
  isPublic: boolean;
  updatedAt: string;
  _count: {
    widgets: number;
  };
}

export default function DashboardsPage() {
  const router = useRouter();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDashboard, setNewDashboard] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchDashboards();
  }, []);

  const fetchDashboards = async () => {
    try {
      const response = await fetch("/api/dashboards");
      if (!response.ok) throw new Error("Erro ao buscar dashboards");
      const data = await response.json();
      setDashboards(data.dashboards);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dashboards.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDashboard = async () => {
    if (!newDashboard.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome do dashboard é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/dashboards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDashboard),
      });

      if (!response.ok) throw new Error("Erro ao criar dashboard");

      const data = await response.json();
      toast({
        title: "Dashboard criado!",
        description: "Redirecionando para o editor...",
      });

      router.push(`/dashboard/${data.dashboard.id}/edit`);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o dashboard.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDashboard = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este dashboard?")) return;

    try {
      const response = await fetch(`/api/dashboards/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao deletar dashboard");

      toast({
        title: "Dashboard excluído",
        description: "O dashboard foi removido com sucesso.",
      });

      fetchDashboards();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o dashboard.",
        variant: "destructive",
      });
    }
  };

  const filteredDashboards = dashboards.filter((dashboard) =>
    dashboard.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando dashboards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Meus Dashboards</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie e visualize seus dashboards de marketing
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Dashboard
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar novo dashboard</DialogTitle>
              <DialogDescription>
                Dê um nome ao seu dashboard e adicione uma descrição opcional.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Ex: Dashboard E-commerce Q1 2024"
                  value={newDashboard.name}
                  onChange={(e) =>
                    setNewDashboard({ ...newDashboard, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Input
                  id="description"
                  placeholder="Descrição do dashboard"
                  value={newDashboard.description}
                  onChange={(e) =>
                    setNewDashboard({ ...newDashboard, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateDashboard}>Criar Dashboard</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar dashboards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredDashboards.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? "Nenhum dashboard encontrado" : "Nenhum dashboard ainda"}
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              {searchQuery
                ? "Tente ajustar sua busca"
                : "Comece criando seu primeiro dashboard"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar primeiro dashboard
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDashboards.map((dashboard) => (
            <Card key={dashboard.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">{dashboard.name}</CardTitle>
                    {dashboard.description && (
                      <CardDescription className="line-clamp-2 mt-1">
                        {dashboard.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{dashboard._count.widgets} widgets</span>
                  <span>•</span>
                  <span>
                    {new Date(dashboard.updatedAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  {dashboard.isPublished && (
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded">
                      Publicado
                    </span>
                  )}
                  {dashboard.isPublic && (
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded">
                      Público
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => router.push(`/dashboard/${dashboard.id}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                {dashboard.isPublic && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/view/${dashboard.slug}`, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteDashboard(dashboard.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
