import { Server, Socket } from "socket.io";
import { createServer } from "http";
import e from "express";

const app = e();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
  },
});

io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);

  socket.on("message", (data: string) => {
    console.log("Message received:", data);
    socket.emit("ack", "hello client");
  });
  socket.on("joinroom", ({ roomId }) => {
    console.log("joinroom", roomId);
    socket.join(roomId);
    socket.emit("joinack", "user joined room successfully");
  });
  socket.on("messagedelivery", ({ message, roomId, curruser }) => {
    console.log("messagetofriend", message, curruser);
    io.to(roomId).emit("messagefromfriend", { message, user: curruser });
  });
});

server.listen(3000, () => console.log("listening.."));
