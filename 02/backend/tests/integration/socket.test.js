import { describe, it, beforeEach, afterEach, expect } from "vitest";
import request from "supertest";
import { io as Client } from "socket.io-client";
import { createTestServer } from "./setup.js";
import roomService from "../../src/services/roomService.js";

const waitForEvent = (socket, event) =>
  new Promise((resolve) => socket.once(event, resolve));

const connectClient = async (port, { roomId, userId, username }) => {
  const socket = new Client(`http://localhost:${port}`, {
    transports: ["websocket"],
    forceNew: true,
  });
  await waitForEvent(socket, "connect");
  const syncPromise = waitForEvent(socket, "sync_state");
  socket.emit("join_room", { roomId, userId, username });
  await syncPromise;
  return socket;
};

describe("Socket.IO events", () => {
  let server;
  let port;

  beforeEach(async () => {
    roomService.resetAll();
    server = createTestServer();
    port = await server.listen();
  });

  afterEach(async () => {
    await server.close();
  });

  it(
    "code_change broadcasts between clients",
    async () => {
    const { body } = await request(server.app).post("/rooms");
    const roomId = body.roomId;

    const clientA = await connectClient(port, { roomId, userId: "A" });
    const clientB = await connectClient(port, { roomId, userId: "B" });

    const promise = waitForEvent(clientB, "code_change");
    clientA.emit("code_change", { roomId, code: "print('hi')" });

    const payload = await promise;
    expect(payload.code).toBe("print('hi')");

    clientA.close();
    clientB.close();
    },
    10000
  );

  it(
    "user_joined is emitted to other clients",
    async () => {
    const { body } = await request(server.app).post("/rooms");
    const roomId = body.roomId;

    const clientA = await connectClient(port, {
      roomId,
      userId: "A",
      username: "Alice",
    });
    const joinedPromise = waitForEvent(clientA, "user_joined");
    const clientB = await connectClient(port, {
      roomId,
      userId: "B",
      username: "Bob",
    });

    const payload = await joinedPromise;
    expect(payload.userId).toBe("B");
    expect(payload.username).toBe("Bob");

    clientA.close();
    clientB.close();
    },
    10000
  );

  it(
    "language_change broadcasts to others",
    async () => {
    const { body } = await request(server.app).post("/rooms");
    const roomId = body.roomId;

    const clientA = await connectClient(port, { roomId, userId: "A" });
    const clientB = await connectClient(port, { roomId, userId: "B" });

    const promise = waitForEvent(clientB, "language_change");
    clientA.emit("language_change", { roomId, language: "python" });

    const payload = await promise;
    expect(payload.language).toBe("python");

    clientA.close();
    clientB.close();
    },
    10000
  );

  it(
    "chat_message broadcasts to all users in room",
    async () => {
    const { body } = await request(server.app).post("/rooms");
    const roomId = body.roomId;

    const clientA = await connectClient(port, {
      roomId,
      userId: "A",
      username: "Alice",
    });
    const clientB = await connectClient(port, {
      roomId,
      userId: "B",
      username: "Bob",
    });

    // Client B listens for chat message
    const promiseB = waitForEvent(clientB, "chat_message");
    // Client A also listens to verify sender receives it too
    const promiseA = waitForEvent(clientA, "chat_message");

    // Client A sends a chat message
    clientA.emit("chat_message", {
      roomId,
      userId: "A",
      nickname: "Alice",
      content: "Hello everyone!",
    });

    // Both clients should receive the message
    const payloadB = await promiseB;
    const payloadA = await promiseA;

    expect(payloadB.userId).toBe("A");
    expect(payloadB.nickname).toBe("Alice");
    expect(payloadB.content).toBe("Hello everyone!");

    expect(payloadA.userId).toBe("A");
    expect(payloadA.nickname).toBe("Alice");
    expect(payloadA.content).toBe("Hello everyone!");

    clientA.close();
    clientB.close();
    },
    10000
  );
});

