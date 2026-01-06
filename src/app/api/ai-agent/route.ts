import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import aiService, { CampaignData } from '@/lib/ai-service';
import stripeService from '@/lib/stripe-service';

const prisma = new PrismaClient();

const createAgentSessionSchema = z.object({
  campaignName: z.string().min(1, 'Nome da campanha é obrigatório'),
  campaignGoal: z.string().min(1, 'Objetivo da campanha é obrigatório'),
  dashboardId: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const agentSessions = await prisma.aIAgentSession.findMany({
      where: { userId: session.user.id },
      include: {
        dashboard: {
          select: { id: true, name: true, slug: true }
        },
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(agentSessions);
  } catch (error) {
    console.error('Error fetching AI agent sessions:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createAgentSessionSchema.parse(body);

    // Check if dashboard exists and belongs to user (if provided)
    let dashboard = null;
    if (validatedData.dashboardId) {
      dashboard = await prisma.dashboard.findFirst({
        where: {
          id: validatedData.dashboardId,
          userId: session.user.id
        }
      });

      if (!dashboard) {
        return NextResponse.json({ error: 'Dashboard não encontrado' }, { status: 404 });
      }
    }

    // Create payment intent for R$ 20.00
    const paymentIntent = await stripeService.createAIAgentPayment(session.user.id, 20);

    // Create AI agent session
    const agentSession = await prisma.aIAgentSession.create({
      data: {
        userId: session.user.id,
        dashboardId: validatedData.dashboardId,
        campaignName: validatedData.campaignName,
        campaignGoal: validatedData.campaignGoal,
        paymentId: paymentIntent.id,
        amount: 20.00,
        currency: 'BRL',
        status: 'active'
      },
      include: {
        dashboard: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    return NextResponse.json({
      session: agentSession,
      paymentIntent: {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      }
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 });
    }

    console.error('Error creating AI agent session:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
