"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

/* ====================================  USER  =================================== */

// For Passowrd Encryption
export const encryptData = async (data) => {
  const salt = await bcrypt.genSalt(10);
  const hasedPassword = await bcrypt.hash(data, salt);
  return hasedPassword;
};

//For Finding single User
export const findUserByUserName = async (data) => {
  try {
    const userData = await prisma.user.findUnique({
      where: {
        username: data,
      },
    });

    return { userData, status: 200 };
  } catch (e) {
    return { description: "Somethin went wrong", status: 500 };
  }
};

//Add New Users
export const createUserData = async (data) => {
  console.log(data,"=======>")
  try {
    await prisma.user.create({
      data: data,
    });
    revalidatePath("/dashboard/users");
    return { status: 201, description: "User was created succesfully" };
  } catch (e) {
    return { error: 500, description: "something went wrong" };
  }
};

//Get All Users Data
export const getAllUserData = async () => {
  try {
    const userData = await prisma.user.findMany();
    return { userData, status: 200 };
  } catch (e) {
    return { error: 500, description: "something went wrong" };
  }
};

//function for Pagination
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
      take: itemsPerPage,
      skip: skip,
    });
    return { userData, status: 200, count };
  } catch (e) {
    console.log(e);
    return { error: 500, description: "something went wrong" };
  }
};

//Get User By ID
export const getUserById = async (userId) => {
  try {
    const useData = await prisma.user.findMany({
      where: {
        id: userId,
      },
    });

    return useData;
  } catch (e) {}
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
  } catch (e) {}
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

// Delete Mercahant Entry
export const deletEntryForMerchant = async (formData) => {
  const { id } = Object.fromEntries(formData);
  try {
    await prisma.merchants.delete({
      where: {
        id: Number.parseInt(id),
      },
    });
    revalidatePath("/dashboard/merchants");
  } catch (e) {}
};

//Add New Merchant
export const createNewMerchant = async (data) => {
  try {
    await prisma.merchants.create({
      data: data,
    });
    revalidatePath("/dashboard/merchants");
    return { status: 201, description: "Merchant Added Successfully" };
  } catch (e) {
    console.log(e);
    return { error: 500, description: "something went wrong" };
  }
};

//Get All Merchants
export const getAllMerchantsList = async () => {
  try {
    const merchantList = await prisma.merchants.findMany();
    return { status: 200, merchantList };
  } catch (e) {
    return { error: 500, description: "something went wrong" };
  }
};

//Handle Merchant List pagination and search part
export const paginationForMerchantList = async (userName, page , itemsPerPage) => {
  const skip = (page - 1) * itemsPerPage;
  try {
    const count = await prisma.merchants.count();
    const merchantData = await prisma.merchants.findMany({
      where: {
        cename: {
          contains: userName,
          mode: "insensitive",
        },
      },
      take: itemsPerPage,
      skip: skip,
    });
    return { merchantData, status: 200, count };
  } catch (e) {
    console.log(e);
    return { error: 500, description: "something went wrong" };
  }
};

//Update Data By Mercahnt Id
export const updateMerchantByID = async (id, formData) => {
  try {
    await prisma.merchants.update({
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

//Get Data By Merchant ID
export const getMerchantById = async (userId) => {
  try {
    const merchant = await prisma.merchants.findMany({
      where: {
        id: userId,
      },
    });

    return merchant;
  } catch (e) {}
};

//Get Data by Date Range
export const getGoLiveMerchantsByDateRange = async (
  startDate,
  endDate,
  fieldName
) => {
  try {
    const merchants = await prisma.merchants.findMany({
      where: {
        AND: [
          { [fieldName]: { gte: startDate } },
          { [fieldName]: { lte: endDate } },
        ],
      },
    });
    return { merchants, status: 200 };
  } catch (error) {
    return { status: 500, description: "something went wrong" };
  }
};
