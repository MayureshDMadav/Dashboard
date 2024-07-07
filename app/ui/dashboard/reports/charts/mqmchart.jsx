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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MQMDetailedChart = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const [mqmFilter, setMQMFilter] = useState("all");

  const sortedData = [...data].sort(
    (a, b) => new Date(a.kickoff) - new Date(b.kickoff)
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = sortedData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const filteredData = currentData.filter((item) => {
    if (mqmFilter === "all") {
      return true;
    } else if (mqmFilter === "yes") {
      return item.mqm;
    } else {
      return !item.mqm;
    }
  });

  const chartData = {
    labels: filteredData.map((item) => item.merchantname),
    datasets: [
      {
        label: "Expected ARR",
        data: filteredData.map((item) => item.expectedarr),
        backgroundColor: filteredData.map((item) =>
          item.mqm ? "rgba(75, 192, 192, 0.6)" : "rgba(255, 99, 132, 0.6)"
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Merchant Details (Page ${currentPage + 1} of ${totalPages})`,
      },
      tooltip: {
        callbacks: {
          afterBody: (context) => {
            const item = filteredData[context[0].dataIndex];
            return [
              `Expected ARR: ${item.expectedarr}`,
              `State: ${item.merchantstate}`,
              `Comment: ${item.mintcomment}`,
            ].join("\n");
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Merchant Name",
          color: "white", 
        },
        ticks: {
            color: "white", 
          },
  
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Expected ARR",
          color: "white", 
        },
        ticks: {
            color: "white", 
          },
  
      },
    },
  };

  const handleFilterChange = (event) => {
    setMQMFilter(event.target.value);
  };

  return (
    <div>
      <div style={{ marginBottom: "10px",marginLeft:"2rem"  }}>
        <select value={mqmFilter} onChange={handleFilterChange} style={{background:'var(--bgSoft)',padding:'0.5rem',borderRadius:'5px',color:'white',position:'absolute'}}>
          <option value="all">All MQM</option>
          <option value="yes">MQM Yes</option>
          <option value="no">MQM No</option>
        </select>
      </div>
      <Bar data={chartData} options={options} />
      {totalPages > 1 && (
        <div style={{ marginTop: "0.5rem",marginBottom:"1.2rem", textAlign: "center" }}>
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

export default MQMDetailedChart;
