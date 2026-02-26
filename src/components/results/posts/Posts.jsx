import styles from "./Posts.module.scss";
import Post from "@/components/feed/post/Post";

export const Posts = ({ data }) => {
  return (
    <div className={styles.section}>
      <div className={styles.main}>
        {data?.map((obj, i) => {
          return <Post data={obj} key={i} imageH={300} showFooter/>;
        })}
      </div>
    </div>
  );
};
