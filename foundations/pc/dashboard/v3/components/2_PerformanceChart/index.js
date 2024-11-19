import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import * as S from "./styles";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const formatValue = (value, format) => {
  switch (format) {
    case "percentage":
      return `${(value * 100).toFixed(1)}%`;
    case "decimal":
      return value.toFixed(3);
    case "number":
    default:
      return value.toString();
  }
};

export default function PerformanceChart({ performance }) {
  const {
    metric,
    yAxisLabel,
    xAxisLabel,
    labels,
    data,
    isLowerBetter,
    format,
    benchmarks,
  } = performance;

  const chartData = {
    labels: benchmarks?.labels || labels,
    datasets: [
      {
        label: `${metric} Score`,
        data: benchmarks?.data || data,
        borderColor: "white",
        backgroundColor: "white",
        pointBackgroundColor: "white",
        pointBorderColor: "#000000",
        pointHoverBackgroundColor: "#ffffff",
        pointHoverBorderColor: "white",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
          font: {
            family: "'Orbitron', sans-serif",
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: `Model ${metric} Performance`,
        color: "white",
        font: {
          family: "'Orbitron', sans-serif",
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `${metric}: ${formatValue(value, format)}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xAxisLabel,
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
          font: {
            family: "'Orbitron', sans-serif",
          },
        },
      },
      y: {
        title: {
          display: true,
          text: yAxisLabel,
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
          font: {
            family: "'Orbitron', sans-serif",
          },
          callback: (value) => formatValue(value, format),
        },
        reverse: isLowerBetter, // Reverse scale if lower values are better
      },
    },
  };

  return (
    <S.Container>
      <S.ChartWrapper>
        <Line options={options} data={chartData} />
      </S.ChartWrapper>
    </S.Container>
  );
}
