"use client";
import { updateUserByID, encryptData } from "@/backend/query";
import toast from "react-hot-toast";

const UpdateForm = ({ user, style }) => {
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formEnteries = Object.fromEntries(formData.entries());
    const { id } = formEnteries;
    const hasedPassword = await encryptData(formEnteries.password);
    formEnteries.password = hasedPassword;
    formEnteries.isAdmin = formEnteries.isAdmin === "true" ? true : false;
    formEnteries.isActive = formEnteries.isActive === "true" ? true : false;
    delete formEnteries.id;
    Object.keys(formEnteries).forEach(
      (key) =>
        (formEnteries[key] === "" || undefined) && delete formEnteries[key]
    );
    const updateUserInDataBase = await updateUserByID(id, formEnteries);
    if (updateUserInDataBase.status === 200) {
      toast.success(updateUserInDataBase.description, {
        position: "top-right",
      });
      setTimeout(() => {
        window.location.replace("/dashboard/users");
      }, 1500);
    } else {
      toast.error(updateUserInDataBase.description, { position: "top-right" });
    }
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={user.id} />
      <label>Username</label>
      <input type="text" name="username" placeholder={user.username} />
      <label>Email</label>
      <input type="email" name="email" placeholder={user.email} />
      <label>Password</label>
      <input type="password" name="password" placeholder="Enter new Password" />
      <label>Phone</label>
      <input type="text" name="phone" placeholder={user.phone} />
      <label>Address</label>
      <textarea type="text" name="address" placeholder={user.address} />
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
  );
};

export default UpdateForm;
