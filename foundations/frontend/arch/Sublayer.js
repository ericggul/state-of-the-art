import React from "react";
import Sublayer3D from "./Sublayer-3d";
import Sublayer2D from "./Sublayer-2d";

const Sublayer = ({ is3D = false, ...props }) => {
  return is3D ? <Sublayer3D {...props} /> : <Sublayer2D {...props} />;
};

Sublayer.displayName = "Sublayer";

export default Sublayer;
