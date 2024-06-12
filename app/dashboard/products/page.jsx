import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "@/app/ui/dashboard/products/products.module.css";
import Search from "@/app/ui/dashboard/search/search";

const Products = () => {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for a user..." />
        <Link href="/dashboard/products/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Title</td>
            <td>Description</td>
            <td>Price</td>
            <td>Created At</td>
            <td>Stock</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className={styles.product}>
                <Image
                  src={"/noproduct.jpg"}
                  alt=""
                  width={40}
                  height={40}
                  className={styles.productImage}
                />
                test products
              </div>
            </td>
            <td>testing phase</td>
            <td> 22 </td>
            <td> nahipata </td>
            <td>yes</td>
            <td>
              <Link href="/dashboard/products/test">
                <button className={`${styles.button} ${styles.view}`}>
                  View
                </button>
              </Link>
              <button className={`${styles.button} ${styles.delete}`}>
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <Pagination />
    </div>
  );
};

export default Products;
