import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
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

    if (!agentSession.paymentId) {
      return NextResponse.json({ error: 'Sessão não possui ID de pagamento' }, { status: 400 });
    }

    // Confirm payment with Stripe
    const paymentConfirmed = await stripeService.confirmPayment(agentSession.paymentId);

    if (paymentConfirmed) {
      return NextResponse.json({
        success: true,
        message: 'Pagamento confirmado com sucesso'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Pagamento ainda não foi confirmado'
      });
    }
  } catch (error) {
    console.error('Error confirming AI agent payment:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
