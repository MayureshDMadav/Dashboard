"use client";

import React, { useState } from "react";
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
import { format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ExpectedArrChart = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const itemsPerPage = 5;

  const sortedData = [...data].sort(
    (a, b) => new Date(a.kickoff) - new Date(b.kickoff)
  );

  const allDates = [...new Set(sortedData.map((item) => item.kickoff))];

  const totalPages = Math.ceil(allDates.length / itemsPerPage);

  const currentDates = allDates.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const categories = ["SMB", "ENT", "Emerging"]; 

  const formattedDates = currentDates.map((data) =>
    format(new Date(data), "dd-MMMM-yy")
  );

  let filteredData = sortedData;
  if (selectedCategory !== "All") {
    filteredData = sortedData.filter((item) => item.category === selectedCategory);
  }

  const chartData = {
    labels: formattedDates,
    datasets: categories.map((category) => ({
      label: category,
      data: currentDates.map((date) => {
        const dateData = filteredData.filter(
          (item) => item.kickoff === date && item.category === category
        );
        return dateData.reduce((sum, item) => {
          const expectedArr = parseFloat(item.expectedarr);
          return sum + (isNaN(expectedArr) ? 0 : expectedArr);
        }, 0);
      }),
      backgroundColor: getColorForCategory(category),
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Expected ARR by Date and Category (Page ${
          currentPage + 1
        } of ${totalPages})`,
      },
      tooltip: {
        callbacks: {
          afterBody: (context) => {
            const dateData = filteredData.filter(
              (item) =>
                item.kickoff === context[0].label &&
                item.category === context[0].dataset.label
            );
            return dateData
              .map((item) => `${item.merchantname}: ${item.expectedarr}`)
              .join("\n");
          },
          bodyFontColor: "white",
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Kickoff Date",
          color:'white'
        },
        ticks: {
          color: "white", 
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Expected ARR",
          color:'white'
        },
        ticks: {
          color: "white", 
        },
      },
    },
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div>
      <div style={{ marginBottom: "10px",marginLeft:"1rem"  }}>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{background:'var(--bgSoft)',padding:'0.5rem',borderRadius:'5px',color:'white',position:'absolute'}}
        >
          <option value="All">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <Bar data={chartData} options={options} />
      {totalPages > 1 && (
        <div style={{ marginTop: "0.5rem", marginBottom: "1.2rem", textAlign: "center" }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              style={{
                margin: "8px 5px",
                padding: "5px 10px",
                backgroundColor: currentPage === i ? "#4CAF50" : "#f1f1f1",
                color: currentPage === i ? "white" : "black",
                border: "none",
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function getColorForCategory(category) {
  switch (category) {
    case "SMB":
      return "rgba(75, 192, 192, 0.6)";
    case "ENT":
      return "rgba(255, 99, 132, 0.6)";
    case "Emerging":
      return "rgba(255, 205, 86, 0.6)";
    default:
      return "rgba(201, 203, 207, 0.6)";
  }
}

export default ExpectedArrChart;
