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
import styles from "./chart.module.css";

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

  useEffect(() => {
    if (merchantData) {
      let concatedData = [];
      if (
        merchantData.smbData ||
        merchantData.entData ||
        merchantData.emergingData
      ) {
        concatedData = []
          .concat(merchantData.smbData || [])
          .concat(merchantData.entData || [])
          .concat(merchantData.emergingData || []);
      }

      if (
        merchantData.smbData == undefined ||
        merchantData.entData == undefined ||
        merchantData.emergingData == undefined
      ) {
        concatedData = merchantData;
      }

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
      const bookedArrData = labels.map((ce) => ceData[ce].bookedArr);
      const expectedArrData = labels.map((ce) => ceData[ce].expectedArr);
      const merchantCountData = labels.map((ce) => ceData[ce].merchantCount);

      setChartData({
        labels,
        datasets: [
          {
            label: "Booked ARR",
            data: bookedArrData,
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
          {
            label: "Expected ARR",
            data: expectedArrData,
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
          {
            label: "Merchant Count",
            data: merchantCountData,
            backgroundColor: "rgba(75, 192, 192, 0.5)",
          },
        ],
      });
    }
  }, [merchantData]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "white",
        },
      },
      title: {
        display: true,
        text: "CE Name Data Summary",
        color: "white",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
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
        ticks: {
          color: "white",
        },
      },
      y: {
        stacked: false,
        ticks: {
          color: "white",
        },
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
