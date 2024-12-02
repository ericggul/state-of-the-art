import { useMemo } from "react";
import { DATA_NODES_LINKS } from "@/components/controller/constant/rhizome";

export const useRelatedModels = (currentArchitectures) => {
  return useMemo(() => {
    if (!currentArchitectures?.length) return [];

    const currentModel = currentArchitectures[0].name;
    const nodeMap = new Map(
      DATA_NODES_LINKS.nodes.map((node) => [node.id, node])
    );

    return DATA_NODES_LINKS.links
      .filter((link) => {
        const sourceNode = nodeMap.get(link.source);
        const targetNode = nodeMap.get(link.target);
        return (
          (sourceNode?.name === currentModel ||
            targetNode?.name === currentModel) &&
          link.relation
        );
      })
      .map((link) => {
        const sourceNode = nodeMap.get(link.source);
        const targetNode = nodeMap.get(link.target);
        const connectedNode =
          sourceNode?.name === currentModel ? targetNode : sourceNode;

        return {
          name: connectedNode?.name || "",
          relation: link.relation,
          value: link.value,
          version: connectedNode?.version,
        };
      })
      .filter((model) => model.name)
      .sort((a, b) => b.value - a.value);
  }, [currentArchitectures]);
};
