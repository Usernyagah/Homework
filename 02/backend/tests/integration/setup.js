import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import roomRoutes from "../../src/routes/rooms.js";
import executeRoutes from "../../src/routes/execute.js";
import registerSocketHandlers from "../../src/socket.js";

export const createTestServer = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/rooms", roomRoutes);
  app.use("/execute", executeRoutes);

  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" },
  });
  registerSocketHandlers(io);

  const listen = () =>
    new Promise((resolve) => {
      httpServer.listen(0, () => {
        const { port } = httpServer.address();
        resolve(port);
      });
    });

  const close = () =>
    new Promise((resolve) => {
      io.close(() => {
        httpServer.close(() => resolve());
      });
    });

  return { app, io, httpServer, listen, close };
};

