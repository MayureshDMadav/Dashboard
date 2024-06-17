"use client";

import { updateMerchantByID } from "@/backend/query";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const UpdateForm = ({ styles, merchantData }) => {
  const merchant =
    merchantData && merchantData.length > 0 ? merchantData[0] : {};
  const router = useRouter()

  const updateMerchantData = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formEnteries = Object.fromEntries(formData.entries());
    Object.keys(formEnteries).forEach(
      (key) =>
        (formEnteries[key] === "" || undefined) && delete formEnteries[key]
    );
    const updateUserInDataBase = await updateMerchantByID(merchant.id, formEnteries);
    if (updateUserInDataBase.status === 200) {
      toast.success(updateUserInDataBase.description, {
        position: "top-right",
      });
      router.push("/dashboard/merchants");
    } else {
      toast.error(updateUserInDataBase.description, { position: "top-right" });
    }
  };

  useEffect(() => {
    if (merchantData && merchantData.length > 0) {
      const data = merchantData[0];
      Object.keys(data).forEach((key) => {
        const element = document.getElementsByName(key)[0];
        if (element) {
          if (element.type === "datetime-local") {
            const date = new Date(data[key]);
            const formattedDate = date.toISOString().slice(0, 16);
            element.value = formattedDate;
          } else if (element.tagName === "SELECT") {
            element.value = data[key];
          } else if (element.tagName === "TEXTAREA") {
            element.value = data[key];
          } else {
            element.value = data[key];
          }
        }
      });
    }
  }, [merchantData]);

  return (
    <form className={styles.form} onSubmit={updateMerchantData}>
      <input
        type="text"
        placeholder={merchant.cename || "customer engineer name"}
        name="cename"
        disabled
        required
      />
      <input
        type="text"
        placeholder={merchant.merchantname || "merchantname"}
        name="merchantname"
        required
      />
      <input
        type="text"
        placeholder={merchant.merchantwebsite || "merchantwebsite"}
        name="merchantwebsite"
        required
      />
      <input
        type="email"
        placeholder={merchant.email || "email"}
        name="email"
        required
      />
      <input type="datetime-local" id="kickoff" name="kickoff" />
      <input type="datetime-local" id="targetGoLive" name="targetgolive" />
      <select name="checkouttype" id="checkouttype">
        <option value="general">Choose a checkout type</option>
        <option value="shopify">shopify 1.0</option>
        <option value="direct">direct</option>
        <option value="plusapp">shopify app plus</option>
        <option value="nonplus">shopify non plus</option>
      </select>
      <select name="category" id="category">
        <option value="general">Choose a category</option>
        <option value="SMB">SMB</option>
        <option value="ENT">ENT</option>
        <option value="Emerging">Emerging</option>
      </select>
      <select name="golivecommit" id="golivecommit">
        <option value="general">Go live commit</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select name="merchantstate" id="merchantstate">
        <option value="general">Select Merchant State</option>
        <option value="enach-pending">Enach Pending</option>
        <option value="qcinprogres">QC in progress</option>
        <option value="live">Live</option>
      </select>
      <select name="platform" id="platform">
        <option value="general">Select Platform</option>
        <option value="shopifyplus">Shopify plus</option>
        <option value="shopifyplusnonplus">Shopify Non Plus</option>
        <option value="oldcheckout">Checkout 1.0</option>
      </select>
      <input
        type="number"
        placeholder={merchant.age || "Enter Age"}
        name="age"
        required
      />
      <textarea
        required
        name="mintcomment"
        id="mintcomment"
        rows="3"
        placeholder={merchant.mintcomment || "mintcomment"}
      ></textarea>
      <textarea
        required
        name="opscomment"
        id="opscomment"
        rows="3"
        placeholder={merchant.opscomment || "opscomment"}
      ></textarea>

      <button type="submit">Update Merchant</button>
    </form>
  );
};

export default UpdateForm;
