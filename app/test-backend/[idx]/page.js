"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { TEST_EMBEDDINGS } from "@/foundations/test/1-relation/utils/constant";

const Embeddings00 = dynamic(() =>
  import("@/foundations/test-backend/0-embeddings/0")
);

//0: Original Version
const Embeddings30 = dynamic(() =>
  import("@/foundations/test-backend/3-chaos/0")
);
///1: Best Selection for Now
const Embeddings31 = dynamic(() =>
  import("@/foundations/test-backend/3-chaos/1")
);
//2: Too chaotic all around the place
const Embeddings32 = dynamic(() =>
  import("@/foundations/test-backend/3-chaos/2")
);

const Embeddings33 = dynamic(() =>
  import("@/foundations/test-backend/3-chaos/3")
);

const Embeddings3Glich = dynamic(() =>
  import("@/foundations/test-backend/3-chaos/glitch")
);
const Embeddings3Transparent = dynamic(() =>
  import("@/foundations/test-backend/3-chaos/transparent")
);

export default function RelationPage() {
  const { idx } = useParams();

  return (
    <>
      {idx == "0-0" && <Embeddings00 newEmbeddings={TEST_EMBEDDINGS} />}

      {idx == "3-0" && <Embeddings30 />}
      {idx == "3-1" && <Embeddings31 />}
      {idx == "3-2" && <Embeddings32 />}
      {idx == "3-3" && <Embeddings33 />}

      {idx == "3-glitch" && <Embeddings3Glich />}
      {idx == "3-transparent" && <Embeddings3Transparent />}
    </>
  );
}
