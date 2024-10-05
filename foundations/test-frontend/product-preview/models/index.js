import dynamic from "next/dynamic";

import { useParams } from "next/navigation";

const Model0 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/0"));
const Model1 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/1"));
const Model2 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/2"));
const Model3 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/3"));
const Model4 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/4"));
const Model5 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/5"));

export default function Model() {
  const { idx } = useParams();

  return (
    <>
      {(idx === "0" || !idx) && <Model0 enableDeviceControls={false} />}
      {idx === "1" && <Model1 enableDeviceControls={false} />}
      {idx === "2" && <Model2 enableDeviceControls={false} />}
      {idx === "3" && <Model3 enableDeviceControls={false} />}
      {idx === "4" && <Model4 enableDeviceControls={false} />}
      {idx === "5" && <Model5 enableDeviceControls={false} />}
    </>
  );
}
