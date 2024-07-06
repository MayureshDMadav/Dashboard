import Report from "@/app/ui/dashboard/reports/report";
import { filterAllTheMerchant, filterMerchantByGolive, filterMerchantByPending } from "@/backend/backendservice";
import { getAllMerchantsList, getGoLiveMerchantsByDateRange } from "@/backend/query";
import styles from "@/app/ui/dashboard/reports/report.module.css";
import { auth } from "@/app/auth";

const Reports = async () => {
  const { user } = await auth();
  const {merchantList} = await getAllMerchantsList(user);
  const {smbData, entData, emergingData} = await filterAllTheMerchant(merchantList);
  const preiumData = smbData?.concat(entData);

  
  
  return (
    <div className={styles.container}>
      <Report smbEntMerchant = {preiumData} emergingMerchant={emergingData} />
    </div>
  );
};

export default Reports;
