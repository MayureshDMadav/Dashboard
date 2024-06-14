import React from "react";
import styles from "@/app/ui/dashboard/users/singleUser/singleUser.module.css";
import Image from "next/image";
import { getUserById } from "@/backend/query";

const SingleUserPage = async (context) => {
  const { params } = context;
  const userId = Number.parseInt(params?.id[0]);
  const userDataByID = await getUserById(userId);
  return (
    <>
      {userDataByID &&
        userDataByID.map((user) => (
          <div className={styles.container}>
            <div className={styles.infoContainer}>
              <div className={styles.imgContainer}>
                <Image src={"/noavatar.png"} alt="" fill />
              </div>
              {user.name}
            </div>
            <div className={styles.formContainer}>
              <form action="updateUser" className={styles.form}>
                <input type="hidden" name="name" value={user.username} />
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder={user.username}
                />
                <label>Email</label>
                <input type="email" name="email" placeholder={user.email} />
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter new Password"
                />
                <label>Phone</label>
                <input type="text" name="phone" placeholder={user.phone} />
                <label>Address</label>
                <textarea
                  type="text"
                  name="address"
                  placeholder={user.address}
                />
                <label>Is Admin?</label>
                <select name="isAdmin" id="isAdmin">
                  <option value={true} selected={user.isAdmin}>
                    Yes
                  </option>
                  <option value={false} selected={!user.isAdmin}>
                    No
                  </option>
                </select>
                <label>Is Active?</label>
                <select name="isActive" id="isActive">
                  <option value={true} selected={user.isActive}>
                    Yes
                  </option>
                  <option value={false} selected={!user.isActive}>
                    No
                  </option>
                </select>
                <button>Update</button>
              </form>
            </div>
          </div>
        ))}
    </>
  );
};

export default SingleUserPage;
