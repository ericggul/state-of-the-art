"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const Prop0 = dynamic(() => import("@/components/test/grid/0"));

export default function NNPage() {
  const { idx } = useParams();

  return <>{idx === "0" && <Prop0 isTesting={true} />}</>;
}
