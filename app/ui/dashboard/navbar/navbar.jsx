"use client";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./navbar.module.css";
import { MdSearch } from "react-icons/md";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);  
  const actualPath = pathname.split("/").pop();
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target)
    const formEntries = Object.fromEntries(formData.entries());
    router.push(`/dashboard?start=${encodeURIComponent(formEntries.startDate)}&end=${encodeURIComponent(formEntries.endDate)}&mode=${encodeURIComponent(formEntries.mode)}`)
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{decodeURI(pathname.split("/").pop())}</div>
      <div className={styles.menu}>
        {actualPath === "dashboard" && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <select name="mode" className={styles.select}  required>
              <option value="">Select a State</option>
              <option value="kickoff">Merchant In Queue</option>
              <option value="targetgolive">Targeted Merchant</option>
              <option value="livedate">Live Merchant</option>
            </select>
            <label htmlFor="startDate" className={styles.label}>
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className={styles.input}
              required
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
              required
            />
            <button className={styles.button}>
              <MdSearch className={styles.mdSearch} />
            </button>
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
