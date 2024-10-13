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

  socket.on("controller-architectures", (data) => {
    socket.to("screen").emit("new-controller-architectures", data);
  });
}
