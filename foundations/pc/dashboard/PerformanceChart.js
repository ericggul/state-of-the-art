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
  } = performance;

  const chartData = {
    labels,
    datasets: [
      {
        label: metric,
        data,
        borderColor: "#00ffff",
        backgroundColor: "rgba(0, 255, 255, 0.2)",
        pointBackgroundColor: "#00ffff",
        pointBorderColor: "#000000",
        pointHoverBackgroundColor: "#ffffff",
        pointHoverBorderColor: "#00ffff",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#00ffff",
          font: {
            family: "'Orbitron', sans-serif",
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: `Model ${metric} Performance`,
        color: "#00ffff",
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
          color: "#00ffff",
        },
        grid: {
          color: "rgba(0, 255, 255, 0.1)",
        },
        ticks: {
          color: "#00ffff",
          font: {
            family: "'Orbitron', sans-serif",
          },
        },
      },
      y: {
        title: {
          display: true,
          text: yAxisLabel,
          color: "#00ffff",
        },
        grid: {
          color: "rgba(0, 255, 255, 0.1)",
        },
        ticks: {
          color: "#00ffff",
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
