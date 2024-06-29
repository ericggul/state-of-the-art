"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const NN0 = dynamic(() => import("@/components/test/nn-3d/0"));
const NN1 = dynamic(() => import("@/components/test/nn-3d/1"));
const NN2 = dynamic(() => import("@/components/test/nn-3d/2"));
const NN3 = dynamic(() => import("@/components/test/nn-3d/3"));
const NN4 = dynamic(() => import("@/components/test/nn-3d/4"));
const NN5 = dynamic(() => import("@/components/test/nn-3d/5"));

const NN3Anim = dynamic(() => import("@/components/test/nn-3d/3-anim"));
const NNBasic = dynamic(() => import("@/components/test/nn-3d/basic"));

export default function NNPage() {
  const { idx } = useParams();

  return (
    <>
      {idx === "0" && <NN0 />}
      {idx === "1" && <NN1 />}
      {idx === "2" && <NN2 />}
      {idx === "3" && <NN3 />}
      {idx === "4" && <NN4 />}
      {idx === "5" && <NN5 />}
      {idx === "3-anim" && <NN3Anim />}
      {idx === "basic" && <NNBasic />}
    </>
  );
}
