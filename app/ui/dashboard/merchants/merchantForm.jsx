"use client";

import {
  getAllUserData,
  createNewMerchant,
  updateMerchantByID,
} from "@/backend/query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const MerchantForm = ({ styles, merchantData, mode }) => {
  const [setUser, getUserData] = useState({});
  const [formData, setFormData] = useState(merchantData ? merchantData[0] : {});

  useEffect(() => {
    const allUserData = async () => {
      const { status, userData } = await getAllUserData();
      if (status === 200) {
        getUserData(userData);
      }
    };
    allUserData();
  }, [setUser.length > 0]);

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
            element.placeholder = data[key];
          } else {
            element.placeholder = data[key];
          }
        }
      });
    }
  }, [merchantData?.length > 0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formEntries = Object.fromEntries(new FormData(e.target).entries());

    if (mode === "add") {
      const response = await createNewMerchant(formEntries);
      if (response.status === 201) {
        toast.success("Form Submitted Successfully", { position: "top-right" });
        setTimeout(() => {
          window.location.replace("/dashboard/merchants");
        }, 500);
      } else {
        toast.error("Error While Processing Your request", {
          position: "top-right",
          style: { color: "red" },
        });
      }
    } else {
      Object.keys(formEntries).forEach(
        (key) =>
          (formEntries[key] === "" || undefined) && delete formEntries[key]
      );

      const updateUserInDataBase = await updateMerchantByID(
        merchantData[0].id,
        formEntries
      );
      if (updateUserInDataBase.status === 200) {
        toast.success(updateUserInDataBase.description, {
          position: "top-right",
        });
        setTimeout(() => {
          window.location.replace("/dashboard/merchants");
        }, 500);
      } else {
        toast.error(updateUserInDataBase.description, {
          position: "top-right",
        });
      }
    }
  };

  useEffect(() => {
    if (merchantData && merchantData.length > 0) {
      setFormData(merchantData[0]);
    }
  }, [merchantData]);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>CE Name</label>
      <select name="cename" id="cename">
        <option value="">
          {formData.cename
            ? "Change Customer engineer"
            : "Select a Customer Engineer"}
        </option>
        {setUser.length > 0 &&
          setUser.map((data) => (
            <option key={data.username} value={data.username}>
              {data.username}
            </option>
          ))}
      </select>
      <label>Merchant Name</label>
      <input
        type="text"
        placeholder={formData.merchantname || "merchantname"}
        name="merchantname"
        required={mode == ""}
      />
      <label>Merchant Website</label>
      <input
        type="text"
        placeholder={formData.merchantwebsite || "merchantwebsite"}
        name="merchantwebsite"
        required={mode == "add"}
      />
      <label>Email</label>
      <input
        type="email"
        placeholder={formData.email || "email"}
        name="email"
        required={mode == "add"}
      />
      <label>Kick Off Date</label>
      <input type="datetime-local" id="kickoff" name="kickoff" />
      <label>Target Go Live</label>
      <input type="datetime-local" id="targetGoLive" name="targetgolive" />
      <label>Go-Live Date</label>
      <input type="datetime-local" id="livedate" name="livedate" />
      <label>Booked Arr</label>
      <input
        type="text"
        name="bookedarr"
        placeholder={formData.bookedarr || "enter booked arr"}
      />
      <label>Expected Arr</label>
      <input
        type="text"
        name="expectedarr"
        placeholder={formData.expectedarr || "enter expected arr"}
      />
      <label>GMV</label>
      <input type="text" name="gmv" placeholder={formData.gmv || "enter GMV"} />
      <label>CSM</label>
      <input
        type="text"
        name="ms"
        placeholder={formData.ms || "enter ms team member name"}
      />
      <label>Sales Rep</label>
      <input
        type="text"
        name="salesrep"
        placeholder={formData.salesrep || "enter sales representative"}
      />
      <label>Checkout Type</label>
      <select name="checkouttype" id="checkouttype">
        <option value="general">Choose a checkout type</option>
        <option value="shopify">shopify 1.0</option>
        <option value="direct">direct</option>
        <option value="plusapp">shopify app plus</option>
        <option value="nonplus">shopify non plus</option>
      </select>
      <label>Category</label>
      <select name="category" id="category">
        <option value="general">Choose a category</option>
        <option value="SMB">SMB</option>
        <option value="ENT">ENT</option>
        <option value="Emerging">Emerging</option>
      </select>
      <label>Go Live Commit</label>
      <select name="golivecommit" id="golivecommit">
        <option value="general">Go live commit</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <label>Merchant Status</label>
      <select name="merchantstate" id="merchantstate">
        <option value="general">Select Merchant State</option>
        <option value="enach-pending">Enach Pending</option>
        <option value="qcinprogres">QC in progress</option>
        <option value="live">Live</option>
      </select>
      <label>Platform</label>
      <select name="platform" id="platform">
        <option value="general">Select Platform</option>
        <option value="shopifyplus">Shopify plus</option>
        <option value="shopifyplusnonplus">Shopify Non Plus</option>
        <option value="oldcheckout">Checkout 1.0</option>
      </select>
      <input
        type="hidden"
        value={1}
        placeholder="Enter Age"
        name="age"
        required={mode == "add"}
      />
      <label>Mint Comment</label>
      <textarea
        required={mode == "add"}
        name="mintcomment"
        id="mintcomment"
        rows="3"
        placeholder="mintcomment"
      ></textarea>
      <label>Operations Comment</label>
      <textarea
        required={mode == "add"}
        name="opscomment"
        id="opscomment"
        rows="3"
        placeholder="opscomment"
      ></textarea>
      <button type="submit">
        {mode === "add" ? "Add Merchant" : "Update Merchant"}
      </button>
    </form>
  );
};

export default MerchantForm;
