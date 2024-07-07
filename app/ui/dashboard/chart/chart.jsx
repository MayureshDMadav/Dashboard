"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from './chart.module.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MerchantStatusChart = ({ merchantData }) => {
  const [chartData, setChartData] = useState(null);
  const { smbData, entData, emergingData } = merchantData;
  
  useEffect(() => {
    if (smbData || entData || emergingData) {
      const concatedData = [].concat(smbData || []).concat(entData || []).concat(emergingData || []);
      
      const ceData = concatedData.reduce((acc, item) => {
        if (!acc[item.cename]) {
          acc[item.cename] = {
            bookedArr: 0,
            expectedArr: 0,
            merchantCount: 0,
          };
        }
        acc[item.cename].bookedArr += parseFloat(item.bookedarr) || 0;
        acc[item.cename].expectedArr += parseFloat(item.expectedarr) || 0;
        acc[item.cename].merchantCount += 1;
        return acc;
      }, {});

      const labels = Object.keys(ceData);
      const bookedArrData = labels.map(ce => ceData[ce].bookedArr);
      const expectedArrData = labels.map(ce => ceData[ce].expectedArr);
      const merchantCountData = labels.map(ce => ceData[ce].merchantCount);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Booked ARR',
            data: bookedArrData,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Expected ARR',
            data: expectedArrData,
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
          {
            label: 'Merchant Count',
            data: merchantCountData,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          },
        ],
      });
    }
  }, [merchantData]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'CE Name Data Summary',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
      },
    },
  };

  return (
    <div className={styles.container}>
      {chartData && <Bar data={chartData} options={options} />}
    </div>
  );
};

export default MerchantStatusChart;