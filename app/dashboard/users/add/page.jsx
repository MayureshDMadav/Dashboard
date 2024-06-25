import styles from "@/app/ui/dashboard/users/addUser/addUser.module.css";
import UserForm from "@/app/ui/dashboard/users/userForm";

const AddUserPage = () => {
  return (
    <div className={styles.container}>
      <UserForm styles={styles} userData={null} mode={"add"} />
    </div>
  );
};

export default AddUserPage;
