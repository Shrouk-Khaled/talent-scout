"use client"
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { IoIosStar } from "react-icons/io";
import { getPrivacyPolicy } from "@/services/api";
import Loading from "../../loading";

export default function PolicesPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    getPrivacyPolicy()
      .then((res) => {
        setData(res);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`app-container marginTop ${styles.container}`}>
      {
        loading && <Loading/>
      }
    <div className={styles.info}>
      <div className={styles.title}>
        <IoIosStar />
        <h3>{data?.privacy_policy_title}</h3>
      </div>
      <p>{data?.privacy_policy_content}</p>
    </div>

    <div className={styles.info}>
      <div className={styles.title}>
        <IoIosStar />
        <h3>{data?.privacy_policy_scope_title}</h3>
      </div>
      <p> {data?.privacy_policy_scope_content_1}</p>
      <p> {data?.privacy_policy_scope_content_2}</p>
      <p>{data?.privacy_policy_scope_content_3}</p>
    </div>
  </div>
  );
}
