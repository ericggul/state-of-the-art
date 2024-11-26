import React from "react";
import { Html } from "@react-three/drei";

export default function LoadingUI() {
  return (
    <Html center>
      <div
        style={{
          color: "white",
          background: "rgba(0,0,0,0.7)",
          padding: "20px 40px",
          borderRadius: "8px",
          textAlign: "center",
          fontFamily: "monospace",
          userSelect: "none",
        }}
      >
        <div style={{ fontSize: "1.2em", marginBottom: "10px" }}>
          Loading Architecture
        </div>
        <div
          style={{
            width: "50px",
            height: "2px",
            background: "white",
            animation: "loading 1.5s infinite",
            "@keyframes loading": {
              "0%": { transform: "scaleX(0)" },
              "50%": { transform: "scaleX(1)" },
              "100%": { transform: "scaleX(0)" },
            },
          }}
        />
      </div>
    </Html>
  );
}
