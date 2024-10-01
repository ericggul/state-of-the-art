import dynamic from "next/dynamic";

const Mobile = dynamic(() => import("@/components/frontend/mobile"));

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
      <Mobile />
    </>
  );
}
