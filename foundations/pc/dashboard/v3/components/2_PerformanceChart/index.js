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

const KEY_HUE = 300;

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

// Helper function to generate colors based on KEY_HUE
const generateColors = (hue) => ({
  primary: `hsl(${hue}, 100%, 50%)`,
  secondary: `hsl(${hue}, 80%, 70%)`,
  grid: `hsla(${hue}, 60%, 50%, 0.1)`,
  text: `hsl(${hue}, 15%, 85%)`,
  point: `hsl(${hue}, 100%, 70%)`,
  hover: `hsl(${hue}, 100%, 90%)`,
});

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

  const colors = generateColors(KEY_HUE);

  const chartData = {
    labels: benchmarks?.labels || labels,
    datasets: [
      {
        label: `${metric} Score`,
        data: benchmarks?.data || data,
        borderColor: colors.primary,
        backgroundColor: colors.secondary,
        pointBackgroundColor: colors.point,
        pointBorderColor: colors.primary,
        pointHoverBackgroundColor: colors.hover,
        pointHoverBorderColor: colors.primary,
        borderWidth: 2,
        tension: 0.4, // Smooth lines for more modern look
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2,
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 5,
        bottom: 10,
      },
    },
    plugins: {
      legend: {
        position: "top",
        align: "start",
        labels: {
          color: colors.text,
          font: {
            family:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
            size: 10,
            weight: 400,
          },
          usePointStyle: true,
          padding: 8,
          boxWidth: 6,
          boxHeight: 6,
        },
      },
      title: {
        display: true,
        text: `Model ${metric} Performance`,
        color: colors.text,
        font: {
          family:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
          size: 11,
          weight: 500,
        },
        padding: {
          top: 5,
          bottom: 10,
        },
      },
      tooltip: {
        backgroundColor: `hsla(${KEY_HUE}, 20%, 15%, 0.8)`,
        titleColor: colors.text,
        bodyColor: colors.text,
        padding: 8,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `${metric}: ${formatValue(value, format)}`;
          },
        },
        titleFont: {
          family:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
          size: 10,
          weight: 500,
        },
        bodyFont: {
          family:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
          size: 10,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xAxisLabel,
          color: colors.text,
          font: {
            family:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
            size: 10,
            weight: 400,
          },
          padding: { top: 5 },
        },
        grid: {
          color: colors.grid,
          drawBorder: false,
        },
        ticks: {
          color: colors.text,
          font: {
            family:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
            size: 9,
          },
          padding: 3,
          maxRotation: 0,
          autoSkip: true,
          autoSkipPadding: 10,
        },
      },
      y: {
        title: {
          display: true,
          text: yAxisLabel,
          color: colors.text,
          font: {
            family:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
            size: 10,
            weight: 400,
          },
          padding: { bottom: 5 },
        },
        grid: {
          color: colors.grid,
          drawBorder: false,
        },
        ticks: {
          color: colors.text,
          font: {
            family:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
            size: 9,
          },
          padding: 3,
          callback: (value) => formatValue(value, format),
        },
        reverse: isLowerBetter,
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
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
