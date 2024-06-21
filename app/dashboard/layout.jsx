import React, { Suspense } from "react";
import SideBar from "../ui/dashboard/sidebar/sidebar";
import Navbar from "../ui/dashboard/navbar/navbar";
import styles from "../ui/dashboard/dashboard.module.css";
import Footer from "../ui/dashboard/footer/footer";
import Loading from "./loading";

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <SideBar />
      </div>
      <div className={styles.content}>
        <Navbar />
        <Suspense fallback={<Loading message={"Loading Data"} />}>
          {children}
        </Suspense>
        
      </div>
    </div>
  );
};

export default Layout;
