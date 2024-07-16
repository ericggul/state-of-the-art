"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { TEST_RESPONSE } from "@/foundations/test/3-output/constant";

//TSNE
const Output0 = dynamic(() => import("@/foundations/test/3-output/0"));

export default function TsnePage() {
  const { idx } = useParams();

  return <>{idx == "0" && <Output0 newResponse={TEST_RESPONSE} />}</>;
}
