import dynamic from "next/dynamic";
import { Suspense } from "react";

const Controller = dynamic(() => import("@/components/controller"));

export default function ControllerWrapper() {
  return (
    <Suspense>
      <Controller />
    </Suspense>
  );
}
