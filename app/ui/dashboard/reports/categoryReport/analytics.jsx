"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import styles from "./analytics.module.css";
import CalendarInput from "../../calendar/calendar";
import { MerchantStatusPieChart, MqmPieChart } from "../charts/piechart";
import { MerchantStatusLineChart, MqmLineChart } from "../charts/linechart";
import { MerchantStatusBarChart, MqmBarChart } from "../charts/barchart";
import {
  filterMerchantByPending,
  findUniqueElementInArray,
  uniqueDataHandlerArry,
} from "@/backend/backendservice";

const ChartComponents = {
  pie: { Mqm: MqmPieChart, MerchantStatus: MerchantStatusPieChart },
  line: { Mqm: MqmLineChart, MerchantStatus: MerchantStatusLineChart },
  bar: { Mqm: MqmBarChart, MerchantStatus: MerchantStatusBarChart },
};

const useMerchantData = (initialMerchants) => {
  const [merchantData, setMerchantData] = useState(null);
  const [segmentData, setSegmentData] = useState({ smb: [], ent: [], eme: [] });

  useEffect(() => {
    setMerchantData(initialMerchants);
  }, [initialMerchants]);

  useEffect(() => {
    if (merchantData) {
      const fetchPendingMerchants = async () => {
        const { smbData, entData, emergingData } =
          await filterMerchantByPending(merchantData);
        setSegmentData({
          smb: smbData || [],
          ent: entData || [],
          eme: emergingData || [],
        });
      };
      fetchPendingMerchants();
    }
  }, [merchantData]);

  return { merchantData, segmentData };
};

const useCalculations = (segmentData) => {
  return useMemo(() => {
    const calculateMqmCounts = (data) => ({
      Yes: data.filter((item) => item.mqm === true).length,
      No: data.filter((item) => item.mqm === false).length,
    });

    const sumOfArray = (arr, mode) => {
      return arr
        .filter((item) => item.mqm === mode)
        .reduce(
          (sum, item) =>
            sum +
            Number.parseFloat(item.expectedarr !== "NA" ? item.expectedarr : 0),
          0
        );
    };

    return {
      mqmCounts: {
        smb: calculateMqmCounts(segmentData.smb),
        ent: calculateMqmCounts(segmentData.ent),
        eme: calculateMqmCounts(segmentData.eme),
      },
      sumOfArray,
    };
  }, [segmentData]);
};

