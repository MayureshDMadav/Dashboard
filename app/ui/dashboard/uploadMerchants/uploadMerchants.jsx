"use client";
import React, { useState, useCallback, useMemo } from "react";
import style from "./upload.module.css";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { MdCloudUpload } from "react-icons/md";
import { createNewMerchant } from "@/backend/query";
import Loading from "@/app/dashboard/loading";
import { convertExcelDateTimeToISO } from "@/backend/backendservice";

const ENTRIES_PER_PAGE = 5;
const CHUNK_SIZE = 50;

const UploadMerchants = ({ userData, currentUser }) => {
  const [typeError, setTypeError] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [count, setCount] = useState(0);

  const handleFileUpload = useCallback((event, mode) => {
    if (mode === "uploadData") {
      const file = event?.target?.files[0];
      const typeOfFiles = [
        "application/vnd.ms-excel",
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (typeOfFiles.includes(file?.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setExcelFile(e.target.result);
          setTypeError(false);
        };
        reader.readAsArrayBuffer(file);
      } else {
        setTypeError(true);
        toast.error("Unsupported File format", { position: "top-right" });
      }
    } else if (mode === "removeData") {
      setExcelData([]);
      setExcelFile(null);
    }
  }, []);

  const selectValueChange = useCallback((e) => {
    setUserId(e.target.value);
  }, []);

  const pushDataToDataBase = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const processDataChunk = async (chunk) => {
          return await Promise.all(
            chunk.map(async (data) => {
              const processedData = {
                ...data,
                checkouttype: data.checkouttype.toLowerCase().trim(),
                platform: data.platform.toLowerCase().trim(),
                mqm: data.mqm.toLowerCase().trim() === "yes",
                kickoff:
                  data.kickoff !== "NA"
                    ? await convertExcelDateTimeToISO(data.kickoff)
                    : "",
                livedate:
                  data.livedate !== "NA"
                    ? await convertExcelDateTimeToISO(data.livedate)
                    : "",
                targetgolive:
                  data.targetgolive !== "NA"
                    ? await convertExcelDateTimeToISO(data.targetgolive)
                    : "",
                bookedarr: data.bookedarr.toString(),
                expectedarr: data.expectedarr.toString(),
                gmv: data.gmv.toString(),
              };

              const userid = userId
                ? parseInt(userId)
                : parseInt(currentUser.id);
              return await createNewMerchant(processedData, userid);
            })
          );
        };

        let successfulUploads = 0;

        for (let i = 0; i < excelData.length; i += CHUNK_SIZE) {
          const chunk = excelData.slice(i, i + CHUNK_SIZE);
          const results = await processDataChunk(chunk);
          successfulUploads += results.filter(
            (result) => result.status === 201
          ).length;
        }

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
    },
    [excelData, userId, currentUser.id]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (excelFile) {
        try {
          const workbook = XLSX.read(excelFile, { type: "buffer" });
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);
          setExcelData(data);
          setCurrentPage(1);
        } catch (error) {
          console.error("Error:", error);
          toast.error("Error processing file", { position: "top-right" });
        }
      }
    },
    [excelFile]
  );

  const indexOfLastEntry = currentPage * ENTRIES_PER_PAGE;
  const indexOfFirstEntry = indexOfLastEntry - ENTRIES_PER_PAGE;
  const currentEntries = excelData.slice(indexOfFirstEntry, indexOfLastEntry);

  const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), []);

  const pageCount = useMemo(
    () => Math.ceil(excelData.length / ENTRIES_PER_PAGE),
    [excelData]
  );

  return (
    <>
      <div className={style.container}>
        {currentUser.isAdmin && (
          <span className={style.selectEngineer}>
            <h5>Select an Engineer:</h5>
            <select name="id" onChange={selectValueChange}>
              <option
                key={currentUser.id}
                className={style.option}
                value={currentUser.id}
              >
                Upload Data for CE
              </option>
              {userData.map((data) => (
                <option key={data.id} className={style.option} value={data.id}>
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
          disabled={!excelFile || excelData.length > 0}
          className={style.submitButton}
          onClick={handleSubmit}
        >
          Upload Data
        </button>
      </div>
      <div className={style.view}>
        {loading && <Loading message="Data Uploading in progress..." />}
        {!loading && excelData.length > 0 ? (
          <>
            <button onClick={pushDataToDataBase} className={style.submitButton}>
              <MdCloudUpload
                style={{
                  marginBottom: "-8px",
                  marginRight: "5px",
                  fontSize: "25px",
                }}
              />
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
                    <tr key={`row-${index}`}>
                      {Object.entries(individualExcelData).map(
                        ([key, value]) => (
                          <td key={`${index}-${key}`}>{value}</td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={style.pagination}>
                {Array.from({ length: pageCount }, (_, i) => (
                  <button
                    key={`page-${i + 1}`}
                    onClick={() => paginate(i + 1)}
                    className={currentPage === i + 1 ? style.activePage : ""}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p>
            {excelFile == null
              ? "Awaiting File to Upload"
              : excelData.length === 0
              ? "Please click on Upload and verify your data"
              : ""}
          </p>
        )}
      </div>
    </>
  );
};

export default React.memo(UploadMerchants);
