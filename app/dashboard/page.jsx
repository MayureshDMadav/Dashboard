import Card from "../ui/dashboard/card/card";
import Rightbar from "../ui/dashboard/rightbar/rightbar";
import CustomerEngineerData from "../ui/dashboard/customerengineer/customerengineer";
import styles from "../ui/dashboard/dashboard.module.css";
import {
  getAllMerchantsList,
  getGoLiveMerchantsByDateRange,
  getAllUserData,
} from "@/backend/query";
import {
  filterMerchantByGolive,
  filterMerchantByPending,
  filterAllTheMerchant,
} from "@/backend/backendservice";
import { auth } from "@/app/auth";
import MerchantStatusChart from "../ui/dashboard/chart/chart";
import {
  MerchantCountChart,
  MerchantPieChart,
} from "../ui/dashboard/chart/piechart";

const DashbaordPage = async (context) => {
  const { user } = await auth();
  const { merchantList } = await getAllMerchantsList(user);
  const { start, end, mode } = context.searchParams;
  const { merchants, status } = await getGoLiveMerchantsByDateRange(
    start,
    end,
    mode,
    user
  );

  const dateRangeAllData = await getGoLiveMerchantsByDateRange(
    start,
    end,
    "kickoff",
    user
  );

  let merchantData = {};
  if (status === 200 && mode == "livedate") {
    merchantData = filterMerchantByGolive(merchants);
  }

  if (status === 200 && mode == "targetgolive") {
    merchantData = filterMerchantByPending(merchants);
  }

  if (status === 200 && mode == "kickoff") {
    merchantData = filterMerchantByPending(merchants);
  }

  const alltheMerchantList = filterAllTheMerchant(merchantList);

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.cards}>
          <Card
            title={"Emerging"}
            value={merchantData.emergingData ? merchantData.emergingData : 0}
            noOfMerchant={
              alltheMerchantList.emergingData
                ? alltheMerchantList?.emergingData.length
                : 0
            }
            mode={mode}
          />
          <Card
            title={"SMB"}
            value={merchantData.smbData ? merchantData.smbData : 0}
            mode={mode}
            noOfMerchant={
              alltheMerchantList.smbData
                ? alltheMerchantList?.smbData.length
                : 0
            }
          />
          <Card
            title={"ENT"}
            value={merchantData.entData ? merchantData?.entData : 0}
            mode={mode}
            noOfMerchant={
              alltheMerchantList.entData
                ? alltheMerchantList?.entData.length
                : 0
            }
          />
        </div>

        <div className={styles.charts}>
          <div className={styles.childCharts}>
            <MerchantCountChart
              merchantData={
                dateRangeAllData.merchants.length > 0
                  ? dateRangeAllData.merchants
                  : alltheMerchantList
              }
            />
          </div>
          <div className={styles.childCharts}>
            <MerchantPieChart
              merchantData={
                dateRangeAllData.merchants.length > 0
                  ? dateRangeAllData.merchants
                  : alltheMerchantList
              }
            />
          </div>
        </div>
        <MerchantStatusChart
          merchantData={
            dateRangeAllData.merchants.length > 0
              ? dateRangeAllData.merchants
              : alltheMerchantList
          }
        />
      </div>
      <div className={styles.side}>
        <Rightbar />
      </div>
    </div>
  );
};

export default DashbaordPage;
