import { Server } from "socket.io";

import mobileSetup from "./socket-setups/mobile";

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    mobileSetup({ socket, io });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  console.log("Setting up socket");
  res.end();
}
