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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

const commonOptions = {
  responsive: true,
  type: "line",
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "black",
        font: {
          size: 12,
        },
      },
    },
    title: {
      display: true,
      position: "top",
      color: "black",
      font: {
        size: 16,
        weight: "bold",
      },
      padding: {
        top: 10,
        bottom: 30,
      },
    },
  },
  elements: {
    line: {
      tension: 0,
    },
  },
};

export const MqmLineChart = ({ data }) => {
  const mqmCounts = {
    YES: data.filter((item) => item.mqm === true).length,
    NO: data.filter((item) => item.mqm === false).length,
  };

  const chartData = {
    labels: ["YES","NO"],
    datasets: [
      {
        label: ["YES"],
        data: [mqmCounts.YES, mqmCounts.NO],
        backgroundColor: ["#4CAF50", "#DB8EAA"],
        borderColor: ["#4CAF50", "#DB8EAA"],
        borderWidth: 1,
        tension: 0,
      },
    ],
  };

  const options = {
    ...commonOptions,
    scales: {
      y: {
        title: "MQM Status",
      },
      x: {
        title: "Count",
      },
    },
    plugins: {
      ...commonOptions.plugins,
      title: {
        ...commonOptions.plugins.title,
        text: "Mint Qualified Merchants",
      },
    },
  };

  return (
    <div style={{ height: "300px", width: "auto" }} id='chartReport'>
      <Line data={chartData} options={options} />
    </div>
  );
};

export const MerchantStatusLineChart = ({ data }) => {
    const statusCounts = data.reduce((acc, item) => {
      const status = item.livedate === "NA" || "" ? "Work in Progress" : "Live";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  
    const chartData = {
      labels: ['Live', 'Work in Progress'], 
      datasets: [
        {
          label: ["Go Live"], 
          data: [statusCounts.Live || 0, statusCounts['Work in Progress'] || 0], 
          backgroundColor: ['#4CAF50', '#DB8EAA'],
          borderColor: ['#4CAF50', '#DB8EAA'],
          borderWidth: 1,
          tension: 0
        }
      ]
    };
  
    const options = {
      ...commonOptions,
      scales: {
        y: {
          title: 'Merchant Status' 
        },
        x: {
          title: 'Count' 
        }
      },
      plugins: {
        ...commonOptions.plugins,
        title: {
          ...commonOptions.plugins.title,
          text: 'Merchant Status Distribution'
        }
      }
    };
  
    return (
      <div style={{ height: '300px', width: 'auto' }} id='chartReport'>
        <Line data={chartData} options={options} />
      </div>
    );
  };
  