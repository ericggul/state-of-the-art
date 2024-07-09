"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const Grid0 = dynamic(() => import("@/components/test/grid/0"));
const Grid1 = dynamic(() => import("@/components/test/grid/1"));
const Grid2 = dynamic(() => import("@/components/test/grid/2"));
const Grid21 = dynamic(() => import("@/components/test/grid/2-1"));
const Grid22 = dynamic(() => import("@/components/test/grid/2-2"));
const Grid23 = dynamic(() => import("@/components/test/grid/2-3"));

export default function NNPage() {
  const { idx } = useParams();

  return (
    <>
      {idx === "0" && <Grid0 isTesting={true} />}
      {idx === "1" && <Grid1 isTesting={true} />}
      {idx === "2" && <Grid2 isTesting={true} />}
      {idx === "2-1" && <Grid21 isTesting={true} />}
      {idx === "2-2" && <Grid22 isTesting={true} />}
      {idx === "2-3" && <Grid23 isTesting={true} />}
    </>
  );
}
