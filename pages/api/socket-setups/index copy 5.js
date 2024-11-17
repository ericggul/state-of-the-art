// Constants
import { HEARTBEAT_TIMEOUT, HEARTBEAT_INTERVAL } from "@/utils/constant";

// Track single active mobile
let activeMobile = null;

export default function mobileSetup({ socket, io }) {
  // Initialization
  socket.on("screen-init", (data) => {
    socket.join("screen");
    socket.join(`screen-${data.layerIdx}`);
  });

  socket.on("mobile-init", ({ mobileId, timestamp }) => {
    console.log(`📱 Mobile init: ${mobileId}`, { timestamp });
    // Track new mobile connection
    activeMobile = {
      mobileId,
      socketId: socket.id,
      lastHeartbeat: timestamp,
      status: "active",
    };

    socket.join("mobile");
    socket.emit("mobile-init", { mobileId });
    socket.to("controller").emit("new-mobile-init", { mobileId });
    socket.to("screen").emit("new-mobile-init", { mobileId });
    socket.to("screen").emit("new-mobile-visibility-change", {
      isVisible: true,
      mobileId,
      origin: "init",
    });
  });

  socket.on("controller-init", () => {
    socket.join("controller");
  });

  // Visibility & Heartbeat
  socket.on("mobile-new-visibility-change", (data) => {
    if (activeMobile?.mobileId === data.mobileId) {
      activeMobile.status = data.isVisible ? "active" : "inactive";
      activeMobile.lastHeartbeat = data.timestamp;

      socket.to("controller").emit("new-mobile-visibility-change", data);
      socket.to("screen").emit("new-mobile-visibility-change", data);
    }
  });

  socket.on("mobile-new-heartbeat", ({ mobileId, timestamp }) => {
    if (activeMobile?.mobileId === mobileId) {
      console.log(`💓 Heartbeat from ${mobileId}:`, {
        timestamp,
        lastHeartbeat: activeMobile.lastHeartbeat,
        timeDiff: timestamp - activeMobile.lastHeartbeat,
      });
      activeMobile.lastHeartbeat = timestamp;

      if (activeMobile.status === "inactive") {
        activeMobile.status = "active";
        socket.to("controller").emit("new-mobile-visibility-change", {
          mobileId,
          isVisible: true,
          origin: "heartbeat",
          timestamp,
        });
        socket.to("screen").emit("new-mobile-visibility-change", {
          mobileId,
          isVisible: true,
          origin: "heartbeat",
          timestamp,
        });
      }
    }
  });

  // Simple heartbeat checker
  if (!global.heartbeatChecker) {
    global.heartbeatChecker = setInterval(() => {
      if (activeMobile && activeMobile.status === "active") {
        socket.emit("request-timestamp", { mobileId: activeMobile.mobileId });
      }
    }, HEARTBEAT_INTERVAL);
  }

  socket.on("timestamp-response", ({ mobileId, timestamp }) => {
    if (activeMobile?.mobileId === mobileId) {
      const timeSinceLastHeartbeat = timestamp - activeMobile.lastHeartbeat;
      console.log(`⏱️ Timestamp check for ${mobileId}:`, {
        current: timestamp,
        last: activeMobile.lastHeartbeat,
        diff: timeSinceLastHeartbeat,
        timeout: HEARTBEAT_TIMEOUT,
      });

      if (timeSinceLastHeartbeat > HEARTBEAT_TIMEOUT) {
        activeMobile.status = "inactive";
        io.to("controller").emit("new-mobile-visibility-change", {
          mobileId: activeMobile.mobileId,
          isVisible: false,
          origin: "heartbeat_timeout",
          timestamp,
        });
        io.to("screen").emit("new-mobile-visibility-change", {
          mobileId: activeMobile.mobileId,
          isVisible: false,
          origin: "heartbeat_timeout",
          timestamp,
        });
      }
    }
  });

  //////////MESSAGE HANDLING//////////
  //controller -> screen
  //v1 logic
  socket.on("controller-new-architectures", (data) => {
    socket.to("screen").emit("new-controller-architectures", data);
  });

  socket.on("controller-new-speech", (data) => {
    socket.to("screen").emit("new-controller-speech", data);
  });

  //controller <-> mobile
  socket.on("controller-new-response", (data) => {
    socket.to("mobile").emit("new-controller-response", data);
  });

  socket.on("mobile-new-response", (data) => {
    socket.to("controller").emit("new-mobile-response", data);
  });

  //v2 logic - mobile -> screen/controller
  socket.on("mobile-new-architecture", (data) => {
    socket.to("controller").emit("new-mobile-architecture", data);
    socket.to("screen").emit("new-mobile-architecture", data);
  });

  socket.on("mobile-new-speech", (data) => {
    socket.to("screen").emit("new-mobile-speech", data);
  });

  socket.on("mobile-new-intro", (data) => {
    socket.to("screen").emit("new-mobile-intro", data);
  });

  //backend: inter-screen conversation
  socket.on("screen-new-conversation", (data) => {
    socket.to("screen").emit("new-screen-conversation", data);
  });
}
