import React, { useMemo } from "react";
import StatPanel from "./panels/StatPanel";
import PerformancePanel from "./panels/PerformancePanel";
import ArchitecturePanel from "./panels/ArchitecturePanel";

export default function DashboardPanels({ model = DEFAULT_MODEL }) {
  const radius = {
    inner: 4,
    middle: 5.5,
    outer: 7,
  };

  const panelLayouts = useMemo(() => {
    const stats = Object.entries(model?.stats || {});
    return {
      stats: {
        radius: radius.inner,
        height: 0,
        items: stats,
      },
      performance: {
        radius: radius.middle,
        height: 1,
        data: model?.performance,
      },
      architecture: {
        radius: radius.middle,
        height: -1,
        data: model?.architecture || [],
      },
    };
  }, [model]);

  return (
    <group>
      {/* Stats Panels */}
      {panelLayouts.stats.items.map((stat, index, array) => (
        <StatPanel
          key={stat[0]}
          stat={stat}
          index={index}
          total={array.length}
          radius={panelLayouts.stats.radius}
          height={panelLayouts.stats.height}
        />
      ))}

      {/* Performance Panel */}
      <PerformancePanel {...panelLayouts.performance} />

      {/* Architecture Panel */}
      <ArchitecturePanel {...panelLayouts.architecture} />
    </group>
  );
}
