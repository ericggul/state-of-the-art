// Track single active mobile
let activeMobile = null;

export default function socketSetup({ socket, io }) {
  ///////////
  //INIT/////
  ///////////
  socket.on("screen-init", () => {
    socket.join("screen");
  });

  socket.on("controller-init", () => {
    socket.join("screen");
    socket.join("controller");
  });

  socket.on("mobile-init", ({ mobileId, sessionId }) => {
    console.log(`📱 Mobile init: ${mobileId} ${sessionId}`);
    activeMobile = {
      mobileId,
      socketId: socket.id,
      status: "active",
    };

    socket.join("mobile");
    socket.emit("mobile-init", { mobileId });

    socket.to("screen").emit("new-mobile-init", { mobileId });
    socket.to("screen").emit("new-mobile-visibility-change", {
      isVisible: true,
      mobileId,
      origin: "init",
    });

    socket.to("controller").emit("new-mobile-sessionId-check", { sessionId });
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
  //mobile --> controlle
  socket.on("mobile-new-sessionId-check", (data) => {
    socket.to("controller").emit("new-mobile-sessionId-check", data);
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
    socket.to("mobile").emit("new-controller-sessionId-decline", data);
    socket.to("screen").emit("new-controller-sessionId-decline", data);
  });

  //DISCONNECT LOGIC//
  socket.on("disconnect", () => {
    console.log(
      "socket disconnect",
      "activeMobile",
      activeMobile,
      "socket.id",
      socket.id
    );
    if (activeMobile?.socketId === socket.id) {
      console.log("date now", Date.now());
      console.log(`🔌 Mobile disconnected: ${activeMobile.mobileId}`);

      io.to("screen").emit("new-mobile-visibility-change", {
        mobileId: activeMobile.mobileId,
        isVisible: false,
        origin: "socket_disconnect",
      });

      activeMobile = null;
    }
  });
}
