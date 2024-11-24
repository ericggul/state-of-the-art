import dynamic from "next/dynamic";
import { Suspense } from "react";

const Controller = dynamic(() => import("@/components/controller/_old"));
const TempMobile = dynamic(() => import("@/components/mobile/v1"));

export default function ControllerWrapper() {
  return (
    <Suspense>
      <Controller />
      <TempMobile />
    </Suspense>
  );
}
