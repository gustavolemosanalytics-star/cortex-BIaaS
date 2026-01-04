import { NextRequest, NextResponse } from "next/server";
import { DataProviderFactory } from "@/lib/data-providers";

export async function GET(req: NextRequest) {
  try {
    // Fetch dados agregados de todas as fontes
    const result = await DataProviderFactory.fetchAggregatedData();

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching aggregated data:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar dados agregados" },
      { status: 500 }
    );
  }
}
