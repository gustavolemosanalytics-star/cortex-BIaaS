import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import aiService from '@/lib/ai-service';
import whatsAppService from '@/lib/whatsapp-service';

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

    // Get the WhatsApp report configuration
    const reportConfig = await prisma.whatsAppReportConfig.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        isActive: true
      },
      include: {
        dashboard: {
          include: {
            widgets: {
              orderBy: { createdAt: 'asc' }
            }
          }
        }
      }
    });

    if (!reportConfig) {
      return NextResponse.json({ error: 'Configuração de relatório não encontrada ou inativa' }, { status: 404 });
    }

    // Prepare dashboard data for AI report generation
    const dashboardData = {
      dashboardName: reportConfig.dashboard.name,
      widgets: reportConfig.dashboard.widgets.map(widget => ({
        type: widget.type,
        title: widget.title,
        data: widget.config // Assuming config contains the data
      })),
      userInfo: {
        name: session.user.name,
        email: session.user.email!
      }
    };

    // Generate AI report
    const reportContent = await aiService.generateDashboardReport(dashboardData);

    // Send report via WhatsApp
    const success = await whatsAppService.sendReport(params.id, reportContent);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Relatório enviado com sucesso via WhatsApp'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Falha ao enviar relatório via WhatsApp'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error sending WhatsApp report:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
