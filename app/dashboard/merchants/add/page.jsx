"use client";
import styles from "@/app/ui/dashboard/merchants/addmerchant/addmerchant.module.css";
import { useEffect, useState } from "react";
import { createNewMerchant, getAllUserData } from "@/backend/query.js";
import toast from "react-hot-toast";
import MerchantForm from "@/app/ui/dashboard/merchants/merchantForm";

const AddNewMerchant = () => {
  return (
    <div className={styles.container}>
      <MerchantForm styles={styles} merchantData={null} mode="add" />
    </div>
  );
};

export default AddNewMerchant;
