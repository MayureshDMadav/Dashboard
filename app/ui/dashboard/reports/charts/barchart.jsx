import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      position: 'top',
      color: 'white',
      font: {
        size: 16,
        weight: 'bold'
      },
      padding: {
        top: 10,
        bottom: 30
      }
    }
  },
  scales: {
    x: {
      ticks: { color: 'white' },
      grid: { color: 'rgba(255, 255, 255, 0.1)' }
    },
    y: {
      ticks: { color: 'white' },
      grid: { color: 'rgba(255, 255, 255, 0.1)' }
    }
  }
};

export const MqmBarChart = ({ data }) => {
  const mqmCounts = {
    Yes: data.filter(item => item.mqm === true).length,
    No: data.filter(item => item.mqm === false).length
  };

  const chartData = {
    labels: ['Yes', 'No'],
    datasets: [
      {
        data: [mqmCounts.Yes, mqmCounts.No],
        backgroundColor: ['#4CAF50', '#DB8EAA'],
        hoverBackgroundColor: ['#45a049', '#FFB300'],
        borderColor: 'white',
        borderWidth: 1
      }
    ]
  };

  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        ...commonOptions.plugins.title,
        text: 'Mint Qualified Merchants'
      }
    }
  };

  return (
    <div style={{ height: '300px', width: '300px', margin: "auto" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export const MerchantStatusBarChart = ({ data }) => {
  const statusCounts = {
    Live: data.filter(item => item.livedate !== "NA").length,
    WIP: data.filter(item => item.livedate === "NA").length
  };

  const chartData = {
    labels: ['Live', 'Work in Progress'],
    datasets: [
      {
        data: [statusCounts.Live, statusCounts.WIP],
        backgroundColor: ['#4CAF50', '#DB8EAA'],
        hoverBackgroundColor: ['#45a049', '#FFB300'],
        borderColor: 'white',
        borderWidth: 1
      }
    ]
  };

  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        ...commonOptions.plugins.title,
        text: 'Merchant Status Distribution'
      }
    }
  };

  return (
    <div style={{ height: '300px', width: '300px', margin: "auto" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};