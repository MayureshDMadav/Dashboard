"use client";
import {
  filterMerchantByGolive,
  filterMerchantByPending,
} from "@/backend/backendservice";
import PendingMerchants from "./pendingmerchants";
import styles from "./report.module.css";
import { useEffect, useRef, useState } from "react";
import LiveMerchant from "./livemerchant";
import CalendarInput from "../calendar/calendar";
import { ReportComponentProvider } from "@/app/component/contextProvider";
import Popup from "reactjs-popup";
import { PreviewPopup } from "./preview/preview";

const Report = ({ smbEntMerchant, emergingMerchant }) => {
  const reportRef = useRef(null);
  const [smbEnt, setSmbEnt] = useState([]);
  const [emerging, setEmerging] = useState([]);
  const [smbEntPending, setSmbEntPending] = useState([]);
  const [emergingPending, setEmergingPending] = useState([]);

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
      <CalendarInput />
      <Popup
        trigger={<button className={styles.button}> View</button>}
        position="center center"
        style={{ width: "auto" }}
      >

      </Popup>
           <div className={styles.chartContainer}>
            <div className={styles.chart}></div>
            <div className={styles.chart}></div>
          </div>

          <LiveMerchant
            merchantData={smbEnt}
            mode={"Live Merchants in SMB / ENT"}
            type="smbent"
          />
          <PendingMerchants
            merchantData={smbEntPending}
            mode={"WIP Merchants in SMB / ENT"}
            type="smbent"
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
