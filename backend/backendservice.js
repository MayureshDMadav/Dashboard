"use server";

import { format } from "date-fns";

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
  const filteredData = merchantData?.filter((data) => data.livedate !== "NA");
  const smbData = filteredData.filter((data) => data.category === "SMB");
  const entData = filteredData.filter((data) => data.category === "ENT");
  const emergingData = filteredData.filter(
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
export const sortArray = (arr1, arr2) => {
  const joinedArray = arr1?.concat(arr2);
  const soretedArray = joinedArray?.sort((a, b) => {
    const dateA = new Date(a.kickoff);
    const dateB = new Date(b.kickoff);
    return  dateA - dateB;
  });
  return soretedArray;
};
