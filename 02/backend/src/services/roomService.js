import { randomUUID } from "crypto";

const rooms = new Map();

const defaultRoomState = () => ({
  code: "",
  language: "javascript",
  users: [],
});

const createRoom = () => {
  const roomId = randomUUID();
  rooms.set(roomId, { roomId, ...defaultRoomState() });
  return roomId;
};

const ensureRoom = (roomId) => {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, { roomId, ...defaultRoomState() });
  }
  return rooms.get(roomId);
};

const getRoom = (roomId) => rooms.get(roomId) || null;

const updateCode = (roomId, code) => {
  const room = ensureRoom(roomId);
  room.code = code;
  return room;
};

const updateLanguage = (roomId, language) => {
  const room = ensureRoom(roomId);
  room.language = language;
  return room;
};

const addUser = (roomId, user) => {
  const room = ensureRoom(roomId);
  if (!room.users.find((u) => u.userId === user.userId)) {
    room.users.push(user);
  }
  return room;
};

const removeUser = (roomId, userId) => {
  const room = rooms.get(roomId);
  if (!room) return null;
  room.users = room.users.filter((u) => u.userId !== userId);
  return room;
};

// Test-only helper to clear all rooms between runs.
const resetAll = () => rooms.clear();

export default {
  createRoom,
  getRoom,
  ensureRoom,
  updateCode,
  updateLanguage,
  addUser,
  removeUser,
  resetAll,
};

