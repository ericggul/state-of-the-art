import dynamic from "next/dynamic";

import { useParams } from "next/navigation";

const Model0 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/0"));
const Model1 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/1"));
const Model2 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/2"));
//transformers
const Model3 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/3"));
const Model4 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/4"));
const Model5 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/5"));
//gpt 3
const Model6 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/6"));
const Model7 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/7"));
//dall e 2
const Model8 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/8"));
//bert
const Model9 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/9"));
//Meta Video Gen
const Model10 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/10"));
const Model101 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/10/10-1"));
const Model102 = dynamic(() => import("@/foundations/test-frontend/product-preview/models/10/10-2"));

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
      {idx === "6" && <Model6 enableDeviceControls={false} />}
      {idx === "7" && <Model7 enableDeviceControls={false} />}
      {idx === "8" && <Model8 enableDeviceControls={false} />}
      {idx === "9" && <Model9 enableDeviceControls={false} />}
      {idx === "10" && <Model10 enableDeviceControls={false} />}
      {idx === "10-1" && <Model101 enableDeviceControls={false} />}
      {idx === "10-2" && <Model102 enableDeviceControls={false} />}
    </>
  );
}
