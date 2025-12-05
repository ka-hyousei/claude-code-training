import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { HealthCheckResponse } from "@/lib/types";

/**
 * ヘルスチェックエンドポイント
 * GET /api/health
 *
 * サーバーの稼働状態を確認するためのシンプルなエンドポイント
 */
export async function GET(_request: NextRequest) {
  const response: HealthCheckResponse = {
    status: "ok",
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status: 200 });
}
