import React, { useContext, useState, useMemo, useCallback } from "react";
import { ReportContext } from "@/app/component/contextProvider";
import LiveMerchant from "./livemerchant";
import PendingMerchants from "./pendingmerchants";
import { MerchantStatusPieChart, MqmPieChart } from "../charts/piechart";
import { MerchantStatusLineChart, MqmLineChart } from "../charts/linechart";
import { MerchantStatusBarChart, MqmBarChart } from "../charts/barchart";

const ChartComponents = {
  pie: { Mqm: MqmPieChart, MerchantStatus: MerchantStatusPieChart },
  line: { Mqm: MqmLineChart, MerchantStatus: MerchantStatusLineChart },
  bar: { Mqm: MqmBarChart, MerchantStatus: MerchantStatusBarChart },
};

export const MainSubComponent = ({ openDetail, enablePagination }) => {
  const [chart, setChart] = useState("pie");
  const { smbEnt, smbEntPending, emerging, emergingPending, styles } = useContext(ReportContext);

  const pendingMerchant = useMemo(() => [
    ...(emergingPending || []),
    ...(smbEntPending || []),
  ], [emergingPending, smbEntPending]);

  const liveNPendingMerchant = useMemo(() => [
    ...(smbEnt || []),
    ...(smbEntPending || []),
    ...(emerging || []),
    ...(emergingPending || []),
  ], [smbEnt, smbEntPending, emerging, emergingPending]);

  const handleChartChange = useCallback((e) => {
    setChart(e.target.value);
  }, []);

  const { Mqm: MqmChart, MerchantStatus: MerchantStatusChart } = ChartComponents[chart] || {};

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
          {MqmChart && <MqmChart data={pendingMerchant} />}
        </div>
        <div className={styles.chart}>
          {MerchantStatusChart && <MerchantStatusChart data={liveNPendingMerchant} />}
        </div>
      </div>
      {[
        { data: smbEnt, mode: "Live Merchants in SMB / ENT", type: "smbent", Component: LiveMerchant },
        { data: smbEntPending, mode: "WIP Merchants in SMB / ENT", type: "smbent", Component: PendingMerchants },
        { data: emerging, mode: "Live Merchants in EMERGING", Component: LiveMerchant },
        { data: emergingPending, mode: "WIP Merchants in EMERGING", Component: PendingMerchants },
      ].map(({ data, mode, type, Component }, index) => (
        <Component
          key={index}
          merchantData={data}
          mode={mode}
          type={type}
          styles={styles}
          details={openDetail}
          enablePagination={enablePagination}
        />
      ))}
    </>
  );
};