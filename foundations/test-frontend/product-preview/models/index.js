import dynamic from "next/dynamic";

import { useParams } from "next/navigation";

const Model0 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/0"));
const Model1 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/1"));
const Model2 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/2"));

export default function Model() {
  const { idx } = useParams();

  return (
    <>
      {idx === "0" && <Model0 enableDeviceControls={false} />}
      {idx === "1" && <Model1 enableDeviceControls={false} />}
      {idx === "2" && <Model2 enableDeviceControls={false} />}
    </>
  );
}
