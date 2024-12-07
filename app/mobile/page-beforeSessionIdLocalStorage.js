"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Loading from "@/foundations/mobile/loading";

import { IS_DEPLOYMENT } from "@/utils/constant";

const Mobile = dynamic(() => import("@/components/mobile"));

function MobileSelector() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  // return <Mobile sessionId={IS_DEPLOYMENT ? sessionId || "10" : "9999"} />;
  return <Mobile sessionId={sessionId || "10"} />;
}

export default function MobileWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <MobileSelector />
    </Suspense>
  );
}
