"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Loading from "@/foundations/mobile/loading";

const Mobile = dynamic(() => import("@/components/mobile"));

function MobileSelector() {
  const searchParams = useSearchParams();
  const urlSessionId = searchParams.get("sessionId");
  const [sessionId, setSessionId] = useState(urlSessionId || "10");

  useEffect(() => {
    if (typeof window === "undefined" || !urlSessionId) return;

    try {
      const storedSessionId = localStorage.getItem("lastSessionId");

      if (storedSessionId) {
        const storedNum = parseInt(storedSessionId, 10);
        const urlNum = parseInt(urlSessionId, 10);

        // Simply use the larger (more recent) session ID
        if (!isNaN(storedNum) && !isNaN(urlNum)) {
          const largerSessionId =
            urlNum > storedNum ? urlSessionId : storedSessionId;
          localStorage.setItem("lastSessionId", largerSessionId);
          setSessionId(largerSessionId);
        } else {
          // If parsing failed, use URL session
          localStorage.setItem("lastSessionId", urlSessionId);
          setSessionId(urlSessionId);
        }
      } else {
        // No stored session, use URL session
        localStorage.setItem("lastSessionId", urlSessionId);
        setSessionId(urlSessionId);
      }
    } catch (e) {
      console.error("Session handling error:", e);
      setSessionId(urlSessionId);
    }
  }, [urlSessionId]);

  return <Mobile sessionId={sessionId} />;
}

export default function MobileWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <MobileSelector />
    </Suspense>
  );
}
