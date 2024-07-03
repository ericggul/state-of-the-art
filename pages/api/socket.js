import { Server } from "socket.io";

import setup from "./socket-setups";
// import mobileSetup from "./socket-setups/mobile";
// import screenSetup from "./socket-setups/screen";

export default function SocketHandler(req, res) {
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
