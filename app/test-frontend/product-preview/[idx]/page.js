"use client";

import dynamic from "next/dynamic";

const Preview = dynamic(() => import("@/foundations/test-frontend/product-preview/ui"));

export default function FCPage() {
  return (
    <>
      <Preview />
    </>
  );
}
