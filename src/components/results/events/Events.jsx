'use client';
import styles from "./Events.module.scss";
import { Event } from "@/components/feed/event/Event";

export const Events = ({ data }) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className={styles.section}>
      <div className={styles.main}>
        {data?.map((obj, i) => {
          return <Event data={obj} key={i} w={isMobile ? "100%" : "49%"}/>;
        })}
      </div>
    </div>
  );
};
