"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

/* ====================================  USER  =================================== */

// For Password Encryption
export const encryptData = async (data) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data, salt);
  return hashedPassword;
};

// For Finding single User
export const findUserByUserName = async (data) => {
  try {
    const userData = await prisma.user.findUnique({
      where: {
        username: data,
      },
      include: { merchant: true },
    });
    return { userData, status: 200 };
  } catch (e) {
    console.log(e);
    return { description: "Something went wrong", status: 500 };
  }
};

// Add New Users
export const createUserData = async (data) => {
  try {
    await prisma.user.create({
      data: data,
    });
    revalidatePath("/dashboard/users");
    return { status: 201, description: "User was created successfully" };
  } catch (e) {
    console.log(e);
    return { error: 500, description: "something went wrong" };
  }
};

// Get All Users Data
export const getAllUserData = async () => {
  try {
    const userData = await prisma.user.findMany({
      include: { merchant: true },
    });
    return { userData, status: 200 };
  } catch (e) {
    return { error: 500, description: "something went wrong" };
  }
};

// Function for Pagination
export const userPaginationFunc = async (userName, page) => {
  const itemsPerPage = 5;
  const skip = (page - 1) * itemsPerPage;
  try {
    const count = await prisma.user.count();
    const userData = await prisma.user.findMany({
      where: {
        username: {
          contains: userName,
          mode: "insensitive",
        },
      },
      include: { merchant: true },
      take: itemsPerPage,
      skip: skip,
    });
    return { userData, status: 200, count };
  } catch (e) {
    console.log(e);
    return { error: 500, description: "something went wrong" };
  }
};

// Get User By ID
export const getUserById = async (userId) => {
  try {
    const userData = await prisma.user.findMany({
      where: {
        id: userId,
      },
      include: { merchant: true },
    });

    return userData;
  } catch (e) {
    console.log(e);
    return { error: 500, description: "something went wrong" };
  }
};

// Get User By UserName
export const getUserByUserName = async (userName) => {
  try {
    const userData = await prisma.user.findMany({
      where: {
        username: userName,
      },
      include: { merchant: true },
    });

    return userData;
  } catch (e) {
    console.log(e);
    return { error: 500, description: "something went wrong" };
  }
};

// Delete User Entry
export const deletEntryForUsers = async (formData) => {
  const { id } = Object.fromEntries(formData);
  try {
    await prisma.user.delete({
      where: {
        id: Number.parseInt(id),
      },
    });
    revalidatePath("/dashboard/users");
  } catch (e) {
    console.log(e);
    return { error: 500, description: "something went wrong" };
  }
};

// Update User
export const updateUserByID = async (id, formData) => {
  try {
    await prisma.user.update({
      where: { id: Number.parseInt(id) },
      data: formData,
    });
    revalidatePath("/dashboard/merchants");
    return { status: 200, description: "User Updated Successfully" };
  } catch (e) {
    console.log(e);
    return { status: 500, description: "Something Went Wrong" };
  }
};

/* ==================================  MERCHANT  ===================================== */

// Delete Merchant Entry
export const deletEntryForMerchant = async (formData) => {
  const { id } = Object.fromEntries(formData);
  try {
    await prisma.merchant.delete({
      where: {
        id: Number.parseInt(id),
      },
    });
    revalidatePath("/dashboard/merchants");
  } catch (e) {
    console.log(e);
    return { error: 500, description: "something went wrong" };
  }
};

// Add New Merchant
export const createNewMerchant = async (data, userId) => {
  try {
    await prisma.merchant.create({
      data: {
        ...data,
        user: { connect: { id: Number.parseInt(userId) } },
      },
    });
    revalidatePath("/dashboard/merchants");
    return { status: 201, description: "Merchant Added Successfully" };
  } catch (e) {
    console.log(e);
    return { error: 500, description: "something went wrong" };
  }
};

// Get All Merchants
export const getAllMerchantsList = async (user) => {
  if (user && user.isAdmin) {
    try {
      const merchantList = await prisma.merchant.findMany({
        include: { user: true },
      });
      return { status: 200, merchantList };
    } catch (e) {
      return { error: 500, description: "something went wrong" };
    }
  } else {
    try {
      const merchantList = await prisma.merchant.findMany({
        where: {
          userId: Number.parseInt(user.id),
        },
        include: { user: true },
      });
      return { status: 200, merchantList };
    } catch (e) {
      return { error: 500, description: "something went wrong" };
    }
  }
};

// Handle Merchant List pagination and search part
export const paginationForMerchantList = async (
  userName,
  page,
  itemsPerPage
) => {
  const skip = (page - 1) * itemsPerPage;
  try {
    const count = await prisma.merchant.count();
    const merchantData = await prisma.merchant.findMany({
      where: {
        cename: {
          contains: userName,
          mode: "insensitive",
        },
      },
      include: { user: true },
      take: itemsPerPage,
      skip: skip,
    });
    return { merchantData, status: 200, count };
  } catch (e) {
    console.log(e);
    return { error: 500, description: "something went wrong" };
  }
};

// Update Data By Merchant Id
export const updateMerchantByID = async (id, formData) => {
  try {
    await prisma.merchant.update({
      where: { id: Number.parseInt(id) },
      data: formData,
    });
    revalidatePath("/dashboard/merchants");
    return { status: 200, description: "Merchant Updated Successfully" };
  } catch (e) {
    console.log(e);
    return { status: 500, description: "Something Went Wrong" };
  }
};

// Get Data By Merchant ID
export const getMerchantById = async (merchantId) => {
  try {
    const merchant = await prisma.merchant.findUnique({
      where: {
        id: Number.parseInt(merchantId),
      },
      include: { user: true },
    });

    return merchant;
  } catch (e) {
    console.log(e);
    return { error: 500, description: "something went wrong" };
  }
};

// Get Data by Date Range
export const getGoLiveMerchantsByDateRange = async (
  startDate,
  endDate,
  fieldName,
  user
) => {

  if(!startDate && !endDate) return {merchants:[] , status:200}

  if (user && user.isAdmin) {
    try {
      const merchants = await prisma.merchant.findMany({
        where: {
          AND: [
            { [fieldName]: { gte: startDate } },
            { [fieldName]: { lte: endDate } },
          ],
        },
        include: { user: true },
      });
      return { merchants, status: 200 };
    } catch (error) {
      console.log(error);
      return { status: 500, description: "something went wrong" };
    }
  } else {
    try {
      const merchants = await prisma.merchant.findMany({
        where: {
          userId: Number.parseInt(user.id),
          AND: [
            { [fieldName]: { gte: startDate } },
            { [fieldName]: { lte: endDate } },
          ],
        },
        include: { user: true },
      });
      return { merchants, status: 200 };
    } catch (error) {
      console.log(error);
      return { status: 500, description: "something went wrong" };
    }
  }
};
