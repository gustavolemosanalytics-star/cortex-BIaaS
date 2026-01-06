import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface DashboardData {
  dashboardName: string;
  widgets: Array<{
    type: string;
    title: string;
    data: any;
  }>;
  userInfo: {
    name?: string;
    email: string;
  };
}

export interface CampaignData {
  campaignName: string;
  campaignGoal: string;
  dashboardData: DashboardData;
}

class AIService {
  async generateDashboardReport(dashboardData: DashboardData): Promise<string> {
    try {
      const prompt = this.buildReportPrompt(dashboardData);

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "Você é um analista de dados experiente especializado em marketing digital e business intelligence. Gere relatórios em português brasileiro, focados em insights acionáveis e recomendações práticas."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      });

      return completion.choices[0]?.message?.content || "Erro ao gerar relatório";
    } catch (error) {
      console.error('Error generating dashboard report:', error);
      throw new Error('Falha ao gerar relatório com IA');
    }
  }

  async analyzeCampaign(campaignData: CampaignData): Promise<{
    analysis: string;
    recommendations: string[];
    insights: string[];
  }> {
    try {
      const prompt = this.buildCampaignAnalysisPrompt(campaignData);

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em marketing digital e análise de campanhas. Forneça análises profundas, insights estratégicos e recomendações acionáveis em português brasileiro."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.8
      });

      const response = completion.choices[0]?.message?.content || "";
      return this.parseCampaignAnalysis(response);
    } catch (error) {
      console.error('Error analyzing campaign:', error);
      throw new Error('Falha ao analisar campanha com IA');
    }
  }

  private buildReportPrompt(data: DashboardData): string {
    const widgetsSummary = data.widgets.map(widget =>
      `Widget: ${widget.title} (${widget.type})\nDados: ${JSON.stringify(widget.data)}\n`
    ).join('\n');

    return `
Analise os dados do dashboard "${data.dashboardName}" e gere um relatório executivo completo.

Dados disponíveis:
${widgetsSummary}

Estrutura do relatório:
1. Resumo Executivo (principais métricas e tendências)
2. Análise Detalhada (performance por categoria)
3. Insights e Tendências (o que os dados revelam)
4. Recomendações (ações específicas a serem tomadas)
5. Próximos Passos (planejamento futuro)

Seja específico, use números quando possível e foque em insights acionáveis.
    `.trim();
  }

  private buildCampaignAnalysisPrompt(data: CampaignData): string {
    const widgetsSummary = data.dashboardData.widgets.map(widget =>
      `Widget: ${widget.title} (${widget.type})\nDados: ${JSON.stringify(widget.data)}\n`
    ).join('\n');

    return `
Analise a campanha "${data.campaignName}" com objetivo: "${data.campaignGoal}"

Dados do dashboard "${data.dashboardData.dashboardName}":
${widgetsSummary}

Forneça uma análise completa incluindo:
1. Performance atual da campanha
2. Efetividade em relação aos objetivos
3. Pontos fortes e fraquezas identificados
4. Oportunidades de melhoria
5. Estratégias recomendadas para otimização

Retorne a resposta em formato JSON com as seguintes chaves:
- analysis: análise completa em texto
- recommendations: array de recomendações específicas
- insights: array de insights estratégicos
    `.trim();
  }

  private parseCampaignAnalysis(response: string): {
    analysis: string;
    recommendations: string[];
    insights: string[];
  } {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(response);
      return {
        analysis: parsed.analysis || response,
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        insights: Array.isArray(parsed.insights) ? parsed.insights : []
      };
    } catch {
      // If not JSON, try to extract sections from text
      const sections = response.split('\n\n');
      const analysis = sections.find(s => s.toLowerCase().includes('análise') || s.toLowerCase().includes('performance')) || response;
      const recommendations = sections.filter(s => s.toLowerCase().includes('recomenda') || s.toLowerCase().includes('ação')).map(s => s.replace(/^.*?:\s*/, ''));
      const insights = sections.filter(s => s.toLowerCase().includes('insight') || s.toLowerCase().includes('tendência')).map(s => s.replace(/^.*?:\s*/, ''));

      return {
        analysis,
        recommendations: recommendations.length > 0 ? recommendations : ['Análise completa disponível no relatório detalhado'],
        insights: insights.length > 0 ? insights : ['Insights estratégicos disponíveis no relatório completo']
      };
    }
  }
}

// Create a singleton instance
const aiService = new AIService();

export default aiService;
