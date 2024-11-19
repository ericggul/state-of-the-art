import React from "react";
import styled from "styled-components";
import TypewriterText from "./TypewriterText";
import {
  STATS_CONFIG,
  TIFFANY_BLUE,
  TIFFANY_BLUE_RGBA,
} from "../utils/constants";

const StatContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5vw;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8vw 1vw;
  background: ${TIFFANY_BLUE_RGBA}0.05);
  border: 1px solid ${TIFFANY_BLUE_RGBA}0.1);
  border-radius: 0.5vw;
  transition: all 0.3s ease;

  &:hover {
    background: ${TIFFANY_BLUE_RGBA}0.1);
    border-color: ${TIFFANY_BLUE_RGBA}0.2);
    transform: translateX(0.5vw);
  }
`;

const StatLabel = styled.div`
  color: ${TIFFANY_BLUE};
  font-size: 0.9vw;
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 0.5vw;
`;

const StatIcon = styled.span`
  font-size: 1vw;
`;

const StatValue = styled.div`
  color: ${TIFFANY_BLUE};
  font-size: 0.9vw;
  font-weight: bold;
  text-shadow: 0 0 5px ${TIFFANY_BLUE_RGBA}0.5);
`;

const getStatIcon = (statKey) => {
  const icons = {
    citations: "📚",
    parameters: "🧮",
    trainingData: "💾",
    computeUsed: "⚡",
    inferenceSpeed: "⚡",
    memoryUsage: "🧠",
    trainTime: "⏱️",
    carbonFootprint: "🌱",
  };
  return icons[statKey] || "📊";
};

export default function ModelStats({ model }) {
  const getFormattedValue = (value, config) => {
    if (config.format === "number") {
      const num = parseFloat(value);
      if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
      if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
      if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
      return num.toString();
    }
    return value;
  };

  const stats = Object.entries(model.stats || {})
    .filter(([key, value]) => value !== undefined && value !== "N/A")
    .sort(
      ([keyA], [keyB]) =>
        (STATS_CONFIG[keyA]?.priority || 99) -
        (STATS_CONFIG[keyB]?.priority || 99)
    )
    .map(([key, value]) => ({
      key,
      value,
      ...STATS_CONFIG[key],
    }));

  return (
    <StatContainer>
      {stats.map((stat) => (
        <StatRow key={stat.key}>
          <StatLabel>
            <StatIcon>{getStatIcon(stat.key)}</StatIcon>
            {stat.label}
          </StatLabel>
          <StatValue>
            <TypewriterText
              text={`${getFormattedValue(stat.value, stat)}${
                stat.suffix || ""
              }`}
              speed={30}
            />
          </StatValue>
        </StatRow>
      ))}
    </StatContainer>
  );
}
