export default function mobileSetup({ socket, io }) {
  //init
  socket.on("mobile-init", () => {
    socket.join("mobile");
  });

  socket.on("hello-world", (data) => {
    socket.to("mobile").emit("new-mobile-hello-world", data);
  });
}
