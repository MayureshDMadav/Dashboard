"use server";

import prisma from "@/lib/prisma";

//Add New Users
export const createUserData = async (data) => {
  try {
    await prisma.user.create({
      data: data,
    });

    return { status: 201, description: "User was created succesfully" };
  } catch (e) {
    return { error: 500, description: "something went wrong" };
  }
};

//Get All Users
export const getAllUsers = async (userName, page) => {
  const itemsPerPage = 5;
  const skip = (page - 1) * itemsPerPage;
  try {
    const count = await prisma.user.count();
    const allUserData = await prisma.user.findMany();
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
    return {allUserData, userData, status: 200, count };
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

//Add New Merchant
export const createNewMerchant = async (data) => {
  try {
    await prisma.merchants.create({
      data: data,
    });
    return { status: 201, description: "Merchant Added Successfully" };
  } catch (e) {
    console.log(e)
    return { error: 500, description: "something went wrong" };
  }
};

//Get All Merchants
export const getAllMerchantsList = async () =>{
  try{
    const merchantList = await prisma.merchants.findMany();
    return {status:200,merchantList}
  }catch(e){
    return {error:500,description:"something went wrong"}
  }
}

