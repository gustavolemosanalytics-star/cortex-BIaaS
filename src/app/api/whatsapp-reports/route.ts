import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createReportSchema = z.object({
  dashboardId: z.string(),
  phoneNumber: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Número de telefone inválido'),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário deve estar no formato HH:MM')
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const reports = await prisma.whatsAppReportConfig.findMany({
      where: { userId: session.user.id },
      include: {
        dashboard: {
          select: { id: true, name: true, slug: true }
        },
        _count: {
          select: { reports: true }
        }
      }
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching WhatsApp reports:', error);
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
    const validatedData = createReportSchema.parse(body);

    // Check if dashboard exists and belongs to user
    const dashboard = await prisma.dashboard.findFirst({
      where: {
        id: validatedData.dashboardId,
        userId: session.user.id
      }
    });

    if (!dashboard) {
      return NextResponse.json({ error: 'Dashboard não encontrado' }, { status: 404 });
    }

    // Check if report config already exists for this dashboard
    const existingConfig = await prisma.whatsAppReportConfig.findUnique({
      where: {
        userId_dashboardId: {
          userId: session.user.id,
          dashboardId: validatedData.dashboardId
        }
      }
    });

    if (existingConfig) {
      return NextResponse.json({ error: 'Já existe uma configuração de relatório para este dashboard' }, { status: 400 });
    }

    // Update user's phone number
    await prisma.user.update({
      where: { id: session.user.id },
      data: { phone: validatedData.phoneNumber }
    });

    // Create report configuration
    const reportConfig = await prisma.whatsAppReportConfig.create({
      data: {
        userId: session.user.id,
        dashboardId: validatedData.dashboardId,
        phoneNumber: validatedData.phoneNumber,
        frequency: validatedData.frequency,
        time: validatedData.time
      },
      include: {
        dashboard: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    return NextResponse.json(reportConfig, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 });
    }

    console.error('Error creating WhatsApp report config:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
