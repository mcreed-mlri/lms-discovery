import { NextResponse } from "next/server";

import { resolveDataMode } from "@/lib/data-mode";

export const dynamic = "force-dynamic";

export async function GET() {
  const { dataMode, allowMockData, allowDemoAccounts } = resolveDataMode();

  return NextResponse.json({
    ok: true,
    dataMode,
    allowMockData,
    allowDemoAccounts,
  });
}
