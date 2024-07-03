import * as S from "./styles";
import { useState, useEffect, useRef } from "react";

export default function Propagation({ propagatedState, setPropagatedState, layerIdx }) {
  const timeoutRef = useRef();

  console.log("7");

  useEffect(() => {
    if (propagatedState !== "idle") {
      if (timeoutRef && timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setPropagatedState("idle");
      }, 100);

      return () => {
        if (timeoutRef && timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [propagatedState]);

  console.log("propagatedState", propagatedState);
  return (
    <S.Container>
      <S.Bg
        style={{
          opacity: propagatedState === "idle" ? 0 : 1,
        }}
      />
    </S.Container>
  );
}
