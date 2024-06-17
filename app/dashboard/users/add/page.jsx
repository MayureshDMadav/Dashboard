"use client";
import { encryptData, createUserData } from "@/backend/query.js";
import styles from "@/app/ui/dashboard/users/addUser/addUser.module.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
      <form className={styles.form} onSubmit={formSubmit}>
        <input type="text" placeholder="Username" name="username" required />
        <input type="email" placeholder="Email" name="email" required />
        <input
          type="password"
          placeholder="Password"
          name="password"
          required
        />
        <input type="tel" placeholder="Phone" name="phone" />
        <select name="isAdmin" id="isAdmin" >
          <option value={false}>Is Admin?</option>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
        <select name="isActive" id="isActive" >
          <option value={true}>Is Active?</option>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
        <textarea
          name="address"
          id="address"
          rows="4"
          placeholder="Address"
        ></textarea>
        <button type="submit">Add New User</button>
      </form>
    </div>
  );
};

export default AddUserPage;
