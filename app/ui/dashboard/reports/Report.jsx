"use client";
import React, { useEffect, useState } from "react";
import styles from "./report.module.css";
import { MdSearch } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import Smbent from "./smbent";
import WiprogressMerchant from "./wipmerchant";

const Report = ({ merchantDataByGolive, pendingMerchants }) => {
  const [data, getData] = useState(null);
  const [pendingData, setPendingData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    getData(merchantDataByGolive);
  }, [merchantDataByGolive]);

  useEffect(() => {
    setPendingData(pendingMerchants);
  }, [pendingMerchants]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formEntries = Object.fromEntries(formData.entries());
    router.push(
      `/dashboard/reports?start=${encodeURIComponent(
        formEntries.startDate
      )}&end=${encodeURIComponent(
        formEntries.endDate
      )}&mode=${encodeURIComponent(formEntries.mode)}`
    );
  };

  return (
    <div className={styles.reports}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="startDate" className={styles.label}>
          Start Date:
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          className={styles.input}
          required
        />
        <br />
        <label htmlFor="endDate" className={styles.label}>
          End Date:
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          className={styles.input}
          required
        />
        <input type="hidden" name="mode" value="kickoff" />
        <button className={styles.button}>
          <MdSearch className={styles.mdSearch} />
          Generate Report
        </button>
      </form>

      {!data && (
        <p style={{ marginTop: "2rem" }}>
          No Data To Display || Select Particular Date to view
        </p>
      )}
      {data !== null && (
        <div className={styles.header}>
          <h5>Live Merchant Till Date</h5>
          <div className={styles.results}>
            {<Smbent merchantData={data.smbData} />}
            {<Smbent merchantData={data.emergingData} />}
            {<Smbent merchantData={data.entData} />}
          </div>
          <br/>
          <h5>WIP Merchant Till Date</h5>
          <div className={styles.results}>
            {<WiprogressMerchant merchantData={pendingData.smbData} />}
            {<WiprogressMerchant merchantData={pendingData.emergingData} />}
            {<WiprogressMerchant merchantData={pendingData.entData} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
