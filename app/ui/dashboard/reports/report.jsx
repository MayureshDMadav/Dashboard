"use client";
import {
  filterMerchantByGolive,
  filterMerchantByPending,
} from "@/backend/backendservice";
import PendingMerchants from "./subcomponents/pendingmerchants";
import styles from "./report.module.css";
import { useEffect, useRef, useState } from "react";
import LiveMerchant from "./subcomponents/livemerchant";
import CalendarInput from "../calendar/calendar";
import Popup from "reactjs-popup";
import { ReportContext } from "@/app/component/contextProvider";
import { MainSubComponent } from "./subcomponents/mainsubcomponent";

const Report = ({ smbEntMerchant, emergingMerchant }) => {
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

  const contextValues = {
    smbEnt,
    smbEntPending,
    emerging,
    emergingPending,
    styles,
  };

  return (
    <ReportContext.Provider value={contextValues}>
      <div className={styles.container}>
        <div className={styles.childElement}>
          <div className={styles.popElem}>
            <CalendarInput />
          </div>
          <div className={styles.popElem}>
            <Popup
              trigger={<button className={styles.popupButton}>Preview</button>}
              position="center"
              style={{ width: "100%" }}
            >
              <div className={styles.popup}>
                <MainSubComponent
                  openDetail={"open"}
                  enablePagination={false}
                />
              </div>
            </Popup>
          </div>
        </div>

        <MainSubComponent openDetail={""} enablePagination={true} />
      </div>
    </ReportContext.Provider>
  );
};

export default Report;
