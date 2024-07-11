export default function mobileSetup({ socket, io }) {
  ///////////
  //INIT/////
  ///////////
  socket.on("mobile-init", ({ mobileId }) => {
    socket.join("mobile");
    socket.emit("mobile-init", { mobileId });
    socket.to("conductor").emit("new-mobile-init", { mobileId });
    socket.to("screen").emit("new-mobile-init", { mobileId });
  });

  socket.on("screen-init", (data) => {
    socket.join("screen");
    socket.join(`layer-${data.layerIdx}`);
  });

  socket.on("conductor-init", () => {
    socket.join("conductor");
  });

  ///////////
  socket.on("mobile-layer-clicked", (data) => {
    socket.to(`layer-${data.layerIdx}`).emit("new-mobile-layer-clicked", data);
  });

  socket.on("mobile-training", (data) => {
    socket.to("conductor").emit("new-mobile-training", data);
  });

  socket.on("conductor-propagation", (data) => {
    socket.to(`layer-${data.layerIdx}`).emit("new-conductor-propagation", data);
  });

  socket.on("conductor-new-data", (data) => {
    socket.to("screen").emit("new-conductor-data", data);
    socket.to("mobile").emit("new-conductor-data", data);
  });
}
