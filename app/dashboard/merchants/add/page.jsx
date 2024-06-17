"use client";
// import { addProduct } from "@/app/lib/actions";
import styles from "@/app/ui/dashboard/merchants/addmerchant/addmerchant.module.css";
import { useEffect, useState } from "react";
import { createNewMerchant, getAllUserData } from "@/backend/query.js";
import toast from "react-hot-toast";

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
      if(status === 200){
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
      <form className={styles.form}>
        {setUser.length < 0 && (
          <input
            type="text"
            placeholder="customer engineer name"
            name="cename"
            required
            onChange={getFormData}
          />
        )}
        <select name="cename" id="cename" onChange={getFormData}>
        <option value="NA">Select a customer engineer</option>
          {setUser.length > 0 &&
            setUser.map((data) => (
              <option value={data.username}>{data.username}</option>
            ))}
        </select>
        <input
          type="text"
          placeholder="merchantname"
          name="merchantname"
          required
          onChange={getFormData}
        />
        <input
          type="text"
          placeholder="merchantwebsite"
          name="merchantwebsite"
          required
          onChange={getFormData}
        />
        <input
          type="email"
          placeholder="email"
          name="email"
          required
          onChange={getFormData}
        />
        <input
          type="datetime-local"
          id="kickoff"
          name="kickoff"
          onChange={getFormData}
        />
        <input
          type="datetime-local"
          id="targetGoLive"
          name="targetgolive"
          onChange={getFormData}
        />
        <select name="checkouttype" id="checkouttype" onChange={getFormData}>
          <option value="general">Choose a checkout type</option>
          <option value="shopify">shopify 1.0</option>
          <option value="direct">direct</option>
          <option value="plusapp">shopify app plus</option>
          <option value="nonplus">shopify non plus</option>
        </select>
        <select name="category" id="category" onChange={getFormData}>
          <option value="general">Choose a category</option>
          <option value="SMB">SMB</option>
          <option value="ENT">ENT</option>
          <option value="Emerging">Emerging</option>
        </select>
        <select name="golivecommit" id="golivecommit" onChange={getFormData}>
          <option value="general">Go live commit</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select name="merchantstate" id="merchantstate" onChange={getFormData}>
          <option value="general">Select Merchant State</option>
          <option value="enach-pending">Enach Pending</option>
          <option value="qcinprogres">QC in progress</option>
          <option value="live">Live</option>
        </select>
        <select name="platform" id="platform" onChange={getFormData}>
          <option value="general">Select Platform</option>
          <option value="shopifyplus">Shopify plus</option>
          <option value="shopifyplusnonplus">Shopify Non Plus</option>
          <option value="oldcheckout">Checkout 1.0</option>
        </select>
        <input
          type="number"
          placeholder="Enter Age"
          name="age"
          required
          onChange={getFormData}
        />
        <textarea
          required
          name="mintcomment"
          id="mintcomment"
          rows="3"
          placeholder="mintcomment"
          onChange={getFormData}
        ></textarea>
        <textarea
          required
          name="opscomment"
          id="opscomment"
          rows="3"
          placeholder="opscomment"
          onChange={getFormData}
        ></textarea>

        <button type="submit">Add New Merchant</button>
      </form>
    </div>
  );
};

export default AddNewMerchant;
