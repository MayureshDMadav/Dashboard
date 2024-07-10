"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./search.module.css";
import { useDebouncedCallback } from "use-debounce";
import { MdSearch } from "react-icons/md";
import { useEffect, useState } from "react";

const Search = ({ userData, isAdmin }) => {
  const [filter, getFilter] = useState("");
  const path = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const handleSearch = useDebouncedCallback((e) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", 1);
    params.set("mode", e.target.type);
    if (e.target.value) {
      e.target.value.length > 2 && params.set("q", e.target.value);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params}`);
  }, 300);

  const handleFilter = (e) => {
    getFilter(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.selectContainer}>
        <select className={styles.selectChild} onChange={handleFilter}>
          <option>Select Filter</option>
          {isAdmin && <option value="cename">search by CE</option>}
          {path === "/dashboard/merchants" && (
            <option value="mename">select by Merchant</option>
          )}
        </select>
        {filter === "cename" && (
          <select onChange={handleSearch} className={styles.selectChild}>
            {userData?.map((data) => (
              <option value={data.username}>{data.username}</option>
            ))}
          </select>
        )}
        {filter === "mename" && (
          <input
            onChange={handleSearch}
            className={styles.selectChild}
            placeholder="search by merchant name...."
          />
        )}
      </div>
    </div>
  );
};

export default Search;
