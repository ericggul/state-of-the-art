export default function mobileSetup({ socket, io }) {
  ///////////
  //INIT/////
  ///////////
  socket.on("mobile-init", ({ mobileId }) => {
    console.log("init", mobileId);
    socket.join("mobile");
    socket.emit("mobile-init", { mobileId });
  });
  socket.on("screen-init", () => {
    socket.join("screen");
  });
  socket.on("conductor-init", () => {
    socket.join("conductor");
  });

  socket.on("mobile-init", (data) => {
    console.log("mobile init", data);
    socket.to("conductor").emit("new-mobile-init", data);
    socket.to("screen").emit("new-mobile-init", data);
  });

  socket.on("mobile-layer-clicked", (data) => {
    console.log("layer clicked", data);
    socket.to("screen").emit("new-mobile-layer-clicked", data);
  });

  socket.on("mobile-training", (data) => {
    console.log("mobile training", data);
    socket.to("conductor").emit("new-mobile-training", data);
  });

  socket.on("conductor-propagation", (data) => {
    console.log("conductor propagation", data);
    socket.to("screen").emit("new-conductor-propagation", data);
  });
}
