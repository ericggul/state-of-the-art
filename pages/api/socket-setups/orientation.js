export default function mobileSetup({ socket, io }) {
  ///////////
  //INIT/////
  ///////////
  socket.on("mobile-orientation-init", ({ mobileId }) => {
    socket.join("mobile-orientation");
    socket.emit("new-mobile-orientation-init", { mobileId });
  });

  socket.on("screen-orientation-init", (data) => {
    socket.join("screen-orientation");
  });

  ///////
  ///////////mobile --> screen
  ///////
  socket.on("mobile-orientation-changed", (data) => {
    socket.to(`screen-orientation`).emit("new-mobile-orientation-changed", data);
  });
}