const MainAnalyticsdataViewer = ({ merchants, platform, enablePagination }) => {
  const [chart, setChart] = useState("pie");
  const { merchantData, segmentData } = useMerchantData(merchants);
  const { mqmCounts, sumOfArray } = useCalculations(segmentData);
  const [checkoutCount, setCheckoutType] = useState([]);
  const [platformData, setPlatformCount] = useState([]);
  const [category, setCategoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    async function checkoutTypeList() {
      const checkoutTypeCount = await uniqueDataHandlerArry(
        Object.values(segmentData).flat(),
        "checkouttype"
      );
      const categoryCount = await uniqueDataHandlerArry(
        Object.values(segmentData).flat(),
        "category"
      );

      const paltformCount = await uniqueDataHandlerArry(
        Object.values(segmentData).flat(),
        "platform"
      );

      setPlatformCount(paltformCount);
      setCheckoutType(checkoutTypeCount);
      setCategoryData(categoryCount);
    }

    checkoutTypeList();
  }, [segmentData]);

  const handleChartChange = useCallback((e) => {
    setChart(e.target.value);
  }, []);

  const ChartComponent = ChartComponents[chart] || {};

  const renderTable = (title, data, mqmCount) => (
    <div className={styles.tableContent}>
      <table>
        <thead>
          <tr>
            <th colSpan={3}>{title} current Queue</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>MINT Qualified</td>
            <td>#Merchant</td>
            <td>Expected Arr</td>
          </tr>
          <tr>
            <td>Yes</td>
            <td>{mqmCount.Yes}</td>
            <td>{sumOfArray(data, true)}</td>
          </tr>
          <tr>
            <td>No</td>
            <td>{mqmCount.No}</td>
            <td>{sumOfArray(data, false)}</td>
          </tr>
          <tr className={styles.total}>
            <td>Total</td>
            <td>{data.length}</td>
            <td>{sumOfArray(data, true) + sumOfArray(data, false)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderMerchantTable = (title, data) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = enablePagination
      ? data.slice(indexOfFirstItem, indexOfLastItem)
      : data;
    const totalPages = Math.ceil(data.length / itemsPerPage);

    return (
      <div className={styles.tableContent}>
        <table>
          <thead>
            <tr>
              <th colSpan={3}>{title} Merchant List</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Merchant Name</td>
              <td>MINT Qualified</td>
              <td>Expected Arr</td>
            </tr>
            {currentItems.map((item, index) => (
              <tr key={index}>
                <td>{item.merchantname}</td>
                <td>{item.mqm === true ? "Yes" : "No"}</td>
                <td>
                  {item.expectedarr === "NA"
                    ? 0
                    : Number.parseFloat(item.expectedarr).toFixed(3)}
                </td>
              </tr>
            ))}
            <tr className={styles.total}>
              <td>Total</td>
              <td>{data.length}</td>
              <td>
                {(sumOfArray(data, true) + sumOfArray(data, false)).toFixed(3)}
              </td>
            </tr>
          </tbody>
        </table>
        {enablePagination && data.length > itemsPerPage && (
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              {"<"}
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              {">"}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderCheckoutTypeTable = (title, data) => {
    const totalMerchantCount = data.reduce(
      (sum, item) => sum + item.merchantCount,
      0
    );
    const totalExpectedArr = data.reduce(
      (sum, item) => sum + parseFloat(item.expectedarr),
      0
    );

    return (
      <div className={styles.tableContent}>
        <table>
          <thead>
            <tr>
              <th colSpan={3}>{title}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Checkout Type</td>
              <td>Count</td>
              <td>Expected Arr</td>
            </tr>
            {data?.map((data) => (
              <tr>
                <td>{data.platform}</td>
                <td>{data.merchantCount}</td>
                <td>{data.expectedarr}</td>
              </tr>
            ))}

            <tr className={styles.total}>
              <td>Total</td>
              <td>{totalMerchantCount}</td>
              <td>{totalExpectedArr}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderPlatformTable = (title, data) => {
    const totalMerchantCount = data.reduce(
      (sum, item) => sum + item.merchantCount,
      0
    );
    const totalExpectedArr = data.reduce(
      (sum, item) => sum + parseFloat(item.expectedarr),
      0
    );

    return (
      <div className={styles.tableContent}>
        <table>
          <thead>
            <tr>
              <th colSpan={3}>{title}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Platform</td>
              <td>Count</td>
              <td>Expected Arr</td>
            </tr>
            {data?.map((data) => (
              <tr>
                <td>{data.platform}</td>
                <td>{data.merchantCount}</td>
                <td>{data.expectedarr}</td>
              </tr>
            ))}

            <tr className={styles.total}>
              <td>Total</td>
              <td>{totalMerchantCount}</td>
              <td>{totalExpectedArr}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderCategoryType = (title, data) => {
    const totalMerchantCount = data.reduce(
      (sum, item) => sum + item.merchantCount,
      0
    );
    const totalExpectedArr = data.reduce(
      (sum, item) => sum + parseFloat(item.expectedarr),
      0
    );

    return (
      <div className={styles.tableContent}>
        <table>
          <thead>
            <tr>
              <th colSpan={3}>{title}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Category</td>
              <td>Count</td>
              <td>Expected Arr</td>
            </tr>
            {data?.map((data) => (
              <tr>
                <td>{data.platform}</td>
                <td>{data.merchantCount}</td>
                <td>{data.expectedarr}</td>
              </tr>
            ))}

            <tr className={styles.total}>
              <td>Total</td>
              <td>{totalMerchantCount}</td>
              <td>{totalExpectedArr}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.childElement}>
        <div className={styles.header}>
          <div className={styles.headElement}>
            <CalendarInput />
          </div>
          <div className={styles.headElement}>Preview Button</div>
        </div>
      </div>
      <div className={styles.childElement}>
        <div className={styles.chartSelect}>
          <select onChange={handleChartChange} value={chart}>
            <option value="pie">Pie Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
          </select>
        </div>
        <div className={styles.chartContainer}>
          <div className={styles.chart}>
            {ChartComponent.Mqm && (
              <ChartComponent.Mqm data={Object.values(segmentData).flat()} />
            )}
          </div>
          <div className={styles.chart}>
            {ChartComponent.MerchantStatus && (
              <ChartComponent.MerchantStatus data={merchantData || []} />
            )}
          </div>
        </div>
      </div>
      <div className={styles.childElement}>
        <div className={styles.headLine}>
          <h3>Merchants In Queue</h3>
        </div>
        {platform === "shopify" && (
          <div className={styles.tableContainer}>
            {renderTable("SMB", segmentData.smb, mqmCounts.smb)}
            {renderTable("ENT", segmentData.ent, mqmCounts.ent)}
            {renderTable("EMERGING", segmentData.eme, mqmCounts.eme)}
          </div>
        )}
      </div>
      <div className={styles.childElement}>
        <div className={styles.tableContainer}>
          {renderMerchantTable("Current", Object.values(segmentData).flat())}
          {platform === "shopify" &&
            renderCheckoutTypeTable("Checkout Type", checkoutCount)}
          {platform === "nonshopify" &&
            renderPlatformTable("Platform", platformData)}
          {renderCategoryType("Cateogry", category)}
        </div>
      </div>
    </div>
  );
};

export default MainAnalyticsdataViewer;
