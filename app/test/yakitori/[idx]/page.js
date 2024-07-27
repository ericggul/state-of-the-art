"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const Yakitori0 = dynamic(() => import("@/foundations/test/yakitori/0"));

export default function FCPage() {
  const { idx } = useParams();

  return <>{idx === "0" && <Yakitori0 />}</>;
}
