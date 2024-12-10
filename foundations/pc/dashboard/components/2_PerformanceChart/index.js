import React, { useEffect, useRef } from "react";
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

const KEY_HUE = 230;

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
  primary: `hsla(${hue}, 100%, 50%, 0.8)`,
  secondary: `hsla(${hue}, 80%, 70%, 0.2)`,
  gradient: [`hsla(${hue}, 100%, 50%, 0.8)`, `hsla(${hue}, 100%, 50%, 0.1)`],
  grid: `hsla(${hue}, 60%, 50%, 0.1)`,
  text: `hsl(${hue}, 15%, 85%)`,
  point: `hsla(${hue}, 100%, 70%, 0.9)`,
  hover: `hsl(${hue}, 100%, 90%)`,
  glow: `hsla(${hue}, 100%, 50%, 0.5)`,
});

export default function PerformanceChart({ performance, hue }) {
  const chartRef = useRef(null);
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

  const colors = generateColors(hue);

  const chartData = {
    labels: benchmarks?.labels || labels,
    datasets: [
      {
        label: `${metric} Score`,
        data: benchmarks?.data || data,
        borderColor: colors.primary,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return colors.secondary;

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, colors.gradient[1]);
          gradient.addColorStop(1, colors.gradient[0]);
          return gradient;
        },
        pointBackgroundColor: colors.point,
        pointBorderColor: "transparent",
        pointHoverBackgroundColor: colors.hover,
        pointHoverBorderColor: colors.primary,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointStyle: "circle",
        pointBorderWidth: 2,
        shadowBlur: 10,
        shadowColor: colors.glow,
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
        backgroundColor: `hsla(${hue}, 20%, 15%, 0.9)`,
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
        boxPadding: 6,
        boxWidth: 6,
        boxHeight: 6,
        usePointStyle: true,
        bodySpacing: 4,
        titleSpacing: 4,
        borderColor: colors.primary,
        borderWidth: 1,
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
          borderDash: [5, 5],
          lineWidth: 0.5,
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
          borderDash: [5, 5],
          lineWidth: 0.5,
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
    animation: {
      duration: 400,
      easing: "easeOutQuart",
    },
    transitions: {
      show: {
        animations: {
          x: {
            from: 0,
          },
          y: {
            from: 0,
          },
        },
      },
    },
  };

  // Add glow effect to the line
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    const originalStroke = ctx.stroke;
    ctx.stroke = function () {
      ctx.save();
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      originalStroke.apply(this, arguments);
      ctx.restore();
    };
  }, [colors.glow]);

  return (
    <S.Container>
      <S.ChartWrapper>
        <Line ref={chartRef} options={options} data={chartData} />
      </S.ChartWrapper>
    </S.Container>
  );
}
