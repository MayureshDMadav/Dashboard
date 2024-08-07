"use client";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "./chart.module.css";
import { findUniqueElementInArray } from "@/backend/backendservice";

ChartJS.register(ArcElement, Tooltip, Legend);

let backgroundColors = [
  "#FFB6C1", // Light Pink
  "#90EE90", // Light Green
  "#ADD8E6", // Light Blue
  "#FFC0CB", // Another Light Pink
  "#98FB98", // Another Light Green
  "#B0E0E6", // Powder Blue
  "#F0FFF0", // Honeydew (Very Light Green)
  "#E6E6FA", // Lavender (Light Purple-Blue)
  "#FFF0F5", // Lavender Blush (Very Light Pink)
  "#F0FFFF", // Azure (Very Light Blue)
];
export const MerchantPieChart = ({ merchantData }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    try {
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

        setChartData({
          labels,
          datasets: [
            {
              label: "Booked ARR",
              data: bookedArrData,
              backgroundColor: backgroundColors.slice(0, labels.length),
              hoverBackgroundColor: backgroundColors.slice(0, labels.length),
              borderWidth: 1,
              borderColor: "transparent",
            },
            {
              label: "Expected ARR",
              data: expectedArrData,
              backgroundColor: backgroundColors
                .slice(0, labels.length)
                .reverse(),
              hoverBackgroundColor: backgroundColors
                .slice(0, labels.length)
                .reverse(),
              borderWidth: 1,
              borderColor: "transparent",
            },
          ],
        });
      }
    } catch (e) {
      console.log(e);
    }
  }, [merchantData]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "black",
        },
      },
      title: {
        display: true,
        text: "Contribution of ARR by CE",
        color: "grey",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || "";
            if (
              context.dataset.label === "Booked ARR" ||
              context.dataset.label === "Expected ARR"
            ) {
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
  const [cename, setCeName] = useState(null);
  const [count, setCount] = useState({});

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

      const getCeName = async () => {
        const uniqueCeName = await findUniqueElementInArray(
          concatedData,
          "cename"
        );
        if (uniqueCeName) {
          setCeName(uniqueCeName);
        }
      };

      const countCename = (data) => {
        const count = {};
        data.forEach((item) => {
          count[item.cename] = (count[item.cename] || 0) + 1;
        });
        return count;
      };

      getCeName();
      setCount(countCename(concatedData));
    }
  }, [merchantData]);

  const data = {
    labels: cename,
    datasets: [
      {
        label: "Merchant Count",
        data: Object.values(count),
        backgroundColor: backgroundColors,
        borderWidth: 1,
        borderColor: "transparent",
      },
    ],
  };

  const config = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "black",
        },
      },
      title: {
        display: true,
        text: "Count of Merchants per CE",
        color: "grey",
      },
    },
  };

  return (
    <div className={styles.container}>
      {cename && count && Object.keys(count).length > 0 && (
        <Pie data={data} options={config} />
      )}
    </div>
  );
};
