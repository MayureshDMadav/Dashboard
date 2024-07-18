"use server";

import { format } from "date-fns";

// This File is for Backend Calls

export const convertExcelDateTimeToISO = (excelDateTime) => {
  const days = Math.floor(excelDateTime);
  const milliseconds = Math.round((excelDateTime - days) * 24 * 60 * 60 * 1000);
  const excelStartDate = new Date(Date.UTC(1899, 11, 30));
  const excelDate = new Date(
    excelStartDate.getTime() + days * 24 * 60 * 60 * 1000 + milliseconds
  );
  const isoFormattedDate = format(excelDate, "yyyy-MM-dd'T'HH:mm");
  return isoFormattedDate;
};

//GO live Data
export const filterMerchantByGolive = (merchantData) => {
  const filteredData = merchantData?.filter(
    (data) => data.livedate !== "NA" && data.livedate
  );
  const smbData = filteredData?.filter((data) => data.category === "SMB");
  const entData = filteredData?.filter((data) => data.category === "ENT");
  const emergingData = filteredData?.filter(
    (data) => data.category === "Emerging"
  );

  return { smbData, entData, emergingData };
};

// This funciton is used for pending and targeted status
export const filterMerchantByPending = (merchantData) => {
  const filteredData = merchantData?.filter((data) => data.livedate === "NA");
  const smbData = filteredData?.filter((data) => data.category === "SMB");
  const entData = filteredData?.filter((data) => data.category === "ENT");
  const emergingData = filteredData?.filter(
    (data) => data.category === "Emerging"
  );
  return { smbData, entData, emergingData };
};

//To filter data on the basis of category
export const filterAllTheMerchant = (merchantData) => {
  const smbData = merchantData?.filter((data) => data.category === "SMB");
  const entData = merchantData?.filter((data) => data.category === "ENT");
  const emergingData = merchantData?.filter(
    (data) => data.category === "Emerging"
  );
  return { smbData, entData, emergingData };
};

//Join To Arrays N provide results
export const sortArray = (arr1, arr2, arr3) => {
  const joinedArray = arr1?.concat(arr2).concat(arr3);
  const soretedArray = joinedArray?.sort((a, b) => {
    const dateA = new Date(a.kickoff);
    const dateB = new Date(b.kickoff);
    return dateB - dateA;
  });
  return soretedArray;
};

export const sortSingleArray = (arr) => {
  if (arr.length > 0) {
    const soretedArray = arr?.sort((a, b) => {
      const dateA = new Date(a.kickoff);
      const dateB = new Date(b.kickoff);
      return dateB - dateA;
    });
    return soretedArray;
  }
  return null;
};

//to handle Data on the basis of array and mode passed used in table
export const uniqueDataHandlerArry = (data, mode) => {
  const platformStatsMap = new Map();

  data.forEach((merchant) => {
    const platform = merchant[mode].trim().toLowerCase();
    const expectedArr = parseFloat(merchant.expectedarr) || 0;
    if (!platformStatsMap.has(platform)) {
      platformStatsMap.set(platform, { count: 0, totalExpectedArr: 0 });
    }
    const stats = platformStatsMap.get(platform);
    stats.count += 1;
    stats.totalExpectedArr += expectedArr;
  });

  const platformStats = Array.from(
    platformStatsMap,
    ([platform, { count, totalExpectedArr }]) => ({
      platform,
      merchantCount: count,
      expectedarr: totalExpectedArr.toFixed(3),
    })
  );
  return platformStats;
};

// To Parse Unique Element and get the result array
export const findUniqueElementInArray = (arr, nameOfElement) => {
  if (arr.length > 0) {
    let uniqueArray = new Set();
    arr.forEach((data) => {
      uniqueArray.add(data[nameOfElement]);
    });
    return Array.from(uniqueArray);
  }
  return null;
};
