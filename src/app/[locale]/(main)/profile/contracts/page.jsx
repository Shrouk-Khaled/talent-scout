"use client";
import { PageHeader } from "@/components/profile/pageHeader/PageHeader";
import styles from "./page.module.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getContracts } from "@/services/api";
import { useRouter } from "next/navigation";
import { NoData } from "@/components/common/noData/NoData";
import { Loader } from "@/components/common/loader/Loader";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    getContracts()
      .then((res) => {
        setLoading(false);
        setContracts(res?.data || []);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleContractClick = (id) => {
    router.push(`/profile/contracts/${id}`);
  };

  return (
    <div>
      <PageHeader
        title={"الطلبات"}
        desc={"تتبع حالة طلبات الخدمات المقدمة والمستلمة"}
      />

      <div className={styles.noData}>
        {(contracts?.length == 0 && !loading) && (
          <NoData title={"لا توجد طلبات حتى الآن"}/>
        )}
      </div>

    {
      (contracts?.length && !loading) > 0 && (
        <div className={styles.data}>
        {contracts?.map((contract, i) => (
          <div className={styles.contract} key={i} onClick={() => handleContractClick(contract?.id)}>
            <div className={styles.statusInfo}>
              <div className={`${styles.status} ${contract?.type == 1 ? styles.pending : contract?.type == 2 ? styles?.accepted : styles?.rejected}`}>
                <span>{contract?.status}</span>
              </div>
              <p>تم الإرسال {contract?.sended_at?.split("T")?.[0]}</p>
            </div>

            <div className={styles.talentInfo}>
              <div className={styles.details}>
                <Image
                  src={contract?.receiver?.image_url || "/images/logo.png"}
                  width={50}
                  height={50}
                  alt="pic"
                />
                <div>
                  <h3>تم إرسال الطلب الى</h3>
                  <p>{contract?.receiver?.first_name} {contract?.receiver?.last_name}</p>
                </div>
              </div>
              <div className={styles.info}>
                <p>{contract?.type == 1 ? "دوام كلي" : contract?.type == 3 ? "دوام جزئى" : contract?.type == 2 ? "عمل حر" : "اخري"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      )
    }

    {
      loading && <Loader/>
    }
    </div>
  );
}
