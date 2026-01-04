import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generateSlug } from "@/lib/utils";
import { nanoid } from "nanoid";

const createDashboardSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  template: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const dashboards = await prisma.dashboard.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        widgets: true,
        _count: {
          select: { widgets: true },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ dashboards });
  } catch (error) {
    console.error("Error fetching dashboards:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dashboards" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, template } = createDashboardSchema.parse(body);

    // Generate unique slug
    let slug = generateSlug(name);
    const existingSlug = await prisma.dashboard.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      slug = `${slug}-${nanoid(6)}`;
    }

    // Create dashboard
    const dashboard = await prisma.dashboard.create({
      data: {
        name,
        slug,
        description,
        template,
        userId: session.user.id,
        layout: {},
      },
    });

    // If template is specified, load template widgets
    if (template) {
      // TODO: Load template from database or built-in templates
      // For now, we'll leave it empty and handle template loading separately
    }

    return NextResponse.json({ dashboard }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating dashboard:", error);
    return NextResponse.json(
      { error: "Erro ao criar dashboard" },
      { status: 500 }
    );
  }
}
