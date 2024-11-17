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
    // Track new mobile connection
    activeMobile = {
      mobileId,
      socketId: socket.id,
      lastHeartbeat: timestamp || Date.now(),
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
      activeMobile.lastHeartbeat = timestamp;

      if (activeMobile.status === "inactive") {
        activeMobile.status = "active";
        socket.to("controller").emit("new-mobile-visibility-change", {
          mobileId,
          isVisible: true,
          origin: "heartbeat",
        });
        socket.to("screen").emit("new-mobile-visibility-change", {
          mobileId,
          isVisible: true,
          origin: "heartbeat",
        });
      }
    }
  });

  // Simple heartbeat checker
  if (!global.heartbeatChecker) {
    global.heartbeatChecker = setInterval(() => {
      if (activeMobile && activeMobile.status === "active") {
        const now = Date.now();
        const timeSinceLastHeartbeat = now - activeMobile.lastHeartbeat;

        // If no heartbeat received within timeout period
        if (timeSinceLastHeartbeat > HEARTBEAT_TIMEOUT) {
          // Mark as inactive and notify
          activeMobile.status = "inactive";
          io.to("controller").emit("new-mobile-visibility-change", {
            mobileId: activeMobile.mobileId,
            isVisible: false,
            origin: "heartbeat_timeout",
          });
          io.to("screen").emit("new-mobile-visibility-change", {
            mobileId: activeMobile.mobileId,
            isVisible: false,
            origin: "heartbeat_timeout",
          });
        }
      }
    }, HEARTBEAT_INTERVAL);
  }

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
