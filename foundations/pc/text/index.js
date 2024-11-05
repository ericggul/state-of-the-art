import React from "react";
import useScreenStore from "@/components/screen/store";
import { useModelStructure } from "@/components/frontend/utils";

export default function TextComponent() {
  const { currentArchitectures } = useScreenStore();
  const { modelName, structure } = useModelStructure(currentArchitectures);

  return <div>{/* Your component JSX */}</div>;
}
