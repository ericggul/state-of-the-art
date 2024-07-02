"use client";

import { useEffect, useRef } from "react";
import io from "socket.io-client"; // Moved import inside the module

export default function Mobile() {
  const socket = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      socketInitializer();
      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    }
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket.current = io();

    socket.current.on("connect", () => {
      console.log("socket connected");
    });

    socket.current.on("test", () => {
      console.log("20");
      console.log("test");
    });
  };

  console.log(socket);
  return null;
}
