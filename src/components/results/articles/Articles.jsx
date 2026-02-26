import styles from "./Articles.module.scss";
import { Article } from "@/components/feed/article/Article";
import { Loader } from "@/components/common/loader/Loader";

export const Articles = ({ data }) => {
  return (
    <div className={styles.section}>
      <div className={styles.main}>
        {data?.length > 0 &&
          data?.map((obj, i) => {
            return <Article data={obj} key={i} />;
          })}
      </div>
    </div>
  );
};
