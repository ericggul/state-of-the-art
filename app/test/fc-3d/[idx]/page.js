"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const FC0 = dynamic(() => import("@/foundations/test/fc-3d/0"));
const FC1 = dynamic(() => import("@/foundations/test/fc-3d/1"));

export default function FCPage() {
  const { idx } = useParams();

  return (
    <>
      {idx === "0" && <FC0 />}
      {idx === "1" && <FC1 />}
    </>
  );
}
