"use client";
import React from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import styles from "./card.module.css";

const PopupComponent = ({ merchantData }) => {
  console.log(merchantData);
  const styling = `
    .popup-content{
    width:auto !important;
    background:var(--bgSoft);
  
    }`;
  return (
    <span className={styles.popupcontainer}>
      <style>{styling}</style>
      <Popup
        trigger={<button className={styles.button}> View</button>}
        position="right center"
        style={{ width: "auto" }}
      >
        <table className={styles.table}>
          {merchantData.length === 0 && (
            <>No Data To Display</>
          )}  
          {merchantData.length > 0 && (
            <thead>
              <tr>
                <td>Merchant Name</td>
                <td>CE Name</td>
                <td>Booked Arr</td>
                <td>Transactions</td>
              </tr>
            </thead>
          )}
          {merchantData &&
            merchantData.map((data) => (
              <tbody>
                <tr>
                  <td>{data.merchantname}</td>
                  <td>{data.cename}</td>
                  <td>{data.bookedarr}</td>
                  <td>{data.txn}</td>
                </tr>
              </tbody>
            ))}
        </table>
      </Popup>
    </span>
  );
};

export default PopupComponent;
