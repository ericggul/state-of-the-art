"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const FC0 = dynamic(() => import("@/foundations/test-frontend/fc-3d/0"));
const FC1 = dynamic(() => import("@/foundations/test-frontend/fc-3d/1"));

//fc 2: for screen
const FC2 = dynamic(() => import("@/foundations/test-frontend/fc-3d/2"));

export default function FCPage() {
  const { idx } = useParams();

  return (
    <>
      {idx === "0" && <FC0 />}
      {idx === "1" && <FC1 />}
      {idx === "2" && <FC2 />}
    </>
  );
}
