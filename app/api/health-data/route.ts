import { NextResponse } from "next/server";
import { fetchHealthData } from "@/domains/people/health/services/healthDataService";

export async function GET() {
  const data = await fetchHealthData();
  return NextResponse.json(data);
}
