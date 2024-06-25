"use client";
import React, { useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import styles from "./card.module.css";

const PopupComponent = ({ merchantData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // You can adjust this number as needed

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = merchantData.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(merchantData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const styling = `
    .popup-content {
      width: auto !important;
      background: var(--bgSoft);
    }
    .pagination {
      display: flex;
      flex-direction:row;
      margin-left:auto;
      margin-right:auto;
      justify-content: center;
      list-style: none;
      padding: 0;
      width:100%;
      position:absolute;
      margin-top: 0.5rem;
    }
    .pagination li {
      margin: 0 2px;
    }
    .pagination button {
      padding: 1px;
      border-radius:3px;
      width:1.3rem;
      border: 1px solid #ccc;
      background-color: #fff;
      cursor: pointer;
    }
    .pagination button.active {
      background-color: #007bff;
      color: #fff;
    }
  `;

  return (
    <span className={styles.popupcontainer}>
      <style>{styling}</style>
      <Popup
        trigger={<button className={styles.button}> View</button>}
        position="right center"
        style={{ width: "auto" }}
      >
        <table className={styles.table}>
          {merchantData.length === 0 && <>No Data To Display</>}
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
          <tbody>
            {currentItems.map((data, index) => (
              <tr key={index}>
                <td>{data.merchantname}</td>
                <td>{data.cename}</td>
                <td>{data.bookedarr}</td>
                <td>{data.txn}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li key={number}>
              <button
                onClick={() => setCurrentPage(number)}
                className={currentPage === number ? "active" : ""}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </Popup>
    </span>
  );
};

export default PopupComponent;
