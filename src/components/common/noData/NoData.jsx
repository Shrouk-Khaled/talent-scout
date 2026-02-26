import Image from "next/image";
import styles from "./NoData.module.scss";

export const NoData = ({ title }) => {
  return (
    <div className={`${styles.noData} ${styles.main}`}>
      <Image
        src={"/images/no-data2.png"}
        width={300}
        height={350}
        alt="no-data"
      />
      <h1>{title}</h1>
    </div>
  );
};
