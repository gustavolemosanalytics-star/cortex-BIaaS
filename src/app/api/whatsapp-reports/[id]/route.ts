import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateReportSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Número de telefone inválido').optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
  time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário deve estar no formato HH:MM').optional(),
  isActive: z.boolean().optional()
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const reportConfig = await prisma.whatsAppReportConfig.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        dashboard: {
          select: { id: true, name: true, slug: true }
        },
        reports: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!reportConfig) {
      return NextResponse.json({ error: 'Configuração não encontrada' }, { status: 404 });
    }

    return NextResponse.json(reportConfig);
  } catch (error) {
    console.error('Error fetching WhatsApp report config:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateReportSchema.parse(body);

    // Check if config exists and belongs to user
    const existingConfig = await prisma.whatsAppReportConfig.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    });

    if (!existingConfig) {
      return NextResponse.json({ error: 'Configuração não encontrada' }, { status: 404 });
    }

    // Update user's phone number if provided
    if (validatedData.phoneNumber) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { phone: validatedData.phoneNumber }
      });
    }

    // Update report configuration
    const updatedConfig = await prisma.whatsAppReportConfig.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        dashboard: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    return NextResponse.json(updatedConfig);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 });
    }

    console.error('Error updating WhatsApp report config:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Check if config exists and belongs to user
    const existingConfig = await prisma.whatsAppReportConfig.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    });

    if (!existingConfig) {
      return NextResponse.json({ error: 'Configuração não encontrada' }, { status: 404 });
    }

    // Delete the configuration (cascade will handle history)
    await prisma.whatsAppReportConfig.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Configuração removida com sucesso' });
  } catch (error) {
    console.error('Error deleting WhatsApp report config:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
