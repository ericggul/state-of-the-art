import dynamic from "next/dynamic";
import { Suspense } from "react";

const Controller = dynamic(() => import("@/components/controller"));
const TempMobile = dynamic(() => import("@/components/mobile"));

export default function ControllerWrapper() {
  return (
    <Suspense>
      <Controller />
      <TempMobile />
    </Suspense>
  );
}
