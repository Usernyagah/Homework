import roomService from "../services/roomService.js";

export const createRoom = (_req, res) => {
  const roomId = roomService.createRoom();
  res.status(201).json({ roomId });
};

export const getRoom = (req, res) => {
  const { roomId } = req.params;
  const room = roomService.getRoom(roomId);
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }
  res.json(room);
};

