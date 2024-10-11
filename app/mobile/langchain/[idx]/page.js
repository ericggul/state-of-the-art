"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const MobileElV1 = dynamic(() => import("@/foundations/mobile/langchain/v1"));
const MobileElV2 = dynamic(() => import("@/foundations/mobile/langchain/v2"));

const versionMap = {
  1: MobileElV1,
  2: MobileElV2,
};

export default function LangchainPage() {
  const { version } = useParams();
  const MobileEl = versionMap[version] || MobileElV1;
  return <MobileEl />;
}
