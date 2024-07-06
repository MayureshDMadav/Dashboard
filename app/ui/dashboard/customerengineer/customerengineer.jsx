import Image from "next/image";
import styles from "./customerengineer.module.css";
import { filterMerchantByPending, sortArray } from "@/backend/backendservice";
import { formatDistance } from "date-fns";
import CustomPopup from "./popup";
import Link from "next/link";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";

const CustomerEngineerData = async ({
  merchantData,
  user,
  userData,
  searchParams,
}) => {
  const page = Number(searchParams?.page) || 1;
  const itemsPerPage = 4;

  let dataCollectedFromResults = null;
  let merchatFilteredData = filterMerchantByPending(merchantData);
  let smbData = merchatFilteredData.smbData;
  let entData = merchatFilteredData.entData;
  dataCollectedFromResults = sortArray(smbData, entData);

  const totalItems = dataCollectedFromResults?.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataCollectedFromResults?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className={styles.container}>
      {/* <div className={styles.header}>
        <h2 className={styles.title}>Priority List</h2>
        {user.isAdmin && (
          <select>
            <option value="cename">Select a CE Name</option>
            {userData &&
              userData.map((data) => (
                <option key={data.username} value={data.username}>
                  {data.username}
                </option>
              ))}
            {!userData && <option value="cename">No Data To Display</option>}
          </select>
        )}
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>CE Name</td>
            <td>Merchant Name</td>
            <td>Status</td>
            <td>Category</td>
            <td>Platform</td>
            <td>Age</td>
            <td>Comments</td>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 &&
            currentItems.map((data) => (
              <tr key={data?.id}>
                <td>
                  <div className={styles.user}>
                    <Image
                      src="/noavatar.png"
                      alt=""
                      width={40}
                      height={40}
                      className={styles.userImage}
                    />
                    {data?.cename}
                  </div>
                </td>
                <td>{data?.merchantname}</td>
                <td>
                  <span className={`${styles.status} ${styles.pending}`}>
                    Pending
                  </span>
                </td>
                <td>{data?.category}</td>
                <td>{data?.platform}</td>
                <td>{data?.kickoff ? formatDistance(new Date(data?.kickoff) , new Date()):""}</td>
                <td>
                  <CustomPopup styles={styles} reason={data?.mintcomment} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        {page > 1 && (
          <Link href={`?page=${page - 1}`} className={styles.paginationButton}>
            <MdSkipPrevious />
          </Link>
        )}
        <span className={styles.pageNumber}>
          {page} of {totalPages}
        </span>
        {page < totalPages && (
          <Link href={`?page=${page + 1}`} className={styles.paginationButton}>
            <MdSkipNext />
          </Link>
        )}
      </div> */}
    </div>
  );
};

export default CustomerEngineerData;
