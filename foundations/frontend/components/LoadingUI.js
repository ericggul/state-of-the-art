import React from "react";
import { Html } from "@react-three/drei";

export default function LoadingUI() {
  return (
    <Html center>
      <div
        style={{
          width: "60px",
          height: "60px",
          position: "relative",
        }}
      >
        {/* Outer rotating ring */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            border: "2px solid rgba(255,255,255,0.1)",
            borderTop: "2px solid rgba(255,255,255,0.8)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        {/* Inner rotating ring */}
        <div
          style={{
            position: "absolute",
            width: "70%",
            height: "70%",
            top: "15%",
            left: "15%",
            border: "2px solid rgba(255,255,255,0.1)",
            borderBottom: "2px solid rgba(255,255,255,0.6)",
            borderRadius: "50%",
            animation: "spin 1.5s linear infinite reverse",
          }}
        />
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </Html>
  );
}
