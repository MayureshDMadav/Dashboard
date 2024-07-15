"use client";
import {
  filterMerchantByGolive,
  filterMerchantByPending,
} from "@/backend/backendservice";
import styles from "./report.module.css";
import { useEffect, useState, useCallback, useMemo } from "react";
import CalendarInput from "../calendar/calendar";
import PopupTemplate from "../reports/previewtemplate/popuptemplate";
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

  const reportComponent = (
    <MainSubComponent openDetail="open" enablePagination={false} />
  );

  return (
    <ReportContext.Provider value={contextValues}>
      <div className={styles.container}>
        <div className={styles.childElement}>
          <div className={styles.popElem}>
            <CalendarInput />
          </div>
          <div className={styles.popElem}>
            <PopupTemplate templateData={reportComponent} />
          </div>
        </div>
        <MainSubComponent openDetail="" enablePagination={true} />
      </div>
    </ReportContext.Provider>
  );
};

export default Report;
