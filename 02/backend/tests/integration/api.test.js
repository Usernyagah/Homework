import { describe, it, beforeAll, afterAll, afterEach, expect, vi } from "vitest";
import request from "supertest";
import { createTestServer } from "./setup.js";
import executeService from "../../src/services/executeService.js";
import roomService from "../../src/services/roomService.js";

describe("API routes", () => {
  const server = createTestServer();

  beforeAll(() => {
    roomService.resetAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await server.close();
  });

  it("POST /rooms returns roomId", async () => {
    const res = await request(server.app).post("/rooms");
    expect(res.status).toBe(201);
    expect(res.body.roomId).toBeDefined();
  });

  it("GET /rooms/:roomId returns room info", async () => {
    const { body } = await request(server.app).post("/rooms");
    const roomId = body.roomId;

    const res = await request(server.app).get(`/rooms/${roomId}`);
    expect(res.status).toBe(200);
    expect(res.body.roomId).toBe(roomId);
    expect(res.body).toHaveProperty("code");
    expect(res.body).toHaveProperty("language");
    expect(res.body).toHaveProperty("users");
  });

  it("POST /execute returns execution result", async () => {
    vi.spyOn(executeService, "executeCode").mockResolvedValue({
      output: "hello",
      error: null,
    });

    const res = await request(server.app)
      .post("/execute")
      .send({ language: "javascript", code: "console.log('hi')" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ output: "hello" });
  });
});

