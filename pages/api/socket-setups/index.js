// Constants
import { HEARTBEAT_TIMEOUT, HEARTBEAT_INTERVAL } from "@/utils/constant";

// Track single active mobile
let activeMobile = null;

export default function mobileSetup({ socket, io }) {
  ///////////
  //INIT/////
  ///////////
  socket.on("mobile-init", ({ mobileId }) => {
    // Only allow one active mobile
    if (activeMobile) {
      console.log("Rejecting new mobile - one already active");
      return;
    }

    // Track new mobile connection
    activeMobile = {
      mobileId,
      socketId: socket.id,
      lastHeartbeat: Date.now(),
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

  socket.on("screen-init", (data) => {
    socket.join("screen");
    socket.join(`screen-${data.layerIdx}`);

    // Send current mobile state to new screen
    if (activeMobile) {
      socket.emit("new-mobile-visibility-change", {
        mobileId: activeMobile.mobileId,
        isVisible: activeMobile.status === "active",
        origin: "screen_init",
      });
    }
  });

  socket.on("controller-init", () => {
    socket.join("controller");
  });

  //////VISIBILITY & HEARTBEAT////
  socket.on("mobile-new-visibility-change", (data) => {
    if (activeMobile?.mobileId === data.mobileId) {
      activeMobile.status = data.isVisible ? "active" : "inactive";
      socket.to("controller").emit("new-mobile-visibility-change", data);
      socket.to("screen").emit("new-mobile-visibility-change", data);
    }
  });

  socket.on("mobile-new-heartbeat", ({ mobileId, timestamp }) => {
    if (activeMobile?.mobileId === mobileId) {
      activeMobile.lastHeartbeat = Date.now();

      // Only emit if status changes from inactive to active
      if (activeMobile.status === "inactive") {
        console.log(`Reactivating mobile ${mobileId} due to heartbeat`);
        activeMobile.status = "active";

        // Notify about reactivation
        const reactivationData = {
          mobileId,
          isVisible: true,
          origin: "heartbeat_reactivation",
        };

        socket
          .to("controller")
          .emit("new-mobile-visibility-change", reactivationData);
        socket
          .to("screen")
          .emit("new-mobile-visibility-change", reactivationData);
      }

      // Always forward heartbeat for monitoring
      // socket
      //   .to("controller")
      //   .emit("new-mobile-heartbeat", { mobileId, timestamp });
      // socket.to("screen").emit("new-mobile-heartbeat", { mobileId, timestamp });
    }
  });

  // Global heartbeat checker
  if (!global.heartbeatChecker) {
    global.heartbeatChecker = setInterval(() => {
      if (
        activeMobile &&
        Date.now() - activeMobile.lastHeartbeat > HEARTBEAT_TIMEOUT
      ) {
        console.log(
          `Mobile ${activeMobile.mobileId} considered dead - no heartbeat`
        );

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

        activeMobile = null;
      }
    }, HEARTBEAT_INTERVAL);
  }

  // Handle disconnections
  socket.on("disconnect", () => {
    if (activeMobile?.socketId === socket.id) {
      const mobileId = activeMobile.mobileId;
      activeMobile = null;

      io.to("controller").emit("new-mobile-visibility-change", {
        mobileId,
        isVisible: false,
        origin: "socket_disconnect",
      });
      io.to("screen").emit("new-mobile-visibility-change", {
        mobileId,
        isVisible: false,
        origin: "socket_disconnect",
      });
      console.log(`Mobile ${mobileId} disconnected`);
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
