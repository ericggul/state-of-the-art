"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const MobileElV1 = dynamic(() =>
  import("@/foundations/mobile/_old/langchain/v1")
);
const MobileElV2 = dynamic(() =>
  import("@/foundations/mobile/_old/langchain/v2")
);
const MobileElV3 = dynamic(() =>
  import("@/foundations/mobile/_old/langchain/v3")
);

const versionMap = {
  1: MobileElV1,
  2: MobileElV2,
  3: MobileElV3,
};

export default function LangchainPage() {
  const { idx } = useParams();
  const version = parseInt(idx, 10);

  const MobileEl = versionMap[version] || MobileElV2;

  return <MobileEl />;
}
