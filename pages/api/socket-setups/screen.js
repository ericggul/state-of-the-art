export default function screenSetup({ socket, io }) {
  //init
  socket.on("screen-init", () => {
    socket.join("screen");
  });

  socket.on("hello-world", (data) => {
    socket.to("screen").emit("new-screen-hello-world", data);
  });
}
