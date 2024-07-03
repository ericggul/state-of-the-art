export default function screenSetup({ socket, io }) {
  //init
  socket.on("screen-init", () => {
    socket.join("screen");
  });
}
