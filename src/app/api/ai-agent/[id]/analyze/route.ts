import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import aiService, { CampaignData } from '@/lib/ai-service';
import stripeService from '@/lib/stripe-service';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Get the AI agent session
    const agentSession = await prisma.aIAgentSession.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    });

    if (!agentSession) {
      return NextResponse.json({ error: 'Sessão do agente IA não encontrada' }, { status: 404 });
    }

    // Check if payment was confirmed
    if (!agentSession.paidAt) {
      return NextResponse.json({ error: 'Pagamento não confirmado' }, { status: 402 });
    }

    // Check if analysis already exists
    const existingAnalysis = await prisma.aIAgentAnalysis.findFirst({
      where: {
        sessionId: params.id,
        type: 'campaign_analysis'
      }
    });

    if (existingAnalysis) {
      return NextResponse.json({
        analysis: existingAnalysis,
        message: 'Análise já foi realizada para esta sessão'
      });
    }

    // Get dashboard data if dashboard is linked
    let dashboardData = null;
    if (agentSession.dashboardId) {
      const dashboard = await prisma.dashboard.findUnique({
        where: { id: agentSession.dashboardId! },
        include: {
          widgets: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });

      if (dashboard) {
        dashboardData = {
          dashboardName: dashboard.name,
          widgets: dashboard.widgets.map(widget => ({
            type: widget.type,
            title: widget.title,
            data: widget.config // Assuming config contains the data
          })),
          userInfo: {
            name: session.user.name,
            email: session.user.email!
          }
        };
      }
    }

    // Prepare campaign data for AI analysis
    const campaignData: CampaignData = {
      campaignName: agentSession.campaignName,
      campaignGoal: agentSession.campaignGoal,
      dashboardData: dashboardData || {
        dashboardName: 'Dashboard não vinculado',
        widgets: [],
        userInfo: {
          name: session.user.name,
          email: session.user.email!
        }
      }
    };

    // Perform AI analysis
    const analysisResult = await aiService.analyzeCampaign(campaignData);

    // Save analysis results
    const analysis = await prisma.aIAgentAnalysis.create({
      data: {
        sessionId: params.id,
        type: 'campaign_analysis',
        title: `Análise: ${agentSession.campaignName}`,
        content: analysisResult.analysis,
        data: {
          recommendations: analysisResult.recommendations,
          insights: analysisResult.insights
        }
      }
    });

    // Create additional analyses for recommendations and insights
    if (analysisResult.recommendations.length > 0) {
      await prisma.aIAgentAnalysis.create({
        data: {
          sessionId: params.id,
          type: 'recommendations',
          title: 'Recomendações de Otimização',
          content: analysisResult.recommendations.join('\n\n'),
          data: { recommendations: analysisResult.recommendations }
        }
      });
    }

    if (analysisResult.insights.length > 0) {
      await prisma.aIAgentAnalysis.create({
        data: {
          sessionId: params.id,
          type: 'insights',
          title: 'Insights Estratégicos',
          content: analysisResult.insights.join('\n\n'),
          data: { insights: analysisResult.insights }
        }
      });
    }

    return NextResponse.json({
      analysis: analysis,
      recommendations: analysisResult.recommendations,
      insights: analysisResult.insights
    });
  } catch (error) {
    console.error('Error performing AI analysis:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
