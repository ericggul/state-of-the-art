"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Loading from "@/foundations/mobile/loading";

const MobileV4 = dynamic(() => import("@/components/mobile"));

function MobileSelector() {
  const searchParams = useSearchParams();
  const version = searchParams.get("v");

  switch (version) {
    default:
      return <MobileV4 />;
  }
}

export default function MobileWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <MobileSelector />
    </Suspense>
  );
}
