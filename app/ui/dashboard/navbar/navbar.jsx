"use client";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./navbar.module.css";
import { MdSearch } from "react-icons/md";
import { useRouter } from "next/navigation";
import CalendarInput from "../calendar/calendar";
import { useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const [mode,setMode] = useState(null)
  const actualPath = pathname.split("/").pop();
  const router = useRouter()

  const handleSubmit = (e) => {
    setMode(e.target.value)
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{decodeURI(pathname.split("/").pop())}</div>
      <div className={styles.menu}>
        {actualPath === "dashboard" && (
          <div className={styles.selectContainer}>
            <div className={styles.selectChild}>
              <select onChange={handleSubmit}>
                <option value="">Select a State</option>
                <option value="kickoff">By Kickoff</option>
                <option value="livedate">By LiveDate</option>
                <option value="targetgolive">By Targeted Date</option>
              </select>
            </div>
            <div className={styles.selectChild}><CalendarInput mode={mode} /></div>
          </div>
        )}
      </div>
      {/*   <MdSearch />
          <input type="text" placeholder="Search..." className={styles.input} />
        </div>
        <div className={styles.icons}>
          <MdOutlineChat size={20} />
          <MdNotifications size={20} />
          <MdPublic size={20} />
        </div> */}
    </div>
  );
};

export default Navbar;
