"use client";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "./chart.module.css";
import { findUniqueElementInArray } from "@/backend/backendservice";

ChartJS.register(ArcElement, Tooltip, Legend);

export const MerchantPieChart = ({ merchantData }) => {
  const [chartData, setChartData] = useState(null);
  const { smbData, entData, emergingData } = merchantData;

  useEffect(() => {
    if (smbData || entData || emergingData) {
      const concatedData = []
        .concat(smbData || [])
        .concat(entData || [])
        .concat(emergingData || []);

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

      const backgroundColors = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
      ];

      setChartData({
        labels,
        datasets: [
          {
            label: "Booked ARR",
            data: bookedArrData,
            backgroundColor: backgroundColors.slice(0, labels.length),
            hoverBackgroundColor: backgroundColors.slice(0, labels.length),
          },
          {
            label: "Expected ARR",
            data: expectedArrData,
            backgroundColor: backgroundColors.slice(0, labels.length).reverse(), // Reverse colors for differentiation
            hoverBackgroundColor: backgroundColors
              .slice(0, labels.length)
              .reverse(),
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
        color: "white",
      },
      title: {
        display: true,
        text: "Contribution of ARR by CE",
        color: "white",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || "";
            if (context.dataset.label === "Booked ARR") {
              label += `: ${parseFloat(context.raw).toFixed(2)}`;
            } else if (context.dataset.label === "Expected ARR") {
              label += `: ${parseFloat(context.raw).toFixed(2)}`;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className={styles.container}>
      {chartData && <Pie data={chartData} options={options} />}
    </div>
  );
};

export const MerchantCountChart = ({ merchantData }) => {
  const [chartData, setChartData] = useState(null);
  const [cename, setCeName] = useState([]);
  const { smbData, entData, emergingData } = merchantData;

  useEffect(() => {
    if (smbData || entData || emergingData) {
      const concatedData = []
        .concat(smbData || [])
        .concat(entData || [])
        .concat(emergingData || []);
      const uniqueCeName = findUniqueElementInArray(concatedData,"cename");
      if(uniqueCeName){
        setCeName(uniqueCeName);
      }

    }
  }, [merchantData]);


  



};
