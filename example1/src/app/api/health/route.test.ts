import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET } from "./route";

/**
 * Next.js Route Handlerのテスト
 *
 * Route Handlerは関数を直接インポートしてテストする方法を使用
 * NextRequestを作成して、実際のHTTPリクエストに近い形でテスト可能
 */
describe("GET /api/health", () => {
  // テスト用のNextRequestを作成するヘルパー関数
  const createRequest = (url = "http://localhost:3000/api/health") => {
    return new NextRequest(url, { method: "GET" });
  };

  it("200ステータスコードを返すこと", async () => {
    const request = createRequest();
    const response = await GET(request);
    expect(response.status).toBe(200);
  });

  it("レスポンスボディにstatusフィールドが含まれること", async () => {
    const request = createRequest();
    const response = await GET(request);
    const body = await response.json();
    expect(body.status).toBe("ok");
  });

  it("レスポンスボディにtimestampフィールドが含まれること", async () => {
    const request = createRequest();
    const response = await GET(request);
    const body = await response.json();
    expect(body).toHaveProperty("timestamp");
  });

  it("timestampがISO 8601形式であること", async () => {
    const request = createRequest();
    const response = await GET(request);
    const body = await response.json();
    // ISO 8601形式: YYYY-MM-DDTHH:mm:ss.sssZ
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    expect(body.timestamp).toMatch(iso8601Regex);
  });

  it("レスポンスのContent-TypeがJSONであること", async () => {
    const request = createRequest();
    const response = await GET(request);
    const contentType = response.headers.get("content-type");
    expect(contentType).toContain("application/json");
  });
});
