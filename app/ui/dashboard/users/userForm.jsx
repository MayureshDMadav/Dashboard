"use client";
import { encryptData, createUserData, updateUserByID } from "@/backend/query";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const UserForm = ({ styles, userData, mode }) => {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formTemplates = new FormData(e.target);
      const formData = Object.fromEntries(formTemplates.entries());
      const hashedPassword = await encryptData(formData.password);
      formData.password = hashedPassword;
      formData.isActive = formData.isActive === "true" ? true : false;
      formData.isAdmin = formData.isAdmin === "true" ? true : false;

      if (mode === "add") {
        const { status, description } = await createUserData(data);
        if (status === 201) {
          toast.success(description, { position: "top-right" });
          router.push("/dashboard/users");
        } else {
          toast.error(description, {
            position: "top-right",
            style: { color: "red" },
          });
        }
      } else {
        const id = userData.id;
        Object.keys(formData).forEach(
          (key) => (formData[key] === "" || undefined) && delete formData[key]
        );
        const updateUserInDataBase = await updateUserByID(id, formData);
        if (updateUserInDataBase.status === 200) {
          toast.success(updateUserInDataBase.description, {
            position: "top-right",
          });
          router.push("/dashboard/users");
        } else {
          toast.error(updateUserInDataBase.description, {
            position: "top-right",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder={userData.username || "username"}
          required={mode === "add"}
        />
        <input
          type="email"
          name="email"
          placeholder={userData.email || "Email"}
          required={mode === "add"}
        />
        <input
          type="password"
          name="password"
          placeholder="*********"
          required={mode === "add"}
        />
        <input
          type="tel"
          name="phone"
          required={mode === "add"}
          placeholder={userData.phone || "Phone"}
        />
        <label>Is Admin?</label>
        <select name="isAdmin" id="isAdmin">
          <option value={true} selected={userData.isAdmin}>
            Yes
          </option>
          <option value={false} selected={!userData.isAdmin}>
            No
          </option>
        </select>
        <label>Is Active?</label>
        <select name="isActive" id="isActive">
          <option value={true} selected={userData.isActive}>
            Yes
          </option>
          <option value={false} selected={!userData.isActive}>
            No
          </option>
        </select>
        <textarea
          name="address"
          id="address"
          rows="4"
          placeholder="Address"
          value={userData.address || ""}
          required={mode === "add"}
        ></textarea>
        <button type="submit">
          {mode === "add" ? "Add User" : "Update User"}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
