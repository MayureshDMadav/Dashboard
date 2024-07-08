"use client";
import React, { useEffect, useState } from "react";
import styles from "./calendar.module.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const CalendarInput = ({mode}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const [currentMode , setMode] = useState(null)

  useEffect(()=>{
    if(mode){
      setMode(mode)
    }
  },[mode])


  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    setCustomStartDate("");
    setCustomEndDate("");

    switch (selectedValue) {
      case "lastSevenDays":
        handleDateRangeSelection(getLastSevenDaysRange());
        break;
      case "lastMonth":
        handleDateRangeSelection(getLastMonthRange());
        break;
      case "currentMonth":
        handleDateRangeSelection(getCurrentMonthRange());
        break;
      case "lastWeek":
        handleDateRangeSelection(getLastWeekRange());
        break;
      case "currentWeek":
        handleDateRangeSelection(getCurrentWeekRange());
        break;
      case "custom":
        break;
      default:
        break;
    }
  };

  const handleCustomStartDateChange = (event) => {
    setCustomStartDate(event.target.value);
    handleDateRangeSelection([event.target.value, customEndDate]);
  };

  const handleCustomEndDateChange = (event) => {
    setCustomEndDate(event.target.value);
    handleDateRangeSelection([customStartDate, event.target.value]);
  };

  const handleDateRangeSelection = (dateRange) => {
    const startDate = dateRange[0];
    const endDate = dateRange[1];
    const params = new URLSearchParams(searchParams);
    if (startDate && endDate) {
      params.set("start", startDate);
      params.set("endDate", endDate);
      params.set("mode", `${!currentMode ? "kickoff" :currentMode }`);
      replace(`${pathname}?${params}`);
    }
  };

  const getLastSevenDaysRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    return [
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0],
    ];
  };

  const getLastMonthRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    startDate.setDate(1);
    return [
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0],
    ];
  };

  const getCurrentMonthRange = () => {
    const endDate = new Date();
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1); 
    return [
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0],
    ];
  };

  const getLastWeekRange = () => {
    const endDate = new Date(); // Today
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // One week ago
    return [
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0],
    ];
  };

  const getCurrentWeekRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() - 6);
    return [
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0],
    ];
  };

  return (
    <div className={styles.calendarinput}>
      <select
        value={selectedOption}
        onChange={handleSelectChange}
        id="calendar-select"
        className={styles.calendarselect}
      >
        <option value="">Select a Date Range</option>
        <option value="lastSevenDays">Last Seven Days</option>
        <option value="lastMonth">Last Month</option>
        <option value="currentMonth">Current Month</option>
        <option value="lastWeek">Last Week</option>
        <option value="currentWeek">Current Week</option>
        <option value="custom">Custom</option>
      </select>
      {selectedOption === "custom" && (
        <>
          <input
            type="date"
            id="custom-start-date"
            className={styles.custominput}
            value={customStartDate}
            placeholder="select start date"
            required={selectedOption === "custom"}
            style={
              selectedOption === "custom"
                ? { display: "inline-block" }
                : { display: "none" }
            }
            onChange={handleCustomStartDateChange}
          />
          <input
            type="date"
            id="custom-end-date"
            placeholder="select end date"
            className={styles.custominput}
            value={customEndDate}
            required={selectedOption === "custom"}
            onChange={handleCustomEndDateChange}
          />
        </>
      )}
    </div>
  );
};

export default CalendarInput;
