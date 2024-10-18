import dynamic from "next/dynamic";
import { Suspense } from "react";

const Controller = dynamic(() => import("@/components/controller"));
const TempChatUI = dynamic(() => import("@/foundations/mobile/wrapper"));

export default function ControllerWrapper() {
  return (
    <Suspense>
      <Controller />
      <TempChatUI />
    </Suspense>
  );
}
