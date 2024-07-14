import Report from "@/app/ui/dashboard/reports/report";
import {
  filterAllTheMerchant,
} from "@/backend/backendservice";
import {
  getAllMerchantsList,
  getMerchantDataByDateRangeOnMultipleField,
} from "@/backend/query";
import styles from "@/app/ui/dashboard/reports/report.module.css";
import { auth } from "@/app/auth";

const Reports = async ({ searchParams }) => {
  const { user } = await auth();
  const { start, endDate, mode } = searchParams;
  let merchantData;
  let premiumData;

  if (start && endDate && mode) {
    const { merchants, status } =
      await getMerchantDataByDateRangeOnMultipleField(
        start,
        endDate,
        JSON.parse(mode),
        user
      );

    if (status === 200) {
      const response = await filterAllTheMerchant(merchants);
      merchantData = response;
      premiumData = response?.smbData.concat(response?.entData);
    }
  }

  if (Object?.values(searchParams).length === 0) {
    const { merchantList, status } = await getAllMerchantsList(user);
    if (status) {
      const response = await filterAllTheMerchant(merchantList);
      merchantData = response;
      premiumData = response?.smbData.concat(response?.entData);
    }
  }


  return (
    <div className={styles.container}>
      <Report
        smbEntMerchant={premiumData}
        emergingMerchant={merchantData ? merchantData?.emergingData : [] }
      />
    </div>
  );
};

export default Reports;
