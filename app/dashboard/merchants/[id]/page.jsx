import styles from "@/app/ui/dashboard/merchants/singleMerchants/singleMerchant.module.css";
import Image from "next/image";
import { getMerchantById } from "@/backend/query";
import UpdateForm from "./updateForm";

const singleMerchantPage = async (context) => {
  const { params } = context;
  const mercahntid = Number.parseInt(params.id);
  const merchantData = await getMerchantById(mercahntid);

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.imgContainer}>
          <Image src="/noavatar.png" alt="" fill />
        </div>
      </div>
      <div className={styles.formContainer}>
        <UpdateForm styles={styles} merchantData={merchantData} />
      </div>
    </div>
  );
};

export default singleMerchantPage;
