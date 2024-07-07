import Report from "@/app/ui/dashboard/reports/report";
import { filterAllTheMerchant, filterMerchantByGolive, filterMerchantByPending } from "@/backend/backendservice";
import { getAllMerchantsList, getGoLiveMerchantsByDateRange } from "@/backend/query";
import styles from "@/app/ui/dashboard/reports/report.module.css";
import { auth } from "@/app/auth";

const Reports = async ({searchParams}) => {
  const { user } = await auth();
  const {start , endDate , mode} = searchParams;
  let merchantData;
  let premiumData;  
  
  if(start && endDate && mode ){
    console.log("params found")
    const {merchants,status} = await getGoLiveMerchantsByDateRange(start,endDate,mode,user);
    if(status){
      const response =   await filterAllTheMerchant(merchants);
      merchantData = response;
      premiumData = response?.smbData.concat(response?.entData)
    } 
  }

  if(Object.values(searchParams).length === 0){
    console.log("params not found")
    const {merchantList,status} = await getAllMerchantsList(user);
    if(status){
      const response = await filterAllTheMerchant(merchantList);
      merchantData = response;
      premiumData = response?.smbData.concat(response?.entData)
    }
  }



//  const {smbData, entData, emergingData} = await ;
  // const preiumData = smbData?.concat(entData);  
  
  return (
    <div className={styles.container}>
      <Report smbEntMerchant = {premiumData} emergingMerchant={merchantData?.emergingData} />
    </div>
  );
};

export default Reports;

