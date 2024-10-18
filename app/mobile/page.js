import dynamic from "next/dynamic";
import { Suspense } from "react";

const MobileEl = dynamic(() => import("@/components/frontend/mobile"));

export default function MobileWrapper() {
  return (
    <Suspense>
      <Mobile />
    </Suspense>
  );
}

function Mobile() {
  return (
    <>
      <MobileEl />
    </>
  );
}
