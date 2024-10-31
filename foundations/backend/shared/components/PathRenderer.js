import React from "react";

export function PathRendererV3({ paths, opacity }) {
  return <S.Pic style={{ opacity }}>{paths}</S.Pic>;
}

export function PathRendererV4({ paths }) {
  return <S.Pic>{paths}</S.Pic>;
}
