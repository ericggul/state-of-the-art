export default function mobileSetup({ socket, io }) {
  ///////////
  //INIT/////
  ///////////
  socket.on("mobile-init", ({ mobileId }) => {
    console.log("init", mobileId);
    socket.join("mobile");
    socket.emit("mobile-init", { mobileId });
  });

  socket.on("screen-init", (data) => {
    console.log("INIT INIT");
    console.log(data);
    //typeof layeridx
    console.log("screen init", data.layerIdx, typeof data.layerIdx);
    socket.join("screen");
    socket.join(`layer-${data.layerIdx}`);
  });

  socket.on("conductor-init", () => {
    socket.join("conductor");
  });

  ////MOBILE INITIATED
  socket.on("mobile-init", (data) => {
    console.log("mobile init", data);
    socket.to("conductor").emit("new-mobile-init", data);
    socket.to("screen").emit("new-mobile-init", data);
  });

  //WHEN MOBILE LAYER CLICKED
  socket.on("mobile-layer-clicked", (data) => {
    console.log("layer clicked", data);
    if (data.layerIdx) {
      console.log(typeof data.layerIdx, `layer-${data.layerIdx}`);
      socket.to(`layer-${data.layerIdx}`).emit("new-mobile-layer-clicked", data);
    }
    // socket.to("screen").emit("new-mobile-layer-clicked", data);
  });

  //WHEN MOBILE TRAINING COMMAND: MOBILES -> CONDUCTOR
  socket.on("mobile-training", (data) => {
    console.log("mobile training", data);
    socket.to("conductor").emit("new-mobile-training", data);
  });

  //CONDUCTOR -> SCREEN PROPAGATION REQUEST
  socket.on("conductor-propagation", (data) => {
    console.log("conductor propagation", data);
    socket.to("screen").emit("new-conductor-propagation", data);
  });
}
