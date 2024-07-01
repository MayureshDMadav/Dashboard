import Report from "@/app/ui/dashboard/reports/Report";
import { filterMerchantByGolive, filterMerchantByPending } from "@/backend/backendservice";
import { getGoLiveMerchantsByDateRange } from "@/backend/query";
import styles from "@/app/ui/dashboard/reports/report.module.css";
import { auth } from "@/app/auth";

const Reports = async (context) => {
  const { searchParams } = context;
  const { start, end, mode } = searchParams;
  const { user } = await auth();
  let merchantData = null;
  let pendingMerchant = null;    
  if (start && end !== undefined) {
    const { merchants, status } = await getGoLiveMerchantsByDateRange(
      start,
      end,
      mode,
      user
    );
    if (status === 200) {
      merchantData = filterMerchantByGolive(merchants);
    }
    if(status === 200){
      pendingMerchant = filterMerchantByPending(merchants);
    }
  }
  
  return (
    <div className={styles.container}>
      <Report merchantDataByGolive={merchantData}  pendingMerchants={pendingMerchant} />
    </div>
  );
};

export default Reports;
