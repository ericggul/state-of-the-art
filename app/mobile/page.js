"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Loading from "@/foundations/mobile/loading";

const Mobile = dynamic(() => import("@/components/mobile"));

function MobileSelector() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  return <Mobile sessionId={sessionId} />;
}

export default function MobileWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <MobileSelector />
    </Suspense>
  );
}
