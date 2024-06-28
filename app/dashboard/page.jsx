import Card from "../ui/dashboard/card/card";
import Chart from "../ui/dashboard/chart/chart";
import Rightbar from "../ui/dashboard/rightbar/rightbar";
import CustomerEngineerData from "../ui/dashboard/customerengineer/customerengineer";
import styles from "../ui/dashboard/dashboard.module.css";
import {
  getAllMerchantsList,
  getGoLiveMerchantsByDateRange,
  getAllUserData
} from "@/backend/query";
import {
  filterMerchantByGolive,
  filterMerchantByPending,
  filterAllTheMerchant,
} from "@/backend/backendservice";
import { auth } from "@/app/auth";

const DashbaordPage = async (context) => {
  // const { user } = await auth();
  // const { userData } = await getAllUserData();
  // const { merchantList } = await getAllMerchantsList();
  // const { start, end, mode } = context.searchParams;
  // const { merchants, status } = await getGoLiveMerchantsByDateRange(
  //   start,
  //   end,
  //   mode
  // );
  // let merchantData = {};
  // if (status === 200 && mode == "livedate") {
  //   merchantData = filterMerchantByGolive(merchants);
  // }

  // if (status === 200 && mode == "targetgolive") {
  //   merchantData = filterMerchantByPending(merchants);
  // }

  // if (status === 200 && mode == "kickoff") {
  //   merchantData = filterMerchantByPending(merchants);
  // }

  // const alltheMerchantList = filterAllTheMerchant(merchantList);

  return (
    <div className={styles.wrapper}>
      {/* <div className={styles.main}>
        <div className={styles.cards}>
          <Card
            title={"Emerging"}
            value={merchantData.emergingData ? merchantData.emergingData : 0}
            noOfMerchant={
              alltheMerchantList && alltheMerchantList.emergingData.length
            }
            mode={mode}
          />
          <Card
            title={"SMB"}
            value={merchantData.smbData ? merchantData.smbData : 0}
            mode={mode}
            noOfMerchant={
              alltheMerchantList && alltheMerchantList.smbData.length
            }
          />
          <Card
            title={"ENT"}
            value={merchantData.entData ? merchantData.entData : 0}
            mode={mode}
            noOfMerchant={
              alltheMerchantList && alltheMerchantList.entData.length
            }
          />
        </div>
        <CustomerEngineerData merchantData={merchantList} user={user}  userData={userData} searchParams={context.searchParams}/>
        <Chart />
      </div>
      <div className={styles.side}>
        <Rightbar />
      </div> */}
    </div>
  );
};

export default DashbaordPage;
