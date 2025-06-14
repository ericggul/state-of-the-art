// Track single active mobile
let activeMobile = null;

export default function socketSetup({ socket, io }) {
  ///////////
  //INIT/////
  ///////////
  socket.on("screen-init", () => {
    socket.join("screen");
    if (activeMobile) {
      activeMobile = null;
    }
  });

  socket.on("controller-init", () => {
    socket.join("screen");
    socket.join("controller");
    if (activeMobile) {
      activeMobile = null;
    }
  });

  socket.on("mobile-init", ({ mobileId, sessionId }) => {
    console.log(`📱 Mobile init: ${mobileId} ${sessionId}`);
    console.log("current active mobile", activeMobile);
    if (!activeMobile) {
      activeMobile = {
        mobileId,
        socketId: socket.id,
        status: "active",
      };
    }
    if (activeMobile && activeMobile.mobileId == mobileId) {
      console.log("updating current active mobile", activeMobile);
      console.log("new socket id", socket.id);

      activeMobile = {
        ...activeMobile,
        socketId: socket.id,
        status: "active",
      };
    }

    socket.join("mobile");
    socket.emit("mobile-init", { mobileId });

    socket.to("screen").emit("new-mobile-init", { mobileId });
    socket.to("screen").emit("new-mobile-visibility-change", {
      isVisible: true,
      mobileId,
      origin: "init",
    });

    socket
      .to("controller")
      .emit("new-mobile-sessionId-check", { sessionId, mobileId });
  });

  socket.on("mobile-init-from-controller", ({ mobileId, sessionId }) => {
    console.log(`📱 Mobile init from controller: ${mobileId} ${sessionId}`);
    console.log("current active mobile", activeMobile);
    if (!activeMobile) {
      activeMobile = {
        mobileId,
        socketId: socket.id,
        status: "active",
      };
    }
    if (activeMobile && activeMobile.mobileId == mobileId) {
      console.log("updating current active mobile", activeMobile);
      console.log("new socket id", socket.id);

      activeMobile = {
        ...activeMobile,
        socketId: socket.id,
        status: "active",
      };
    }

    socket.to("screen").emit("new-mobile-init", { mobileId });
    socket.to("screen").emit("new-mobile-visibility-change", {
      isVisible: true,
      mobileId,
      origin: "init",
    });
  });

  //////VISIBILITY
  socket.on("mobile-new-visibility-change", (data) => {
    console.log(
      "mobile new visibility change data",
      data,
      "activeMobile",
      activeMobile
    );
    if (activeMobile?.mobileId === data.mobileId) {
      console.log("date now", Date.now());
      console.log(`👁️ Visibility change for ${data.mobileId}:`, {
        isVisible: data.isVisible,
        origin: data.origin,
      });

      activeMobile.status = data.isVisible ? "active" : "inactive";

      socket.to("screen").emit("new-mobile-visibility-change", data);
    }
  });

  //////////MESSAGE HANDLING//////////
  //mobile --> screen
  socket.on("mobile-new-architecture", (data) => {
    socket.to("screen").emit("new-mobile-architecture", data);
  });
  socket.on("mobile-new-intro", (data) => {
    socket.to("screen").emit("new-mobile-intro", data);
  });

  //BACKEND: inter-screen conversation
  socket.on("screen-new-conversation", (data) => {
    socket.to("screen").emit("new-screen-conversation", data);
  });

  //BACKUP: CONTROLLER LOGIC
  socket.on("controller-new-init", (data) => {
    socket.to("screen").emit("new-controller-init", data);
  });
  socket.on("controller-new-architectures", (data) => {
    socket.to("screen").emit("new-controller-architectures", data);
  });
  socket.on("controller-new-visibility-change", (data) => {
    socket.to("screen").emit("new-controller-visibility-change", data);
  });
  socket.on("controller-new-stage-and-reset", (data) => {
    socket.to("screen").emit("new-controller-stage-and-reset", data);
  });

  //////SESSION ID LOGIC/////
  socket.on("controller-new-sessionId", (data) => {
    socket.to("screen").emit("new-controller-sessionId", data);
  });
  socket.on("controller-new-sessionId-decline", (data) => {
    console.log(data, data.mobileId, "decline");
    console.log("activeMobile", activeMobile);
    console.log("new controller new sessino dcline event");

    if (data.decline) {
      console.log("decline");
      if (activeMobile?.mobileId === data.mobileId) {
        console.log("setting activeMobile to null", activeMobile, data);
        activeMobile = null;
      }
    }

    socket.to("mobile").emit("new-controller-sessionId-decline", data);
    socket.to("screen").emit("new-controller-sessionId-decline", data);
  });

  //DISCONNECT LOGIC//
  socket.on("disconnect", (data) => {
    console.log(
      "socket disconnect",
      "activeMobile",
      activeMobile,
      "socket.id",
      socket.id,
      data
    );
    if (activeMobile?.socketId === socket.id) {
      console.log("date now", Date.now());
      console.log(`🔌 Mobile disconnected: ${activeMobile.mobileId}`);

      io.to("screen").emit("new-mobile-visibility-change", {
        mobileId: activeMobile.mobileId,
        isVisible: false,
        origin: "socket_disconnect",
      });

      activeMobile.socketId = null;
      activeMobile.status = "inactive";
    }
  });

  // Add this new socket handler
  socket.on("controller-force-reset-active-mobile", () => {
    console.log("🔄 Force resetting active mobile");
    if (activeMobile) {
      // Notify screens about mobile disconnection before resetting
      io.to("screen").emit("new-mobile-visibility-change", {
        mobileId: activeMobile.mobileId,
        isVisible: false,
        origin: "force_reset",
      });

      // Reset the active mobile
      activeMobile = null;
    }
  });

  socket.on("screen-force-reset-active-mobile", () => {
    console.log("🔄 Force resetting active mobile");
    if (activeMobile) {
      activeMobile = null;
    }
  });
}
