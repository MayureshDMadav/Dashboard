import { auth } from "@/app/auth";
import UploadMerchants from "@/app/ui/dashboard/uploadMerchants/uploadMerchants";
import { getAllUserData } from "@/backend/query";
import React from "react";

const Upload = async () => {
  const {user} = await auth();
  const { status, userData } = await getAllUserData();
  if (status === 200) {
    return <UploadMerchants userData = {userData}  currentUser = {user} />;
  }
};

export default Upload;
