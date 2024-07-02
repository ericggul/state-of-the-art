import { Server } from "socket.io";

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: "/api/socket", // Ensure you set the path to match the client side
  });
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("send-message", (obj) => {
      io.emit("receive-message", obj);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  console.log("Setting up socket");
  res.end();
}
