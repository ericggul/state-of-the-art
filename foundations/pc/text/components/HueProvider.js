import React, { useState, useEffect } from "react";
import { animated, useSpring } from "react-spring";

export const HueContext = React.createContext({ hue: 230 });

export function HueProvider({ targetHue = 230, children }) {
  const { hue } = useSpring({
    hue: targetHue,
    config: { tension: 120, friction: 14 }, // Adjust these values for desired smoothness
  });

  return (
    <HueContext.Provider value={{ hue: hue.get() }}>
      {children}
    </HueContext.Provider>
  );
}
