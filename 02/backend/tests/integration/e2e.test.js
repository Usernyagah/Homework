import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import request from "supertest";
import { io as Client } from "socket.io-client";
import { createTestServer } from "./setup.js";
import roomService from "../../src/services/roomService.js";
import executeService from "../../src/services/executeService.js";

const waitForEvent = (socket, event) =>
  new Promise((resolve) => socket.once(event, resolve));

const connectClient = async (port, { roomId, userId }) => {
  const socket = new Client(`http://localhost:${port}`, {
    transports: ["websocket"],
    forceNew: true,
  });
  await waitForEvent(socket, "connect");
  const syncPromise = waitForEvent(socket, "sync_state");
  socket.emit("join_room", { roomId, userId });
  await syncPromise;
  return socket;
};

describe("End-to-end flow", () => {
  let server;
  let port;

  beforeEach(async () => {
    roomService.resetAll();
    vi.restoreAllMocks();
    server = createTestServer();
    port = await server.listen();
  });

  afterEach(async () => {
    await server.close();
  });

  it(
    "creates room, syncs code, and executes code",
    async () => {
    vi.spyOn(executeService, "executeCode").mockResolvedValue({
      output: "42",
      error: null,
    });

      const { body } = await request(server.app).post("/rooms");
      const roomId = body.roomId;

      const clientA = await connectClient(port, { roomId, userId: "A" });
      const clientB = await connectClient(port, { roomId, userId: "B" });

      const syncPromise = waitForEvent(clientB, "code_change");

    // Sync code across users
    clientA.emit("code_change", { roomId, code: "answer = 42" });
    const syncPayload = await syncPromise;
    expect(syncPayload.code).toBe("answer = 42");

    // Execute code via API (mocked)
    const execRes = await request(server.app)
      .post("/execute")
      .send({ language: "python", code: "print(42)" });
    expect(execRes.status).toBe(200);
    expect(execRes.body.output).toBe("42");

      clientA.close();
      clientB.close();
    },
    12000
  );
});

