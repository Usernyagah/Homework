import { describe, it, expect, beforeEach } from "vitest";
import roomService from "../src/services/roomService.js";

describe("roomService", () => {
  beforeEach(() => {
    roomService.resetAll();
  });

  it("createRoom returns a unique id and default state", () => {
    const roomId = roomService.createRoom();
    expect(roomId).toBeDefined();
    const room = roomService.getRoom(roomId);
    expect(room.code).toBe("");
    expect(room.language).toBe("javascript");
    expect(room.users).toEqual([]);
  });

  it("ensureRoom initializes missing rooms", () => {
    const roomId = "custom-room";
    const room = roomService.ensureRoom(roomId);
    expect(room.roomId).toBe(roomId);
    const fetched = roomService.getRoom(roomId);
    expect(fetched).toBeTruthy();
  });
});

