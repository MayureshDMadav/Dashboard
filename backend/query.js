"use server";

import prisma from "@/lib/prisma";

//Function to Add New Users
export const getUserData = async (data) => {
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
export const getAllUsers = async() =>{
  try{
    const userData = await prisma.user.findMany();
    return {userData,status:200}
  }catch(e){
    return { error: 500, description: "something went wrong" };
  }
}


//Get User By ID
export const getUserById = async(userId) =>{
  try{
    const useData = await prisma.user.findMany({
      where:{
        id:userId
      }
    })

    return useData

  }catch(e){

  }
}
