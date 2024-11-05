"use client";

import dynamic from "next/dynamic";
import { Suspense, useState } from "react";

const Frontend = dynamic(() => import("@/components/frontend"));

const CURRENT_TESTING_VERSION = "v2.0.2";

export default function ProjectorWrapper() {
  return (
    <Suspense>
      <Projector isTesting={true} />
    </Suspense>
  );
}

function Projector() {
  const [version, setVersion] = useState(CURRENT_TESTING_VERSION);

  return (
    <>
      <input
        type="text"
        value={version}
        onChange={(e) => setVersion(e.target.value)}
        style={{ position: "fixed", top: "10px", left: "10px", zIndex: 1000 }}
      />
      <Frontend isTesting={true} initVersion={version} />
    </>
  );
}
