export default function mobileSetup({ socket, io }) {
  ///////////
  //INIT/////
  ///////////
  socket.on("mobile-init", ({ mobileId }) => {
    socket.join("mobile");
    socket.emit("mobile-init", { mobileId });
    socket.to("controller").emit("new-mobile-init", { mobileId });
    socket.to("screen").emit("new-mobile-init", { mobileId });
  });

  socket.on("screen-init", (data) => {
    socket.join("screen");
    socket.join(`screen-${data.layerIdx}`);
  });

  socket.on("controller-init", () => {
    socket.join("controller");
  });

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

  ///////TEMPORARY WITHOUT CONTROLLER/////
  //v2 logic
  socket.on("mobile-new-architecture", (data) => {
    socket.to("controller").emit("new-mobile-architecture", data);
    socket.to("screen").emit("new-mobile-architecture", data);
  });

  socket.on("controller-new-speech", (data) => {
    socket.to("screen").emit("new-controller-speech", data);
  });

  //////VISIBILITY////
  //front <-> back visibiltiy change
  socket.on("mobile-new-visibility-change", (data) => {
    socket.to("controller").emit("new-mobile-visibility-change", data);
    socket.to("screen").emit("new-mobile-visibility-change", data);
  });
}
