"use client";
import {
  filterMerchantByGolive,
  filterMerchantByPending,
} from "@/backend/backendservice";
import PendingMerchants from "./pendingmerchants";
import styles from "./report.module.css";
import { useEffect, useState } from "react";
import LiveMerchant from "./livemerchant";
import ExpectedArrChart from "./charts/expectedArr";
import MQMDetailedChart from "./charts/mqmchart";
import CalendarInput from "../calendar/calendar";

const Report = ({ smbEntMerchant, emergingMerchant }) => {
  const [smbEnt, setSmbEnt] = useState([]);
  const [emerging, setEmerging] = useState([]);
  const [smbEntPending, setSmbEntPending] = useState([]);
  const [emergingPending, setEmergingPending] = useState([]);
  let merjeData = smbEntMerchant?.concat(emergingMerchant);
  //For Go Live Merchant Filtering
  async function merchantByGolive(data, mode) {
    try {
      if (mode == "smb") {
        const { smbData, entData } = await filterMerchantByGolive(data);
        const smBData = smbData.concat(entData);
        setSmbEnt(smBData);
      }
      if (mode == "longtail") {
        const { emergingData } = await filterMerchantByGolive(data);
        setEmerging(emergingData);
      }
    } catch (e) {}
  }

  //For Pending Merchant Filter
  async function merchantByPending(data, mode) {
    try {
      if (mode == "smb") {
        const { smbData, entData } = await filterMerchantByPending(data);
        const smBData = smbData.concat(entData);
        setSmbEntPending(smBData);
      }
      if (mode == "longtail") {
        const { emergingData } = await filterMerchantByPending(data);
        setEmergingPending(emergingData);
      }
    } catch (e) {}
  }

  useEffect(() => {
    try {
      if (smbEntMerchant.length > 0) {
        merchantByGolive(smbEntMerchant, "smb");
        merchantByPending(smbEntMerchant, "smb");
      }
    } catch (e) {}
  }, [smbEntMerchant]);

  useEffect(() => {
    try {
      if (emergingMerchant.length > 0) {
        merchantByGolive(emergingMerchant, "longtail");
        merchantByPending(emergingMerchant, "longtail");
      }
    } catch (e) {}
  }, [emergingMerchant]);

  return (
    <div className={styles.container}>
      <CalendarInput/>
      <div className={styles.chartContainer}>
        <div className={styles.chart}>
          <ExpectedArrChart data={merjeData} />
        </div>
        <div className={styles.chart}>
          <MQMDetailedChart data={merjeData} />
        </div>
      </div>

      <LiveMerchant
        merchantData={smbEnt}
        mode={"Live Merchants in SMB / ENT"}
      />
      <PendingMerchants
        merchantData={smbEntPending}
        mode={"WIP Merchants in SMB / ENT"}
      />
      <LiveMerchant
        merchantData={emerging}
        mode={"Live Merchants in EMERGING"}
      />
      <PendingMerchants
        merchantData={emergingPending}
        mode={"WIP Merchants in EMERGING"}
      />
    </div>
  );
};

export default Report;
