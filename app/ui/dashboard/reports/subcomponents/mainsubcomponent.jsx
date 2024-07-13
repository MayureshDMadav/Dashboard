import React, { useContext, useState } from "react";
import { ReportContext } from "@/app/component/contextProvider";
import LiveMerchant from "./livemerchant";
import PendingMerchants from "./pendingmerchants";
import { MerchantStatusPieChart, MqmPieChart } from "../charts/piechart";
import { MerchantStatusLineChart, MqmLineChart } from "../charts/linechart";
import { MerchantStatusBarChart, MqmBarChart } from "../charts/barchart";

export const MainSubComponent = ({ openDetail, enablePagination }) => {
  const [chart, setChart] = useState("pie");
  const { smbEnt, smbEntPending, emerging, emergingPending, styles } =
    useContext(ReportContext);

  const pendingMerchant = [
    ...(emergingPending || []),
    ...(smbEntPending || []),
  ];
  const liveNPendingMerchant = [
    ...(smbEnt || []),
    ...(smbEntPending || []),
    ...(emerging || []),
    ...(emergingPending || []),
  ];

  const handleChartChange = (e) => {
    setChart(e.target.value);
  };

  return (
    <>
      <div className={styles.chartSelect}>
        <select onChange={handleChartChange} value={chart}>
          <option value="pie">Pie Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
        </select>
      </div>
      <div className={styles.chartContainer}>
        <div className={styles.chart}>
          {chart === "pie" ? (
            <MqmPieChart data={pendingMerchant} />
          ) : chart === "line" ? (
            <MqmLineChart data={pendingMerchant} />
          ) : chart === 'bar'? (
            <MqmBarChart data={pendingMerchant} />
          ): ""}
        </div>
        <div className={styles.chart}>
          {chart === "pie" ? (
            <MerchantStatusPieChart data={liveNPendingMerchant} />
          ) : chart === "line" ? (
            <MerchantStatusLineChart data={liveNPendingMerchant} />
          ) : chart === "bar" ? (
            <MerchantStatusBarChart data={liveNPendingMerchant} />
          ) : ""}
        </div>
      </div>
      <LiveMerchant
        merchantData={smbEnt}
        mode="Live Merchants in SMB / ENT"
        type="smbent"
        styles={styles}
        details={openDetail}
        enablePagination={enablePagination}
      />
      <PendingMerchants
        merchantData={smbEntPending}
        mode="WIP Merchants in SMB / ENT"
        type="smbent"
        styles={styles}
        details={openDetail}
        enablePagination={enablePagination}
      />
      <LiveMerchant
        merchantData={emerging}
        mode="Live Merchants in EMERGING"
        styles={styles}
        details={openDetail}
        enablePagination={enablePagination}
      />
      <PendingMerchants
        merchantData={emergingPending}
        mode="WIP Merchants in EMERGING"
        styles={styles}
        details={openDetail}
        enablePagination={enablePagination}
      />
    </>
  );
};
