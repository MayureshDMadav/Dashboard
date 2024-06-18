import styles from "@/app/ui/dashboard/merchants/singleMerchants/singleMerchant.module.css";
import Image from "next/image";
import { getMerchantById } from "@/backend/query";
import MerchantForm from "@/app/ui/dashboard/merchants/merchantForm";

const singleMerchantPage = async (context) => {
  const { params } = context;
  const mercahntid = Number.parseInt(params?.id[0]);
  const merchantData = await getMerchantById(mercahntid);

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <MerchantForm styles={styles} merchantData={merchantData} mode="update" />
      </div>
    </div>
  );
};

export default singleMerchantPage;
