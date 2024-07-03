"use client";
import {
  additionalApiRequest,
  deleteAdditionalDetails,
  fetchAdditionalDetailRequest,
} from "@/backend/query";
import styles from "./customize.module.css";
import { GrAdd } from "react-icons/gr";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { MdOutlineDelete } from "react-icons/md";

const CustomizeOption = () => {
  const [data, setData] = useState({
    category: null,
    platform: null,
    checkouttype: null,
    merchantstate: null,
  });
  const handleSubmit = async (e, mode) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fromEntries = Object.fromEntries(formData.entries());
    const { status, description } = await additionalApiRequest(
      fromEntries,
      mode
    );
    if (status === 200) {
      toast.success(description, { position: "top-right" });
      getData(mode);
    }

    if (status !== 200) {
      toast.error(description, { position: "top-right" });
    }
  };

  const getData = async (mode) => {
    try {
      const fetchedData = await fetchAdditionalDetailRequest(mode);
      setData((prevData) => ({ ...prevData, [mode]: fetchedData.response }));
    } catch (error) {
      console.error(`Error fetching ${mode} data:`, error);
    }
  };

  const deleteData = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fromEntries = Object.fromEntries(formData.entries());
    const { status ,description} = await deleteAdditionalDetails(
      fromEntries.mode,
      fromEntries.id
    );
    if (status === 200) {
      toast.success(description, { position: "top-right" });
      getData(fromEntries.mode);
    }

    if (status !== 200) {
      toast.error(description, { position: "top-right" });
    }

  };

  useEffect(() => {
    getData("category");
    getData("platform");
    getData("checkouttype");
    getData("merchantstate");
  }, []);

  const renderDataList = (mode) => {
    if (!data[mode]) return "Loading...";
    return Array.isArray(data[mode]) ? (
      <span className={styles.listStyle}>
        <h4 style={{marginBottom:'12px'}} >Currently Available list</h4>
        <ul>
          {data[mode].map((item, index) => (
            <li key={index}>
              {" "}
              {`- ${item.name}`}{" "}
              <form onSubmit={deleteData}>
                <input name="id" value={item.id} type="hidden" />{" "}
                <input name="mode" value={mode} type="hidden" />{" "}
                <button className={styles.deleteForm} type="submit">
                  <MdOutlineDelete />
                </button>
              </form>{" "}
            </li>
          ))}
        </ul>
      </span>
    ) : (
      "No data available"
    );
  };

  return (
    <div className={styles.container}>
    <details>
      <summary>Add Category</summary>
      <div className={styles.element}>
        <div className={styles.gridContainer}>
          <div className={styles.gridItem}>
            <form
              className={styles.form}
              onSubmit={(e) => handleSubmit(e, "category")}
            >
              <input type="text" name="name" required />
              <button>
                Add <GrAdd />
              </button>
            </form>
          </div>
          <div className={styles.gridItem}>{renderDataList("category")}</div>
        </div>
      </div>
    </details>
    <details>
      <summary>Add Platform</summary>
      <div className={styles.element}>
        <div className={styles.gridContainer}>
          <div className={styles.gridItem}>
            <form
              className={styles.form}
              onSubmit={(e) => handleSubmit(e, "platform")}
            >
              <input type="text" name="name" required />
              <button>
                Add <GrAdd />
              </button>
            </form>
          </div>
          <div className={styles.gridItem}>{renderDataList("platform")}</div>
        </div>
      </div>
    </details>
    <details>
      <summary>Add Checkout Type</summary>
      <div className={styles.element}>
        <div className={styles.gridContainer}>
          <div className={styles.gridItem}>
            <form
              className={styles.form}
              onSubmit={(e) => handleSubmit(e, "checkouttype")}
            >
              <input type="text" name="name" required />
              <button>
                Add <GrAdd />
              </button>
            </form>
          </div>
          <div className={styles.gridItem}>{renderDataList("checkouttype")}</div>
        </div>
      </div>
    </details>
    <details>
      <summary>Add Merchant State</summary>
      <div className={styles.element}>
        <div className={styles.gridContainer}>
          <div className={styles.gridItem}>
            <form
              className={styles.form}
              onSubmit={(e) => handleSubmit(e, "merchantstate")}
            >
              <input type="text" name="name" required />
              <button>
                Add <GrAdd />
              </button>
            </form>
          </div>
          <div className={styles.gridItem}>{renderDataList("merchantstate")}</div>
        </div>
      </div>
    </details>
  </div>
  );
};

export default CustomizeOption;
