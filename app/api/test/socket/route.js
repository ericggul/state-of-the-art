import { Server } from "socket.io";

import setup from "./socket-setups";
import orientationSetup from "./socket-setups/orientation";
import onOffSetup from "./socket-setups/on-off";

export async function GET(req, res) {
  console.log("8", res);
  if (res.socket.server.io) {
    console.log("Socket already set up");
    res.end();
    return;
  }

  // const io = new Server({
  //   path: "/api/socket",
  // });

  console.log("18");
  const io = new Server(res.socket.server, {
    path: "/api/socket",
  });

  console.log("20", io);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    setup({ socket, io });
    orientationSetup({ socket, io });
    onOffSetup({ socket, io });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  console.log("Setting up socket");
  res.end();
}
