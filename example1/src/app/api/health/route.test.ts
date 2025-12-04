import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/health", () => {
  it("200ステータスコードを返すこと", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
  });

  it("レスポンスボディにstatusフィールドが含まれること", async () => {
    const response = await GET();
    const body = await response.json();
    expect(body.status).toBe("ok");
  });

  it("レスポンスボディにtimestampフィールドが含まれること", async () => {
    const response = await GET();
    const body = await response.json();
    expect(body).toHaveProperty("timestamp");
  });

  it("timestampがISO 8601形式であること", async () => {
    const response = await GET();
    const body = await response.json();
    // ISO 8601形式: YYYY-MM-DDTHH:mm:ss.sssZ
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    expect(body.timestamp).toMatch(iso8601Regex);
  });

  it("レスポンスのContent-TypeがJSONであること", async () => {
    const response = await GET();
    const contentType = response.headers.get("content-type");
    expect(contentType).toContain("application/json");
  });
});
