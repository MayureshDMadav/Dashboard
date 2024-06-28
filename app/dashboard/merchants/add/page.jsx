import { auth } from "@/app/auth";
import styles from "@/app/ui/dashboard/merchants/addmerchant/addmerchant.module.css";
import MerchantForm from "@/app/ui/dashboard/merchants/merchantForm";

const AddNewMerchant = async() => {
  const {user} = await auth()
  return (
    <div className={styles.container}>
      <MerchantForm styles={styles} merchantData={null} mode="add" isAdmin = {user.isAdmin}  userName = {user.username} userId = {user.id}/>
    </div>
  );
};

export default AddNewMerchant;
