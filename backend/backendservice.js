"use server";

import { addDays, addMilliseconds, format } from "date-fns";

export const convertExcelDate = (excelDate) => {
  const excelEpoch = new Date(1899, 11, 30);
  if (excelDate.toString() === "NA") {
    return "";
  }
  if (excelDate) {
    const days = Math.floor(excelDate);
    const fraction = excelDate - days;
    let date = addDays(excelEpoch, days - 1);
    date = addMilliseconds(date, Math.round(fraction * 24 * 60 * 60 * 1000));
    return format(date, "yyyy-MM-dd HH:mm:ss.SSS");
  }
};
