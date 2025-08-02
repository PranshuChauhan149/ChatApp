import express from "express";
import http from "http";
import "dotenv/config";
import cors from "cors";
import connectDb from "./config/DB.js";
import userRoute from "./routes/userRoute.js";
import MessageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import { Socket } from "dgram";

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: "*" },
});

export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  // console.log("User COnnected ", userId);

  if (userId) userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    // console.log("User Disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => {
  res.send("server is Live");
});

app.use("/api/auth", userRoute);
app.use("/api/messages", MessageRouter);
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT;
  server.listen(PORT, () => {
    connectDb();
    console.log(`The server is run on this PORT ${PORT}`);
  });
}

export default server;