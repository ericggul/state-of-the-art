"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const Yakitori0 = dynamic(() => import("@/foundations/test/yakitori/0"));
const Yakitori1 = dynamic(() => import("@/foundations/test/yakitori/0/0-1"));
const Yakitori2 = dynamic(() => import("@/foundations/test/yakitori/0/0-2"));
const Yakitori3 = dynamic(() => import("@/foundations/test/yakitori/0/0-3"));
const Yakitori4 = dynamic(() => import("@/foundations/test/yakitori/0/0-4"));

export default function FCPage() {
  const { idx } = useParams();

  return (
    <>
      {idx === "0" && <Yakitori0 enableDeviceControls={false} />}
      {idx === "0-1" && <Yakitori1 enableDeviceControls={false} />}
      {idx === "0-2" && <Yakitori2 enableDeviceControls={false} />}
      {idx === "0-3" && <Yakitori3 enableDeviceControls={false} />}
      {idx === "0-4" && <Yakitori4 enableDeviceControls={false} />}
    </>
  );
}
