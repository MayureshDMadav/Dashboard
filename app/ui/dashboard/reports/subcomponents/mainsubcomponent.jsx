import { ReportContext } from "@/app/component/contextProvider";
import { useContext } from "react";
import LiveMerchant from "./livemerchant";
import PendingMerchants from "./pendingmerchants";

export const MainSubComponent = ({openDetail , enablePagination}) => {
  const {
    smbEnt,
    smbEntPending,
    emerging,
    emergingPending,
    styles,
  } = useContext(ReportContext);   
  return (
    <>
      <div className={styles.chartContainer}>
        <div className={styles.chart}></div>
        <div className={styles.chart}></div>
      </div>

      <LiveMerchant
        merchantData={smbEnt}
        mode={"Live Merchants in SMB / ENT"}
        type="smbent"
        styles={styles}
        details={openDetail}
        enablePagination = {enablePagination}
      />
      <PendingMerchants
        merchantData={smbEntPending}
        mode={"WIP Merchants in SMB / ENT"}
        type="smbent"
        styles={styles}
        details={openDetail}
        enablePagination = {enablePagination}
      />
      <LiveMerchant
        merchantData={emerging}
        mode={"Live Merchants in EMERGING"}
        styles={styles}
        details={openDetail}
        enablePagination = {enablePagination}
      />
      <PendingMerchants
        merchantData={emergingPending}
        mode={"WIP Merchants in EMERGING"}
        styles={styles}
        details={openDetail}
        enablePagination = {enablePagination}
      />
    </>
  );
};
