import Card from "../ui/dashboard/card/card";
import Chart from "../ui/dashboard/chart/chart";
import Rightbar from "../ui/dashboard/rightbar/rightbar";
import Transactions from "../ui/dashboard/transactions/transactions";
import styles from "../ui/dashboard/dashboard.module.css";
import {
  getAllMerchantsList,
  getGoLiveMerchantsByDateRange,
} from "@/backend/query";
import {
  filterMerchantByGolive,
  filterMerchantByPending,
  filterAllTheMerchant
} from "@/backend/backendservice";

const DashbaordPage = async (context) => {
  const { merchantList } = await getAllMerchantsList();
  const { start, end, mode } = context.searchParams;
  const { merchants, status } = await getGoLiveMerchantsByDateRange(
    start,
    end,
    mode
  );
  let merchantData = {};
  if (status === 200 && mode == "livedate") {
    merchantData = filterMerchantByGolive(merchants);
  }

  if (status === 200 && mode == "targetgolive") {
    merchantData = filterMerchantByPending(merchants);
  }

  if(status === 200 && mode == "kickoff"){
    merchantData = filterMerchantByPending(merchants);
  }

  const alltheMerchantList = filterAllTheMerchant(merchantList)

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.cards}>
          <Card
            title={"Emerging"}
            value={
              merchantData.emergingData ? merchantData.emergingData.length : 0
            }
            noOfMerchant = {alltheMerchantList.emergingData.length}
            mode={mode}
          />
          <Card
            title={"SMB"}
            value={merchantData.smbData ? merchantData.smbData.length : 0}
            mode={mode}
            noOfMerchant = {alltheMerchantList.smbData.length}
          />
          <Card
            title={"ENT"}
            value={merchantData.entData ? merchantData.entData.length : 0}
            mode={mode}
            noOfMerchant = {alltheMerchantList.entData.length}
          />
        </div>
        <Transactions />
        <Chart />
      </div>
      <div className={styles.side}>
        <Rightbar />
      </div>
    </div>
  );
};

export default DashbaordPage;
