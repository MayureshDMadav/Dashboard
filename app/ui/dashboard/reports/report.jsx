"use client";
import {
  filterMerchantByGolive,
  filterMerchantByPending,
} from "@/backend/backendservice";
import styles from "./report.module.css";
import { useEffect, useState, useCallback, useMemo } from "react";
import CalendarInput from "../calendar/calendar";
import Popup from "reactjs-popup";
import { ReportContext } from "@/app/component/contextProvider";
import { MainSubComponent } from "./subcomponents/mainsubcomponent";

const Report = ({ smbEntMerchant, emergingMerchant }) => {
  const [smbEnt, setSmbEnt] = useState([]);
  const [emerging, setEmerging] = useState([]);
  const [smbEntPending, setSmbEntPending] = useState([]);
  const [emergingPending, setEmergingPending] = useState([]);

  const filterMerchants = useCallback(
    async (data, mode, filterFunc, setStateFunc) => {
      if (!data.length) {
        setStateFunc([]);
        return;
      }
      try {
        const result = await filterFunc(data);
        if (mode === "smb") {
          const combinedData = [
            ...(result.smbData || []),
            ...(result.entData || []),
          ];
          setStateFunc(combinedData);
        } else if (mode === "longtail") {
          setStateFunc(result.emergingData || []);
        }
      } catch (e) {
        console.error("Error filtering merchants:", e);
      }
    },
    []
  );

  useEffect(() => {
    filterMerchants(smbEntMerchant, "smb", filterMerchantByGolive, setSmbEnt);
    filterMerchants(
      smbEntMerchant,
      "smb",
      filterMerchantByPending,
      setSmbEntPending
    );
  }, [smbEntMerchant, filterMerchants]);

  useEffect(() => {
    filterMerchants(
      emergingMerchant,
      "longtail",
      filterMerchantByGolive,
      setEmerging
    );
    filterMerchants(
      emergingMerchant,
      "longtail",
      filterMerchantByPending,
      setEmergingPending
    );
  }, [emergingMerchant, filterMerchants]);

  const contextValues = useMemo(
    () => ({
      smbEnt,
      smbEntPending,
      emerging,
      emergingPending,
      styles,
    }),
    [smbEnt, smbEntPending, emerging, emergingPending]
  );

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
              modal
              contentStyle={{ width: "100%" }}
            >
              {(close) => (
                <div className={styles.popup}>
                  <div className={styles.button}>
                    <button>Send Email</button>
                    <button onClick={close}>Close</button>
                  </div>
                  <MainSubComponent
                    openDetail="open"
                    enablePagination={false}
                  />
                </div>
              )}
            </Popup>
          </div>
        </div>
        <MainSubComponent openDetail="" enablePagination={true} />
      </div>
    </ReportContext.Provider>
  );
};

export default Report;
