import { useEffect, useState } from "react";
import { uniqueDataHandlerArry } from "@/backend/backendservice";

const LiveMerchant = ({ merchantData, mode, type, styles, details, enablePagination }) => {
  const [merchants, setMerchants] = useState(
    merchantData?.length > 0 ? merchantData : []
  );
  const [expArr, setExpArr] = useState(null);
  const [platformData, setPlatformData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    setMerchants(merchantData?.length > 0 ? merchantData : []);
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
  const currentMerchants = enablePagination 
    ? merchants.slice(indexOfFirstMerchant, indexOfLastMerchant)
    : merchants;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue == "category") {
      let filteredMerchants = merchantData;
      setMerchants(filteredMerchants);
    }
    if (selectedValue == "SMB") {
      let filteredMerchants = merchantData.filter(
        (data) => data.category === "SMB"
      );
      setMerchants(filteredMerchants);
    }
    if (selectedValue == "ENT") {
      let filteredMerchants = merchantData.filter(
        (data) => data.category === "ENT"
      );
      setMerchants(filteredMerchants);
    }
    setCurrentPage(1);
  };

  return (
    <div className={styles.contianer}>
      {merchants.length > 0 && (
        <details className={styles.details} open={details}>
          <summary className={styles.header}>
            {mode && (
              <div className={styles.innerContent}>
                <h4> {mode} </h4>
                {type === "smbent" && (
                  <span className={styles.category}>
                    <select onChange={handleChange}>
                      <option value="category">Cateogry</option>
                      <option value="SMB">SMB</option>
                      <option value="ENT">ENT</option>
                    </select>
                  </span>
                )}
              </div>
            )}
          </summary>
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
                      <td>
                        {data.abpercentage !== "NA" ? data.abpercentage : "0%"}
                      </td>
                      <td>
                        {data.expectedarr !== "NA" ? data.expectedarr : 0}
                      </td>
                    </tr>
                  ))}
                  <tr className={styles.grandTotal}>
                    <td>Grand Total</td>
                    <td></td>
                    <td>{expArr}</td>
                  </tr>
                </tbody>
                {enablePagination && (
                <div className={styles.pagination}>
                  {Array.from(
                    { length: Math.ceil(merchants.length / itemsPerPage) },
                    (_, i) => (
                      <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className={
                          currentPage === i + 1 ? styles.activePage : ""
                        }
                      >
                        {i + 1}
                      </button>
                    )
                  )}
                </div>
              )}

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
                        <td>
                          {data.expectedarr !== "NA" ? data.expectedarr : 0}
                        </td>
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
        </details>
      )}
    </div>
  );
};

export default LiveMerchant;