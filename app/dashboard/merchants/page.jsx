import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "@/app/ui/dashboard/merchants/merchants.module.css";
import Search from "@/app/ui/dashboard/search/search";
import {
  deletEntryForMerchant,
  paginationForMerchantList,
} from "@/backend/query";

const MerchantDataList = async ({ searchParams }) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const { count, merchantData } = await paginationForMerchantList(q, page);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for a user..." />
        <Link href="/dashboard/merchants/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Merchant Name</td>
            <td>Assigned CE</td>
            <td>Category</td>
            <td>Platform</td>
            <td>Website</td>
            <td>KickOff Date</td>
            <td>Age</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {merchantData &&
            merchantData.map((data) => (
              <tr key={data.id}>
                <td>
                  <div className={styles.product}>
                    <Image
                      src={"/noproduct.jpg"}
                      alt=""
                      width={40}
                      height={40}
                      className={styles.productImage}
                    />
                    {data.merchantname}
                  </div>
                </td>
                <td>{data.cename}</td>
                <td>{data.category}</td>
                <td>{data.platform} </td>
                <td>{data.merchantwebsite}</td>
                <td>{data.kickoff.split("T")[0]}</td>
                <td>{data.age + " days"} </td>
                <td style={{ display: "flex", gap: "6px" }}>
                  <Link href={`/dashboard/merchants/${data.id}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                  <form action={deletEntryForMerchant}>
                    <input type="hidden" name="id" value={data.id} />
                    <button className={`${styles.button} ${styles.delete}`}>
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
};

export default MerchantDataList;
