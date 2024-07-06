import { useEffect, useState } from "react";
import styles from "./pendingmerchants.module.css";
import { uniqueDataHandlerArry } from "@/backend/backendservice";

const PendingMerchants = ({ merchantData, mode }) => {
  const [merchants, setMerchants] = useState(merchantData);
  const [expArr, setExpArr] = useState(null);
  const [platformData, setPlatformData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); 

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue == "all") {
      setMerchants(merchantData);
    }
    if (selectedValue == "true") {
      let filteredMerchants = merchantData.filter((data) => data.mqm === true);
      setMerchants(filteredMerchants);
    }
    if (selectedValue == "false") {
      let filteredMerchants = merchantData.filter((data) => data.mqm === false);
      setMerchants(filteredMerchants);
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    if (merchantData && merchantData.length > 0) {
      setMerchants(merchantData);
    }
  }, [merchantData]);

  useEffect(() => {
    let count = 0;
    const totalExprectedArr = (arrayOfExpectedArr) => {
      arrayOfExpectedArr.forEach((data) => {
        count += Number.parseFloat(data.expectedarr) || 0;
      });
      return count.toFixed(3);
    };
    const totalValue = totalExprectedArr(merchants);
    async function fetchDataFromApi() {
      try {
        const platformData = await uniqueDataHandlerArry(merchants, "platform");
        const categoryData = await uniqueDataHandlerArry(merchants, "category");
        setPlatformData(platformData);
        setCategoryData(categoryData);
      } catch (e) {}
    }
    fetchDataFromApi();
    setExpArr(totalValue);
  }, [merchants]);


  const indexOfLastMerchant = currentPage * itemsPerPage;
  const indexOfFirstMerchant = indexOfLastMerchant - itemsPerPage;
  const currentMerchants = merchants.slice(indexOfFirstMerchant, indexOfLastMerchant);


  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.contianer}>
      {mode && (
        <div className={styles.header}>
          <h4> {mode} </h4>
          <span className={styles.mqmContainer}>
            <select onChange={handleChange}>
              <option value="all">Mint Qualified Merchant</option>
              <option value={true}>yes</option>
              <option value={false}>no</option>
            </select>
          </span>
        </div>
      )}

      {merchants.length > 0 ? (
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Merchant Name</th>
                <th>AB Ratio</th>
                <th>Expected Arr</th>
              </tr>
            </thead>
            <tbody>
              {currentMerchants.map((data, index) => (
                <tr key={index}>
                  <td>{data.merchantname}</td>
                  <td>{data.abpercentage}</td>
                  <td>{data.expectedarr !== "NA" ? data.expectedarr : 0}</td>
                </tr>
              ))}
              <tr className={styles.grandTotal}>
                <td>Grand Total</td>
                <td></td>
                <td>{expArr}</td>
              </tr>
            </tbody>
            <div className={styles.pagination}>
            {Array.from({ length: Math.ceil(merchants.length / itemsPerPage) }, (_, i) => (
              <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? styles.activePage : ''}>
                {i + 1}
              </button>
            ))}
          </div>
          </table>
          <table>
            <thead>
              <tr>
                <th>Platform</th>
                <th>#Merchant</th>
                <th>Expected Arr</th>
              </tr>
            </thead>
            <tbody>
              {platformData.length > 0 &&
                platformData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.platform}</td>
                    <td>{data.merchantCount}</td>
                    <td>{data.expectedarr !== "NA" ? data.expectedarr : 0}</td>
                  </tr>
                ))}
              <tr className={styles.grandTotal}>
                <td>Grand Total</td>
                <td>{merchants.length}</td>
                <td>{expArr}</td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>#Merchant</th>
                <th>Expected Arr</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.length > 0 &&
                categoryData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.platform}</td>
                    <td>{data.merchantCount}</td>
                    <td>{data.expectedarr}</td>
                  </tr>
                ))}
              <tr className={styles.grandTotal}>
                <td>Grand Total</td>
                <td>{merchants.length}</td>
                <td>{expArr}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        "No Data To Display"
      )}
    </div>
  );
};

export default PendingMerchants;