"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const Grid0 = dynamic(() => import("@/foundations/test/grid/0"));
const Grid1 = dynamic(() => import("@/foundations/test/grid/1"));

//GRAPHS
const Grid2 = dynamic(() => import("@/foundations/test/grid/2"));
const Grid21 = dynamic(() => import("@/foundations/test/grid/2/2-1"));

//SIGMOID
const Grid22 = dynamic(() => import("@/foundations/test/grid/2/2-2"));
const Grid221 = dynamic(() => import("@/foundations/test/grid/2/2-2/2-2-1"));

//RELU
const Grid23 = dynamic(() => import("@/foundations/test/grid/2/2-3"));
const Grid231 = dynamic(() => import("@/foundations/test/grid/2/2-3/2-3-1"));

//RANDOM SINE WAVES
const Grid24 = dynamic(() => import("@/foundations/test/grid/2/2-4"));

const Grid25 = dynamic(() => import("@/foundations/test/grid/2/2-5"));

export default function NNPage() {
  const { idx } = useParams();

  return (
    <>
      {idx === "0" && <Grid0 isTesting={true} />}
      {idx === "1" && <Grid1 isTesting={true} />}

      {/*  */}
      {/* GRAPHS */}
      {/*  */}
      {idx === "2" && <Grid2 isTesting={true} />}
      {idx === "2-1" && <Grid21 isTesting={true} />}

      {/* SIGMOID */}
      {idx === "2-2" && <Grid22 isTesting={true} />}
      {idx === "2-2-1" && <Grid221 isTesting={true} />}

      {/* RELU */}
      {idx === "2-3" && <Grid23 isTesting={true} />}
      {idx === "2-3-1" && <Grid231 isTesting={true} />}

      {/* RANDOM SINE WAVES */}
      {idx === "2-4" && <Grid24 isTesting={true} />}

      {idx === "2-5" && <Grid25 isTesting={true} />}
    </>
  );
}
