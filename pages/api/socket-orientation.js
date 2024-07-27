import { Server } from "socket.io";

import setup from "./socket-setups/orientation";

export default function OrientationSocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    setup({ socket, io });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  console.log("Setting up socket");
  res.end();
}
