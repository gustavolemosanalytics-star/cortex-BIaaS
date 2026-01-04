import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateDashboardSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isPublished: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  password: z.string().optional(),
  layout: z.any().optional(),
  widgets: z.array(z.object({
    id: z.string().optional(),
    type: z.string(),
    title: z.string(),
    config: z.any(),
    position: z.any(),
  })).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    const dashboard = await prisma.dashboard.findUnique({
      where: { id },
      include: {
        widgets: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!dashboard) {
      return NextResponse.json(
        { error: "Dashboard não encontrado" },
        { status: 404 }
      );
    }

    // Check permissions
    if (dashboard.userId !== session?.user?.id && !dashboard.isPublic) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    return NextResponse.json({ dashboard });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dashboard" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const dashboard = await prisma.dashboard.findUnique({
      where: { id },
    });

    if (!dashboard) {
      return NextResponse.json(
        { error: "Dashboard não encontrado" },
        { status: 404 }
      );
    }

    if (dashboard.userId !== session.user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { widgets, ...data } = updateDashboardSchema.parse(body);

    const updatedDashboard = await prisma.$transaction(async (tx) => {
      const dashboard = await tx.dashboard.update({
        where: { id },
        data,
      });

      if (widgets) {
        // Delete existing widgets
        await tx.widget.deleteMany({
          where: { dashboardId: id },
        });

        // Create new ones
        if (widgets.length > 0) {
          await tx.widget.createMany({
            data: widgets.map((w) => ({
              type: w.type,
              title: w.title,
              config: w.config || {},
              position: w.position || {},
              dashboardId: id,
            })),
          });
        }
      }

      return tx.dashboard.findUnique({
        where: { id },
        include: { widgets: true },
      });
    });

    return NextResponse.json({ dashboard: updatedDashboard });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error updating dashboard:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar dashboard" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const dashboard = await prisma.dashboard.findUnique({
      where: { id },
    });

    if (!dashboard) {
      return NextResponse.json(
        { error: "Dashboard não encontrado" },
        { status: 404 }
      );
    }

    if (dashboard.userId !== session.user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    await prisma.dashboard.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting dashboard:", error);
    return NextResponse.json(
      { error: "Erro ao deletar dashboard" },
      { status: 500 }
    );
  }
}
