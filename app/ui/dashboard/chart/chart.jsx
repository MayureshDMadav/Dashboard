"use client";

import { useEffect, useState } from "react";
import styles from "./chart.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Chart = ({ merchantData }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(merchantData);
  }, [merchantData]);

  if (data) {
    let sum = 0;
    let expectedArr = [];
    data.forEach((data) => {
      console.log(data);
      expectedArr.push(Number.parseFloat(data.expectedarr));
      sum += Number.parseFloat(data.expectedarr);
    });
  }

  const dataMenu = [
    {
      name: "Sun",
      kickoff: 4000,
      Golive: 2400,
    },
    {
      name: "Mon",
      kickoff: 3000,
      Golive: 1398,
    },
    {
      name: "Tue",
      kickoff: 2000,
      Golive: 3800,
    },
    {
      name: "Wed",
      kickoff: 2780,
      Golive: 3908,
    },
    {
      name: "Thu",
      kickoff: 1890,
      Golive: 4800,
    },
    {
      name: "Fri",
      kickoff: 2390,
      click: 3800,
    },
    {
      name: "Sat",
      kickoff: 3490,
      Golive: 4300,
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Weekly Recap</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={dataMenu}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip contentStyle={{ background: "#151c2c", border: "none" }} />
          <Legend />
          <Line
            type="monotone"
            dataKey="kickoff"
            stroke="#8884d8"
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="Golive"
            stroke="#82ca9d"
            strokeDasharray="3 4 5 2"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
