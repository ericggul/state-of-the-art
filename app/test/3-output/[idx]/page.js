"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { TEST_RESPONSE } from "@/foundations/test/3-output/utils/constant-en";

//TSNE
const Output0 = dynamic(() => import("@/foundations/test/3-output/0"));
const Output1 = dynamic(() => import("@/foundations/test/3-output/1"));
const Output11 = dynamic(() => import("@/foundations/test/3-output/1/1-1"));
const Output12 = dynamic(() => import("@/foundations/test/3-output/1/1-2"));
const Output13 = dynamic(() => import("@/foundations/test/3-output/1/1-3"));
const Output14 = dynamic(() => import("@/foundations/test/3-output/1/1-4"));
const Output15 = dynamic(() => import("@/foundations/test/3-output/1/1-5"));

const Output15Anim = dynamic(() => import("@/foundations/test/3-output/anim/1-5"));

export default function TsnePage() {
  const { idx } = useParams();

  return (
    <>
      {idx == "0" && <Output0 newResponse={TEST_RESPONSE} />}
      {idx == "1" && <Output1 newResponse={TEST_RESPONSE} />}
      {idx == "1-1" && <Output11 newResponse={TEST_RESPONSE} />}
      {idx == "1-2" && <Output12 newResponse={TEST_RESPONSE} />}
      {idx == "1-3" && <Output13 newResponse={TEST_RESPONSE} />}
      {idx == "1-4" && <Output14 newResponse={TEST_RESPONSE} />}
      {idx == "1-5" && <Output15 newResponse={TEST_RESPONSE} />}

      {idx == "anim-1-5" && <Output15Anim newResponse={TEST_RESPONSE} />}
    </>
  );
}
