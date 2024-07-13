import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: 'white',
        font: {
          size: 12
        }
      },
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
  elements: {
    arc: {
      borderWidth: 0    }
  }
};

export const MqmPieChart = ({ data }) => {
  const mqmCounts = {
    Yes: data.filter(item => item.mqm === true).length,
    No: data.filter(item => item.mqm === false).length
  };

  const chartData = {
    labels: [`Yes (${mqmCounts.Yes})`, `No (${mqmCounts.No})`],
    datasets: [
      {
        data: [mqmCounts.Yes, mqmCounts.No],
        backgroundColor: ['#4CAF50', '#DB8EAA'],
        hoverBackgroundColor: ['#45a049', '#FFB300']
      }
    ]
  };

  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        ...commonOptions.plugins.title,
        text: 'MQM Distribution'
      }
    }
  };

  return (
    <div style={{ height: '300px', width: '300px', margin: "auto" }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export const MerchantStatusPieChart = ({ data }) => {
  const statusCounts = {
    Live: data.filter(item => item.livedate !== "NA").length,
    WIP: data.filter(item => item.livedate === "NA").length
  };

  const chartData = {
    labels: [`Live (${statusCounts.Live})`, `Work in Progress (${statusCounts.WIP})`],
    datasets: [
      {
        data: [statusCounts.Live, statusCounts.WIP],
        backgroundColor: ['#4CAF50', '#DB8EAA'],
        hoverBackgroundColor: ['#45a049', '#FFB300']
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
      <Pie data={chartData} options={options} />
    </div>
  );
};