"use client";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";
import {
  MdSearch,
} from "react-icons/md";

const Navbar = () => {
  const pathname = usePathname();

  const actualPath = pathname.split("/").pop();

  const handleSubmit = () => {};

  return (
    <div className={styles.container}>
      <div className={styles.title}>{decodeURI(pathname.split("/").pop())}</div>
      <div className={styles.menu}>
        {actualPath === "dashboard" && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="startDate" className={styles.label}>
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className={styles.input}
            />
            <br />
            <label htmlFor="endDate" className={styles.label}>
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className={styles.input}
            />
            <buttn type="submit" className={styles.button}>
              <MdSearch className={styles.mdSearch} />
            </buttn>
          </form>
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
