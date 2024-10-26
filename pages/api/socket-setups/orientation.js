export default function mobileSetup({ socket, io }) {
  socket.on("mobile-orientation-init", ({ mobileId }) => {
    socket.join("mobile-orientation");
    socket.emit("new-mobile-orientation-init", { mobileId });
  });

  socket.on("screen-orientation-init", (data) => {
    socket.join("screen-orientation");
  });

  socket.on("mobile-orientation-update", (data) => {
    socket.to(`screen-orientation`).emit("new-mobile-orientation-update", data);
  });

  socket.on("mobile-orientation-spike", (data) => {
    socket.to(`screen-orientation`).emit("new-mobile-orientation-spike", data);
  });
}
