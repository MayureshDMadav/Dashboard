"use client"
import React, { useState } from 'react';
import {createUserData} from '@/backend/query.js';
import styles from '@/app/ui/dashboard/users/addUser/addUser.module.css';
import toast from 'react-hot-toast';

const AddUserPage = () => {
  const [formData, setFormData] = useState({});

  const getFormData = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'isActive' || name === 'isAdmin' ? value === 'true' : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
  }

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createUserData(formData);
      if(response.status === 201){
        toast.success('Form Submitted Successfully',{position: 'top-right'})
        setTimeout(() => {
          window.location.replace("/dashboard/users");
        }, 2000);
      }else{
        toast.error('Error While Processing Your request',{position: 'top-right',style: {color:"red"}})
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={formSubmit}>
        <input type="text" placeholder="Username" name="username" onChange={getFormData} required />
        <input type="email" placeholder="Email" name="email" onChange={getFormData} required />
        <input type="password" placeholder="Password" name="password" required onChange={getFormData} />
        <input type="tel" placeholder="Phone" name="phone" onChange={getFormData} />
        <select name="isAdmin" id="isAdmin" onChange={getFormData}>
          <option value={false}>Is Admin?</option>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
        <select name="isActive" id="isActive" onChange={getFormData}>
          <option value={true}>Is Active?</option>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
        <textarea name="address" id="address" rows="4" placeholder="Address" onChange={getFormData}></textarea>
        <button type="submit">Add New User</button>
      </form>
    </div>
  );
};

export default AddUserPage;
