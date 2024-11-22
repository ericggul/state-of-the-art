import { Server } from "socket.io";

import setup from "./socket-setups";
import orientationSetup from "./socket-setups/orientation";
import gartienceSetup from "./socket-setups/gartience";

import * as CONST from "@/utils/constant";

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    pingInterval: CONST.PING_INTERVAL,
    pingTimeout: CONST.PING_TIMEOUT,
    cors: {
      origin: "*",
    },
    transports: ["websocket", "polling"],
  });

  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    setup({ socket, io });
    orientationSetup({ socket, io });
    gartienceSetup({ socket, io });

    socket.on("disconnect", (reason) => {
      console.log(`Client disconnected (${reason}):`, socket.id);
    });
  });

  console.log("Setting up socket with enhanced ping configuration");
  res.end();
}
