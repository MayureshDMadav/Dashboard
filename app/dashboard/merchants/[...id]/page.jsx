import styles from "@/app/ui/dashboard/merchants/singleMerchants/singleMerchant.module.css";
import Image from "next/image";
import { getMerchantById } from "@/backend/query";
import MerchantForm from "@/app/ui/dashboard/merchants/merchantForm";
import { auth } from "@/app/auth";

const singleMerchantPage = async (context) => {
  const {user} = await auth()
  const { params } = context;
  const mercahntid = Number.parseInt(params?.id[0]);
  const merchantData = await getMerchantById(mercahntid);
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <MerchantForm styles={styles} merchantData={merchantData} mode="update" isAdmin = {user.isAdmin} userName = {user.username} userId = {user.id} />
      </div>
    </div>
  );
};

export default singleMerchantPage;
