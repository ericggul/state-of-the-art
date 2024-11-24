// Track single active mobile
let activeMobile = null;

export default function mobileSetup({ socket, io }) {
  ///////////
  //INIT/////
  ///////////
  socket.on("screen-init", (data) => {
    socket.join("screen");
  });

  socket.on("mobile-init", ({ mobileId }) => {
    console.log(`📱 Mobile init: ${mobileId}`);
    activeMobile = {
      mobileId,
      socketId: socket.id,
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

  //////VISIBILITY
  socket.on("mobile-new-visibility-change", (data) => {
    if (activeMobile?.mobileId === data.mobileId) {
      console.log(`👁️ Visibility change for ${data.mobileId}:`, {
        isVisible: data.isVisible,
        origin: data.origin,
      });

      activeMobile.status = data.isVisible ? "active" : "inactive";

      socket.to("controller").emit("new-mobile-visibility-change", data);
      socket.to("screen").emit("new-mobile-visibility-change", data);
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

  socket.on("mobile-new-intro", (data) => {
    socket.to("screen").emit("new-mobile-intro", data);
  });

  //backend: inter-screen conversation
  socket.on("screen-new-conversation", (data) => {
    socket.to("screen").emit("new-screen-conversation", data);
  });

  socket.on("disconnect", () => {
    if (activeMobile?.socketId === socket.id) {
      console.log(`🔌 Mobile disconnected: ${activeMobile.mobileId}`);

      io.to("controller").emit("new-mobile-visibility-change", {
        mobileId: activeMobile.mobileId,
        isVisible: false,
        origin: "socket_disconnect",
      });
      io.to("screen").emit("new-mobile-visibility-change", {
        mobileId: activeMobile.mobileId,
        isVisible: false,
        origin: "socket_disconnect",
      });

      activeMobile = null;
    }
  });
}
