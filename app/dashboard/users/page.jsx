import Image from "next/image";
import Link from "next/link";
import styles from "@/app/ui/dashboard/users/users.module.css";
import Search from "@/app/ui/dashboard/search/search";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import { userPaginationFunc } from "@/backend/query";

const UsersPage = async ({searchParams}) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const {count,userData} = await userPaginationFunc(q,page);
  
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for a user..." />
        <Link href="/dashboard/users/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Email</td>
            <td>Created At</td>
            <td>Role</td>
            <td>Status</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {userData &&
            userData.map((data) => (
              <tr key={data.id}>
                <td>
                  <div className={styles.user}>
                    <Image
                      src={"/noavatar.png"}
                      alt=""
                      width={40}
                      height={40}
                      className={styles.userImage}
                    />
                    {data.username}
                  </div>
                </td>
                <td>{data.email}</td>
                <td>{data.createdAt.toDateString()}</td>
                <td> {data?.isAdmin ? "admin" : "user"}</td>
                <td>{data?.isActive ? "active" : "inactive"}</td>
                <td>
                  <Link href={`/dashboard/users/${data.id}/${data.username}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                  <button className={`${styles.button} ${styles.delete}`}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination count={count}  />
    </div>
  );
};

export default UsersPage;
