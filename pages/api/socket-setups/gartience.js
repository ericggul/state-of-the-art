export default function gartienceSetup({ socket, io }) {
  ///////////
  //INIT/////
  ///////////
  socket.on("gartience-screen-init", () => {
    socket.join("gartience");
    socket.join(`gartience-screen`);
  });

  socket.on("gartience-mobile-init", () => {
    socket.join("gartience");
    socket.join("gartience-mobile");
  });

  socket.on("gartience-controller-init", () => {
    socket.join("gartience");
    socket.join("gartience-controller");
  });

  ///////////
  /////socket logic
  ///////////
  socket.on("gartience-new-state", (data) => {
    socket.to("gartience").emit("new-gartience-state", data);
  });

  socket.on("gartience-new-chaos", (data) => {
    socket.to("gartience").emit("new-gartience-chaos", data);
  });

  socket.on("gartience-new-architectures", (data) => {
    socket.to("gartience").emit("new-gartience-architectures", data);
  });

  socket.on("gartience-new-speech", (data) => {
    socket.to("gartience").emit("new-gartience-speech", data);
  });
}
