import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
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
    const session = await auth();

    if (!session?.user?.id) {
      console.log("[API] Unauthorized: No session or user ID");
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    console.log("[API] Fetching dashboards for user:", session.user.id);

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
    const session = await auth();

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
      const mockWidgets = [];

      if (template === 'meta_ads') {
        mockWidgets.push(
          { type: 'kpi', title: 'Investimento Total', config: { value: 'R$ 12.450', change: 15 }, position: { x: 0, y: 0, w: 3, h: 2 }, dashboardId: dashboard.id },
          { type: 'kpi', title: 'Impressões', config: { value: '450.2K', change: 8 }, position: { x: 3, y: 0, w: 3, h: 2 }, dashboardId: dashboard.id },
          { type: 'kpi', title: 'Cliques (Link)', config: { value: '12.8K', change: -3 }, position: { x: 6, y: 0, w: 3, h: 2 }, dashboardId: dashboard.id },
          { type: 'kpi', title: 'CTR Médio', config: { value: '2.85%', change: 0.5 }, position: { x: 9, y: 0, w: 3, h: 2 }, dashboardId: dashboard.id },
          { type: 'bar', title: 'Investimento por Campanha', config: { dataSource: 'meta_ads', metric: 'campaigns', index: 'name', category: 'spend' }, position: { x: 0, y: 2, w: 6, h: 4 }, dashboardId: dashboard.id },
          { type: 'line', title: 'Investimento Diário', config: { dataSource: 'meta_ads', metric: 'daily' }, position: { x: 6, y: 2, w: 6, h: 4 }, dashboardId: dashboard.id }
        );
      } else if (template === 'google_ads') {
        mockWidgets.push(
          { type: 'kpi', title: 'Custo Total', config: { value: 'R$ 8.920', change: 5 }, position: { x: 0, y: 0, w: 3, h: 2 }, dashboardId: dashboard.id },
          { type: 'kpi', title: 'Conversões', config: { value: '340', change: 12 }, position: { x: 3, y: 0, w: 3, h: 2 }, dashboardId: dashboard.id },
          { type: 'kpi', title: 'CPA Médio', config: { value: 'R$ 26,23', change: -5 }, position: { x: 6, y: 0, w: 3, h: 2 }, dashboardId: dashboard.id },
          { type: 'kpi', title: 'Taxa de Conv.', config: { value: '4.2%', change: 0.8 }, position: { x: 9, y: 0, w: 3, h: 2 }, dashboardId: dashboard.id },
          { type: 'line', title: 'Desempenho Semanal', config: { dataSource: 'google_ads', metric: 'daily' }, position: { x: 0, y: 2, w: 12, h: 4 }, dashboardId: dashboard.id }
        );
      } else if (template === 'ga4') {
        mockWidgets.push(
          { type: 'kpi', title: 'Usuários Ativos', config: { value: '45.2K', change: 22 }, position: { x: 0, y: 0, w: 3, h: 2 }, dashboardId: dashboard.id },
          { type: 'kpi', title: 'Novos Usuários', config: { value: '38.1K', change: 25 }, position: { x: 3, y: 0, w: 3, h: 2 }, dashboardId: dashboard.id },
          { type: 'kpi', title: 'Tempo Médio', config: { value: '2m 45s', change: 10 }, position: { x: 6, y: 0, w: 3, h: 2 }, dashboardId: dashboard.id },
          { type: 'kpi', title: 'Taxa de Engaj.', config: { value: '55%', change: 5 }, position: { x: 9, y: 0, w: 3, h: 2 }, dashboardId: dashboard.id },
          { type: 'bar', title: 'Origem de Tráfego', config: { dataSource: 'ga4', metric: 'traffic_sources', index: 'source', category: 'sessions' }, position: { x: 0, y: 2, w: 12, h: 4 }, dashboardId: dashboard.id }
        );
      }

      if (mockWidgets.length > 0) {
        await prisma.widget.createMany({
          data: mockWidgets,
        });
      }
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
