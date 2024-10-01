export default function mobileJockeySetup({ socket, io }) {
  //init
  socket.on("on-off-mobile-init", (data) => {
    socket.join("on-off");
    socket.join("on-off-mobile");
    socket.join(`on-off-mobile-${data.mobileId}`);
    socket.to("on-off-screen").emit("new-on-off-mobile-connect", data);

    // socket.to("on-off-screen").emit("new-on-off-visibility-change", {
    //   mobileId: data.mobileId,
    //   isVisible: true,
    // });
  });

  socket.on("on-off-mobile-disconnect", (data) => {
    console.log("11", data);
    socket.to("on-off-screen").emit("new-on-off-mobile-disconnect", data);
    socket.leave("on-off");
    socket.leave("on-off-mobile");
    socket.leave(`on-off-mobile-${data.mobileId}`);
  });

  socket.on("on-off-screen-init", () => {
    socket.join("on-off");
    socket.join("on-off-screen");
  });

  socket.on("on-off-visibility-change", (data) => {
    console.log("on-off-visibility-change");
    socket.to("on-off-screen").emit("new-on-off-visibility-change", data);
  });
}
