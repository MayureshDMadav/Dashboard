import styles from "./report.module.css";

const WiprogressMerchant = ({ merchantData }) => {
  let count = 0;
  if (merchantData) {
    merchantData.forEach((data) => {
      count += Number.parseFloat(data.expectedarr) || 0;
    });
  }

  const uniqueCategories = [
    ...new Set(merchantData.map((val) => val.category)),
  ];

  return (
    <span>
      {merchantData && merchantData.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.smbentTable}>
            <thead>
              <tr>
                <td colSpan={4}>
                  {uniqueCategories.map((category, index) => (
                    <div className={styles.tableCategoryName} key={index}>
                      {category}
                    </div>
                  ))}
                </td>
              </tr>
              <tr>
                <th>Merchant Name</th>
                <th>Category</th>
                <th>Expected Arr</th>
                <th>Platform</th>
              </tr>
            </thead>
            <tbody>
              {merchantData.map((data) => (
                <tr>
                  <td>{data.merchantname}</td>
                  <td>{data.category}</td>
                  <td>{data.expectedarr}</td>
                  <td>{data.platform}</td>
                </tr>
              ))}
              <tr className={styles.lastRow}>
                <td>Grand Total</td>
                <td>
                  No. of merchants : {merchantData ? merchantData.length : 0}
                </td>
                <td colSpan={2}>{Number(count.toFixed(4))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </span>
  );
};

export default WiprogressMerchant;
