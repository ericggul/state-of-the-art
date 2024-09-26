"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const Preview0 = dynamic(() => import("@/foundations/test-frontend/product-preview/0"));

export default function FCPage() {
  const { idx } = useParams();

  return <>{idx === "0" && <Preview0 enableDeviceControls={false} />}</>;
}
