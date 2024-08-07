import Image from "next/image";
import Link from "next/link";
import styles from "@/app/ui/dashboard/users/users.module.css";
import Search from "@/app/ui/dashboard/search/search";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import { userPaginationFunc, deletEntryForUsers, getAllUserData } from "@/backend/query";
import { auth } from "@/app/auth";

const UsersPage = async ({ searchParams }) => {
  const {user} = await auth()
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const { count, userData } = await userPaginationFunc(q, page);
  const userList = await getAllUserData();

  return (
    <div className={styles.container}>
      <div className={styles.top}>
      <Search isAdmin = {user?.isAdmin}  userData = {userList.userData} />
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
                <td style={{display:"flex",gap:"6px",}} >
                  <Link href={`/dashboard/users/${data.id}/${data.username}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                  <form action={deletEntryForUsers}>
                    <input type="hidden" name="id"  value={data.id} />
                    <button className={`${styles.button} ${styles.delete}`}>
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination count={count}  ITEM_PER_PAGE={5}/>
    </div>
  );
};

export default UsersPage;
