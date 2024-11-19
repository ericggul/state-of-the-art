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
import { TIFFANY_BLUE, TIFFANY_BLUE_RGBA } from "../utils/constants";

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
        borderColor: TIFFANY_BLUE,
        backgroundColor: `${TIFFANY_BLUE_RGBA}0.2)`,
        pointBackgroundColor: TIFFANY_BLUE,
        pointBorderColor: "#000000",
        pointHoverBackgroundColor: "#ffffff",
        pointHoverBorderColor: TIFFANY_BLUE,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: TIFFANY_BLUE,
          font: {
            family: "'Orbitron', sans-serif",
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: `Model ${metric} Performance`,
        color: TIFFANY_BLUE,
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
          color: TIFFANY_BLUE,
        },
        grid: {
          color: `${TIFFANY_BLUE_RGBA}0.1)`,
        },
        ticks: {
          color: TIFFANY_BLUE,
          font: {
            family: "'Orbitron', sans-serif",
          },
        },
      },
      y: {
        title: {
          display: true,
          text: yAxisLabel,
          color: TIFFANY_BLUE,
        },
        grid: {
          color: `${TIFFANY_BLUE_RGBA}0.1)`,
        },
        ticks: {
          color: TIFFANY_BLUE,
          font: {
            family: "'Orbitron', sans-serif",
          },
          callback: (value) => formatValue(value, format),
        },
        reverse: isLowerBetter, // Reverse scale if lower values are better
      },
    },
  };

  return <Line options={options} data={chartData} />;
}
