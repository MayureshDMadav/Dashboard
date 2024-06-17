import styles from "@/app/ui/dashboard/users/singleUser/singleUser.module.css";
import Image from "next/image";
import { getUserById } from "@/backend/query";
import UpdateForm from "./updateForm";

const SingleUserPage = async (context) => {
  const { params } = context;
  const userId = Number.parseInt(params?.id[0]);
  const userDataByID = await getUserById(userId);

  return (
    <>
      {userDataByID &&
        userDataByID.map((user) => (
          <div className={styles.container}  key={user.id} >
            <div className={styles.infoContainer}>
              <div className={styles.imgContainer}>
                <Image src={"/noavatar.png"} alt="" fill />
              </div>
              {user.name}
            </div>
            <div className={styles.formContainer}>
              <UpdateForm  user={user} style={styles} />
            </div>
          </div>
        ))}
    </>
  );
};

export default SingleUserPage;
