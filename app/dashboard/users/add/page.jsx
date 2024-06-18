"use client";
import { encryptData, createUserData } from "@/backend/query.js";
import styles from "@/app/ui/dashboard/users/addUser/addUser.module.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import UserForm from "@/app/ui/dashboard/users/userForm";

const AddUserPage = () => {
  const router = useRouter()

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      const formTemplate = new FormData(e.target);
      const formData = Object.fromEntries(formTemplate.entries());
      const hasedPassword = await encryptData(formData.password);
      formData.isActive = formData.isActive === "true" ? true : false;
      formData.isAdmin = formData.isAdmin === "true" ? true : false;
      formData.password = hasedPassword;
      const {status,description} = await createUserData(formData);
      if (status === 201) {
        toast.success(description, { position: "top-right" });
        router.push("/dashboard/users")
      } else {
        toast.error(description, {
          position: "top-right",
          style: { color: "red" },
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div className={styles.container}>
      <UserForm styles={styles} userData={""} mode={"add"} />
    </div>
  );
};

export default AddUserPage;
