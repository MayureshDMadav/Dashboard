"use client";
import React, { useEffect, useState } from "react";
import style from "./upload.module.css";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { MdCloudUpload } from "react-icons/md";
import { createNewMerchant } from "@/backend/query";
import Loading from "@/app/dashboard/loading";
import { convertExcelDate } from "@/backend/backendservice";

const UploadMerchants = () => {
  const [typeError, setTypeError] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [entriesPerPage] = useState(5);
  const[count,setCount]  = useState(0)

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

  const pushDataToDataBase = (e) => {
    e.preventDefault();
    setLoading(true);
    setCount(excelData.length - 1)
    excelData.forEach(async (data) => {
      data.kickoff = await convertExcelDate(data.kickoff).then((data) => data);
      data.livedate = await convertExcelDate(data.livedate).then(
        (data) => data
      );
      data.targetgolive = await convertExcelDate(data.targetgolive).then(
        (data) => data
      );
      const dataFromAPi = await createNewMerchant(data);
      if (dataFromAPi.status === 201) {
        excelData.shift();
        setCount(excelData.length)
      }

      if (excelData.length === 0) {
        toast.success("Data Succesfully Uploaded", {
          duration: 4000,
          position: "top-right",
        });
        setLoading(false);
        setExcelData([]);
        setExcelFile(null);
      }
    });
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
        {loading && (
          <Loading
            message={`Date Uploading complete for ${count}`}
          />
        )}
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
              ? "Awaiting File to Uplaod"
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
