"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const Yakitori0 = dynamic(() => import("@/foundations/test/yakitori/0"));
const Yakitori1 = dynamic(() => import("@/foundations/test/yakitori/1"));
const Yakitori2 = dynamic(() => import("@/foundations/test/yakitori/2"));

export default function FCPage() {
  const { idx } = useParams();

  return (
    <>
      {idx === "0" && <Yakitori0 enableDeviceControls={false} />}
      {idx === "1" && <Yakitori1 enableDeviceControls={false} />}
      {idx === "2" && <Yakitori2 enableDeviceControls={false} />}
    </>
  );
}
