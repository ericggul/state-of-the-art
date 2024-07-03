export default function mobileSetup({ socket, io }) {
  //init
  socket.on("mobile-init", () => {
    socket.join("mobile");
    socket.emit("mobile-init");
  });

  socket.on("mobile-layer-clicked", (data) => {
    socket.to("screen").emit("new-mobile-layer-clicked", data);
  });

  socket.on("mobile-training-triggered", (data) => {
    socket.to("screen").emit("new-mobile-training-triggered", data);
  });
}
