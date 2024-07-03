"use client";

import {
  getAllUserData,
  createNewMerchant,
  updateMerchantByID,
  getUserByUserName,
  fetchAdditionalDetailRequest,
} from "@/backend/query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { parse, format } from "date-fns";

const MerchantForm = ({
  styles,
  merchantData,
  mode,
  isAdmin,
  userName,
  userId,
}) => {
  const [setUser, getUserData] = useState({});
  const [formData, setFormData] = useState(merchantData ? merchantData : {});
  const [data, setData] = useState({
    category: null,
    platform: null,
    checkouttype: null,
    merchantstate: null,
  });
  const router = useRouter();
  const getData = async (mode) => {
    try {
      const fetchedData = await fetchAdditionalDetailRequest(mode);
      setData((prevData) => ({ ...prevData, [mode]: fetchedData.response }));
    } catch (error) {
      console.error(`Error fetching ${mode} data:`, error);
    }
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

  useEffect(() => {
    if (formData) {
      const data = formData ? formData : "";
      Object.keys(data).forEach((key) => {
        const element = document.getElementsByName(key)[0];
        if (element) {
          if (element.type === "datetime-local") {
            if (data[key] !== "NA" && data[key] !== "") {
              const parsedDate = new Date(data[key]);
              const formattedDate = format(parsedDate, "yyyy-MM-dd'T'HH:mm");
              element.value = formattedDate;
            }
          } else if (element.tagName === "SELECT") {
            element.value = data[key];
          } else if (element.tagName === "TEXTAREA") {
            element.placeholder = data[key];
          }
        }
      });
    }
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formEntries = Object.fromEntries(new FormData(e.target).entries());
    formEntries.mqm = formEntries.mqm === "true" ? true : false;
    formEntries.age = formEntries.age ? Number.parseInt(formEntries.age) : 0;
    formEntries.txn = formEntries.txn ? Number.parseInt(formEntries.txn) : 0;

    if (mode === "add") {
      const { description, status } = await createNewMerchant(
        formEntries,
        userId
      );
      if (status === 201) {
        toast.success(description, { position: "top-right" });

        router.push("/dashboard/merchants");
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
        formData.id,
        formEntries
      );
      if (updateUserInDataBase.status === 200) {
        toast.success(updateUserInDataBase.description, {
          position: "top-right",
        });
        router.push("/dashboard/merchants");
      } else {
        toast.error(updateUserInDataBase.description, {
          position: "top-right",
        });
      }
    }
  };

  const renderDataList = (mode) => {
    if (!data[mode]) return "Loading...";

    return Array.isArray(data[mode]) ? (
      <select name={mode} id={mode}>
        <option value="general">Choose an option</option>
        {data[mode].map((item, index) => (
          <option key={index} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
    ) : (
      <select name={mode} id={mode}>
        <option value="dataNotFound">No Data have Been Uploaded yet</option>
      </select>
    );
  };

  useEffect(() => {
    if (merchantData && merchantData.length > 0) {
      setFormData(merchantData);
    }
  }, [merchantData]);

  useEffect(() => {
    getData("category");
    getData("platform");
    getData("checkouttype");
    getData("merchantstate");
  }, []);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {isAdmin && (
        <span>
          <label>CE Name</label>
          <select name="cename" id="cename">
            <option value="">
              {formData && formData.cename
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
        </span>
      )}
      {!isAdmin && <input type="hidden" name="cename" value={userName} />}
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
      <label>AB Experiment</label>
      <input
        type="text"
        name="abpercentage"
        placeholder={formData.abpercentage || "enter expected arr"}
      />

      <label>GMV</label>
      <input
        type="text"
        step="0.01"
        name="gmv"
        placeholder={formData.gmv || "enter GMV"}
      />
      <label>CSM</label>
      <input
        type="text"
        name="ms"
        placeholder={formData.ms || "enter ms team member name"}
      />
      <label>Transaction</label>
      <input
        type="text"
        name="txn"
        placeholder={formData.txn || "enter ms team member name"}
      />
      <label>Sales Rep</label>
      <input
        type="text"
        name="salesrep"
        placeholder={formData.salesrep || "enter sales representative"}
      />
      <label>Checkout Type</label>
      {renderDataList("checkouttype")}
      <label>Category</label>
      {renderDataList("category")}
      <label>is Merchant Qualified?</label>
      <select name="mqm" id="mqm">
        <option value="general">Default</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
      <label>Merchant Status</label>

      {renderDataList("merchantstate")}

      <label>Platform</label>
      {renderDataList("platform")}
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
