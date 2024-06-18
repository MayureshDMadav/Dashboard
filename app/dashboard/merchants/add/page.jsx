"use client";
// import { addProduct } from "@/app/lib/actions";
import styles from "@/app/ui/dashboard/merchants/addmerchant/addmerchant.module.css";
import { useEffect, useState } from "react";
import { createNewMerchant, getAllUserData } from "@/backend/query.js";
import toast from "react-hot-toast";
import MerchantForm from "@/app/ui/dashboard/merchants/merchantForm";

const AddNewMerchant = () => {
  const [data, setData] = useState({});
  const [setUser, getUserData] = useState({});
  const getFormData = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const allUserData = async () => {
      const { status, userData } = await getAllUserData();
      if (status === 200) {
        getUserData(userData);
      }
    };
    allUserData();
  }, [setUser.length > 0]);

  const pushFormData = async (e) => {
    e.preventDefault();
    try {
      const response = await createNewMerchant(data);
      if (response.status === 201) {
        toast.success("Form Submitted Successfully", { position: "top-right" });
        setTimeout(() => {
          window.location.replace("/dashboard/merchants");
        }, 1500);
      } else {
        toast.error("Error While Processing Your request", {
          position: "top-right",
          style: { color: "red" },
        });
      }
    } catch (e) {}
  };

  return (
    <div className={styles.container} onSubmit={pushFormData}>
      <MerchantForm styles={styles} merchantData={""} mode={"add"} />
    </div>
  );
};

export default AddNewMerchant;
