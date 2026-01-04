import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateDashboardSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isPublished: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  password: z.string().optional(),
  layout: z.any().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    const dashboard = await prisma.dashboard.findUnique({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const dashboard = await prisma.dashboard.findUnique({
      where: { id: params.id },
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
    const data = updateDashboardSchema.parse(body);

    const updatedDashboard = await prisma.dashboard.update({
      where: { id: params.id },
      data,
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const dashboard = await prisma.dashboard.findUnique({
      where: { id: params.id },
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
      where: { id: params.id },
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
