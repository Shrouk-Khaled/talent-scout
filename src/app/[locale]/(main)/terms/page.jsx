"use client";
import { getTermsAndConditions } from "@/services/api";
import styles from "./page.module.scss";
import { IoIosStar } from "react-icons/io";
import { useEffect, useState } from "react";
import Loading from "../../loading";

export default function TermsPage() {
  const [loading, setLoading] = useState(true);
  const [terms, setTerms] = useState(null);

  useEffect(() => {
    getTermsAndConditions()
      .then((res) => {
        setTerms(res);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`app-container marginTop ${styles.container}`}>
      {loading && <Loading />}
      <div className={styles.info}>
        <div className={styles.title}>
          <IoIosStar />
          <h3>{terms?.terms_conditions_title}</h3>
        </div>
        <p>{terms?.terms_conditions_content}</p>
      </div>

      <div className={styles.info}>
        <div className={styles.title}>
          <IoIosStar />
          <h3>{terms?.terms_conditions_scope_title}</h3>
        </div>
        <p> {terms?.terms_conditions_scope_content_1}</p>
        <p> {terms?.terms_conditions_scope_content_2}</p>
        <p>{terms?.terms_conditions_scope_content_3}</p>
      </div>
    </div>
  );
}
