"use client";
import React, { useEffect, useState } from "react";
import style from "./upload.module.css";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { MdCloudUpload } from "react-icons/md";
import { createNewMerchant } from "@/backend/query";
import Loading from "@/app/dashboard/loading";
import {
  convertExcelDate,
  convertExcelDateTimeToISO,
} from "@/backend/backendservice";

const UploadMerchants = ({ userData, currentUser }) => {
  const [typeError, setTypeError] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [entriesPerPage] = useState(5);
  const [userId, setUserId] = useState(null);
  const [count, setCount] = useState(0);

  const handleFileUpload = (event, mode) => {
    if (mode == "uploadData") {
      const files = event?.target?.files[0];
      const typeOfFiles = [
        "application/vnd.ms-excel",
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      const typeMatched = typeOfFiles?.includes(files.type);
      if (typeMatched) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(files);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
          setTypeError(false);
        };
      } else {
        setTypeError(true);
        toast.error("Unsupported File format", { position: "top-right" });
      }
    }
    if (mode == "removeData") {
      setExcelData([]);
      setExcelFile(null);
    }
  };

  const selectValueChange = (e) => {
    setUserId(e.target.value);
  };

  const pushDataToDataBase = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const processedData = excelData.map(async (data) => {
        data.checkouttype = data.checkouttype.toLowerCase().trim();
        data.platform = data.platform.toLowerCase().trim();
        data.mqm = data.mqm.toLowerCase().trim() === "yes" ? true : false;

        data.kickoff !== "NA"
          ? (data.kickoff = await convertExcelDateTimeToISO(data.kickoff).then(
              (data) => data
            ))
          : "";
        data.livedate !== "NA"
          ? (data.livedate = await convertExcelDateTimeToISO(
              data.livedate
            ).then((data) => data))
          : "";
        data.targetgolive !== "NA"
          ? (data.targetgolive = await convertExcelDateTimeToISO(
              data.targetgolive
            ).then((data) => data))
          : "";

        data.bookedarr = data.bookedarr.toString();
        data.expectedarr = data.expectedarr.toString();
        data.gmv = data.gmv.toString();
        const userid = userId
          ? Number.parseInt(userId)
          : Number.parseInt(currentUser.id);

        return await createNewMerchant(data, userid);
      });

      const results = await Promise.all(processedData);

      const successfulUploads = results.filter(
        (result) => result.status === 201
      ).length;

      setCount(successfulUploads);
      setExcelData([]);
      setExcelFile(null);

      toast.success(`${successfulUploads} items successfully uploaded`, {
        duration: 4000,
        position: "top-right",
      });
    } catch (error) {
      console.error("Error uploading data:", error);
      toast.error("An error occurred while uploading data", {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    try {
      e.preventDefault();
      if (excelFile !== null) {
        const workbook = XLSX.read(excelFile, { type: "buffer" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        setExcelData(data);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = excelData.slice(indexOfFirstEntry, indexOfLastEntry);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className={style.container}>
        {currentUser.isAdmin && (
          <span className={style.selectEngineer}>
            <h5> Select an Engineer :</h5>
            <select name="id" onChange={selectValueChange}>
              <option
                key={currentUser.id}
                className={style.option}
                value={currentUser.id}
              >
                Upload Data for CE
              </option>
              {userData.length > 0 &&
                userData.map((data) => (
                  <option
                    key={data.id}
                    className={style.option}
                    value={data.id}
                  >
                    {data.username}
                  </option>
                ))}
            </select>
          </span>
        )}
        <div className={style.fileUpload}>
          {excelData.length > 0 ? (
            <button
              id="file-upload"
              className={style.fileInput}
              onClick={(e) => handleFileUpload(e, "removeData")}
            >
              Remove Data
            </button>
          ) : (
            <input
              type="file"
              id="file-upload"
              className={style.fileInput}
              onChange={(e) => handleFileUpload(e, "uploadData")}
            />
          )}
          <label htmlFor="file-upload" className={style.fileLabel}>
            <span className={style.fileText}>
              {excelData.length > 0
                ? "Remove Old Upload"
                : "Choose File to Upload"}
            </span>
            <span className={style.fileIcon}>&#128451;</span>
          </label>
          {typeError && (
            <sub className={style.errorMessage}>
              Supported files: .csv, .xls, .xlsx
            </sub>
          )}
        </div>
        <button
          disabled={excelFile == null || excelData.length > 0}
          className={style.submitButton}
          onClick={handleSubmit}
        >
          Upload Data
        </button>
      </div>
      <div className={style.view}>
        {loading && <Loading message={`Data Uploading in progress...`} />}
        {!loading && excelData.length > 0 ? (
          <>
            <button onClick={pushDataToDataBase} className={style.submitButton}>
              {" "}
              <MdCloudUpload
                style={{
                  marginBottom: "-8px",
                  marginRight: "5px",
                  fontSize: "25px",
                }}
              />{" "}
              Click Here To Upload
            </button>
            <div className={style.tableResponsive}>
              <table className={style.table}>
                <thead>
                  <tr>
                    {Object.keys(excelData[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentEntries.map((individualExcelData, index) => (
                    <tr key={index}>
                      {Object.keys(individualExcelData).map((key) => (
                        <td key={key}>{individualExcelData[key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={style.pagination}>
                {Array.from(
                  { length: Math.ceil(excelData.length / entriesPerPage) },
                  (_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={currentPage === i + 1 ? style.activePage : ""}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </div>
            </div>
          </>
        ) : (
          <p>
            {excelFile == null
              ? "Awaiting File to Upload"
              : excelData.length == 0
              ? "Please click on Upload and verify your data"
              : ""}
          </p>
        )}
      </div>
    </>
  );
};

export default UploadMerchants;
