import roomService from "./services/roomService.js";

const socketRoomMap = new Map();

const withRoom = (roomId, cb) => {
  const room = roomService.ensureRoom(roomId);
  cb(room);
};

const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    socket.on("join_room", (payload) => {
      const { roomId, userId, username } = payload || {};
      if (!roomId || !userId) {
        return;
      }

      withRoom(roomId, (room) => {
        roomService.addUser(roomId, { userId, username });
        socket.join(roomId);
        socketRoomMap.set(socket.id, { roomId, userId });

        socket.emit("sync_state", {
          code: room.code,
          language: room.language,
          users: room.users,
        });

        socket.to(roomId).emit("user_joined", { userId, username });
      });
    });

    socket.on("code_change", ({ roomId, code }) => {
      if (!roomId) return;
      withRoom(roomId, () => roomService.updateCode(roomId, code ?? ""));
      socket.to(roomId).emit("code_change", { code });
    });

    socket.on("language_change", ({ roomId, language }) => {
      if (!roomId || !language) return;
      withRoom(roomId, () => roomService.updateLanguage(roomId, language));
      socket.to(roomId).emit("language_change", { language });
    });

    socket.on("chat_message", ({ roomId, userId, nickname, content }) => {
      if (!userId || !content) return;
      // Get roomId from socket mapping if not provided in payload
      const mapping = socketRoomMap.get(socket.id);
      const targetRoomId = roomId || mapping?.roomId;
      if (!targetRoomId) return;
      
      // Broadcast chat message to all users in the room (including sender)
      io.to(targetRoomId).emit("chat_message", { userId, nickname, content });
    });

    const handleLeave = () => {
      const mapping = socketRoomMap.get(socket.id);
      if (!mapping) return;
      const { roomId, userId } = mapping;
      roomService.removeUser(roomId, userId);
      socket.to(roomId).emit("user_left", { userId });
      socketRoomMap.delete(socket.id);
    };

    socket.on("disconnect", handleLeave);
    socket.on("leave_room", handleLeave);
  });
};

export default registerSocketHandlers;

