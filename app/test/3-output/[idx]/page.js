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
const Output21 = dynamic(() => import("@/foundations/test/3-output/2/2-1"));
const Output22 = dynamic(() => import("@/foundations/test/3-output/2/2-2"));
const Output23 = dynamic(() => import("@/foundations/test/3-output/2/2-3"));
const Output24 = dynamic(() => import("@/foundations/test/3-output/2/2-4"));
const Output25 = dynamic(() => import("@/foundations/test/3-output/2/2-5"));

const OutputAnim11 = dynamic(() => import("@/foundations/test/3-output/anim/1-1"));
const OutputAnim12 = dynamic(() => import("@/foundations/test/3-output/anim/1-2"));
const OutputAnim13 = dynamic(() => import("@/foundations/test/3-output/anim/1-3"));
const OutputAnim14 = dynamic(() => import("@/foundations/test/3-output/anim/1-4"));
const OutputAnim15 = dynamic(() => import("@/foundations/test/3-output/anim/1-5"));
const OutputAnim16 = dynamic(() => import("@/foundations/test/3-output/anim/1-6"));

const OutputRandom21 = dynamic(() => import("@/foundations/test/3-output/random/2-1"));

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
      {idx == "2-1" && <Output21 newResponse={TEST_RESPONSE} />}
      {idx == "2-2" && <Output22 newResponse={TEST_RESPONSE} />}
      {idx == "2-3" && <Output23 newResponse={TEST_RESPONSE} />}
      {idx == "2-4" && <Output24 newResponse={TEST_RESPONSE} />}
      {idx == "2-5" && <Output25 newResponse={TEST_RESPONSE} />}

      {idx == "anim-1-1" && <OutputAnim11 newResponse={TEST_RESPONSE} />}
      {idx == "anim-1-2" && <OutputAnim12 newResponse={TEST_RESPONSE} />}
      {idx == "anim-1-3" && <OutputAnim13 newResponse={TEST_RESPONSE} />}
      {idx == "anim-1-4" && <OutputAnim14 newResponse={TEST_RESPONSE} />}
      {idx == "anim-1-5" && <OutputAnim15 newResponse={TEST_RESPONSE} />}
      {idx == "anim-1-6" && <OutputAnim16 newResponse={TEST_RESPONSE} />}

      {idx == "random-2-1" && <OutputRandom21 newResponse={TEST_RESPONSE} />}
    </>
  );
}
