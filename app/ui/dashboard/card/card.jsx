import { MdSupervisedUserCircle } from "react-icons/md";
import styles from "./card.module.css";
import PopupComponent from "./popup";
const Card = ({ title, value, mode, noOfMerchant }) => {
  return (
    <div className={styles.container}>
      <MdSupervisedUserCircle size={24} />
      <div className={styles.texts}>
        <span className={styles.title}>{title}</span>
        <span className={styles.number}>{noOfMerchant}</span>
        {value.length <= 0 && (
          <span className={styles.detail}>
            <span className={styles.negative}>No Data to display</span>
          </span>
        )}
        {value.length > 0 && (
          <span className={styles.detail}>
            <span className={styles.positive}>{value.length}</span>{" "}
            {mode === "livedate"
              ? "gone live"
              : mode === "kickoff"
              ? "kick Off"
              : "targeted"}
            <PopupComponent merchantData={value} />
          </span>
        )}
      </div>
    </div>
  );
};

export default Card;
