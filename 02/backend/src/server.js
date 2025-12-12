import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import roomRoutes from "./routes/rooms.js";
import executeRoutes from "./routes/execute.js";
import registerSocketHandlers from "./socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/rooms", roomRoutes);
app.use("/execute", executeRoutes);

// Serve built frontend assets when available (e.g., in Docker image)
const clientDistPath = path.resolve(__dirname, "../../frontend/dist");
if (process.env.SERVE_STATIC !== "false" && fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: "*" },
});

registerSocketHandlers(io);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`API ready on port ${PORT}`);
});

export { app, httpServer, io };

