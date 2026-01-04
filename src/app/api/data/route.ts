import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DataProviderFactory } from "@/lib/data-providers";
import { type IntegrationId } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Permitir acesso público para dashboards públicos
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    // }

    const body = await req.json();
    const { source, metric, dateRange, options } = body;

    if (!source || !metric) {
      return NextResponse.json(
        { error: "source e metric são obrigatórios" },
        { status: 400 }
      );
    }

    // Fetch data do provider
    const result = await DataProviderFactory.fetchData(
      source as IntegrationId,
      metric,
      dateRange,
      options
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar dados" },
      { status: 500 }
    );
  }
}
