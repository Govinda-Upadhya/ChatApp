import { Server, Socket } from "socket.io";
import { createServer } from "http";
import jwt, { JwtPayload } from "jsonwebtoken";
import e from "express";
import { prismaClient } from "@repo/db/client";
interface User {
  name?: string;
  email?: string;
}
interface CustomSocket extends Socket {
  user?: User;
}
const app = e();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
  },
});
io.use((socket: CustomSocket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) return next(new Error("No token"));

  try {
    const decoded = jwt.verify(token, "secret") as JwtPayload;
    next();
  } catch (err) {
    console.error("Token invalid", err);
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);

  socket.on("message", (data: string) => {
    console.log("Message received:", data);
    socket.emit("ack", "hello client");
  });
  socket.on("joinroom", ({ roomId, friendname }) => {
    console.log("joinroom", roomId);
    socket.join(roomId);
    socket.emit("joinack", {
      mesage: "user joined room successfully",
      friendname,
    });
  });
  socket.on(
    "messagedelivery",
    async ({ message, roomId, curruser, friend }) => {
      console.log("messagetofriend", message, curruser, friend);
      const res = await prismaClient.chat.create({
        data: {
          message: message.message,
          sender: curruser,
          receiver: friend.username,
        },
      });
      if (!res) {
        return io
          .to(roomId)
          .emit("messagefromfriendnotreceived", { message: "error" });
      }
      io.to(roomId).emit("messagefromfriend", { message, user: curruser });
    }
  );
  socket.on("calloffer", async ({ offer, roomId }) => {
    socket.to(roomId).emit("videocalloffer", { offer });
  });
  socket.on("callanswer", async ({ answer, roomId }) => {
    socket.to(roomId).emit("callanswer", { answer });
  });
  socket.on("icecandidate", async ({ candidate, roomId }) => {
    socket.to(roomId).emit("peercandidate", { candidate });
  });
});

server.listen(3000, () => console.log("listening.."));
