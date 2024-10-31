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

export default function PerformanceChart({ performance }) {
  const data = {
    labels: performance.labels,
    datasets: [
      {
        label: "Perplexity",
        data: performance.data,
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
        text: "Model Performance",
        color: "#00ffff",
        font: {
          family: "'Orbitron', sans-serif",
          size: 16,
        },
      },
    },
    scales: {
      x: {
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
    },
  };

  return <Line options={options} data={data} />;
}
