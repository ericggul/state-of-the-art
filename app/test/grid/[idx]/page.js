"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const Grid0 = dynamic(() => import("@/components/test/grid/0"));
const Grid1 = dynamic(() => import("@/components/test/grid/1"));

export default function NNPage() {
  const { idx } = useParams();

  return (
    <>
      {idx === "0" && <Grid0 isTesting={true} />}
      {idx === "1" && <Grid1 isTesting={true} />}
    </>
  );
}
