import { MdSupervisedUserCircle } from "react-icons/md";
import styles from "./card.module.css";
const Card = ({title,value,mode,noOfMerchant}) => {
  return (
    <div className={styles.container}>
      <MdSupervisedUserCircle size={24} />
      <div className={styles.texts}>
        <span className={styles.title}>{title}</span>
        <span className={styles.number}>{noOfMerchant}</span>
        <span className={styles.detail}>
          <span className={styles.positive}>
          {value}
          </span>{" "}
          {mode === "livedate" ? "gone live so far" : mode === "kickoff"  ? "merchant in queue" : "targeted Merchant" }
        </span>
      </div>
    </div>
  );
};

export default Card;
