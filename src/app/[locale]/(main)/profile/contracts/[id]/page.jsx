"use client";

import Image from "next/image";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { getContractById } from "@/services/api";
import { useParams } from "next/navigation";
import Loading from "@/app/[locale]/loading";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("contract");

  const { id } = useParams();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContractById(id)
      .then((res) => {
        setData(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const getStatusClass = (status) => {
    switch (status) {
      case 1:
        return {
          class: styles.accepted,
          text: t("status.accepted"),
          image: "/images/icons/contract5.svg",
        };

      case 2:
        return {
          class: styles.rejected,
          text: t("status.rejected"),
          image: "/images/icons/contract4.svg",
        };

      case 3:
        return {
          class: styles.pending,
          text: t("status.pending"),
          image: "/images/icons/contract6.svg",
        };

      case 4:
        return {
          class: styles.rejected,
          text: t("status.cancelled"),
          image: "/images/icons/contract4.svg",
        };

      case 5:
        return {
          class: styles.accepted,
          text: t("status.completed"),
          image: "/images/icons/contract5.svg",
        };

      default:
        return {
          class: "",
          text: "",
          image: "/images/icons/contract6.svg",
        };
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 1:
        return t("type.fullTime");

      case 3:
        return t("type.partTime");

      case 4:
        return t("type.partnership");

      case 2:
        return t("type.freelance");

      case 5:
        return t("type.other");

      default:
        return "";
    }
  };

  return (
    <div className={`${styles.container} app-container`}>
      <h1>{t("details.title")}</h1>

      {loading && <Loading />}

      {!loading && (
        <div className={styles.details}>
          <div className={styles.info}>
            <div>
              <h3>{t("details.workDescription")}</h3>
              <p>{data?.description}</p>
            </div>

            {/* <div className={styles.contractDetails}>
              <h3>{t("details.title")}</h3>

              <div className={styles.infoBox}>
                <div className={styles.box}>
                  <Image
                    src="/images/icons/contract1.svg"
                    width={50}
                    height={50}
                    alt="amount"
                  />
                  <p>قيمة الطلب</p>
                  <h4>{data?.amount}</h4>
                </div>

                <div className={styles.box}>
                  <Image
                    src="/images/icons/contract2.svg"
                    width={50}
                    height={50}
                    alt="period"
                  />
                  <p>مدة العمل</p>
                  <h4>{data?.period}</h4>
                </div>

                <div className={styles.box}>
                  <Image
                    src="/images/icons/contract3.svg"
                    width={50}
                    height={50}
                    alt="type"
                  />
                  <p>نوع العمل</p>
                  <h4>{getTypeText(data?.type)}</h4>
                </div>
              </div>
            </div> */}
          </div>

          <div className={styles.talentInfo}>
            <div className={styles.talent}>
              <p>{t("details.sentTo")}</p>

              <div className={styles.talentData}>
                <Image
                  src={data?.receiver?.image_url || "/images/logo.png"}
                  width={50}
                  height={50}
                  alt={t("details.receiverImageAlt")}
                />

                <div>
                  <h3>
                    {data?.receiver?.first_name} {data?.receiver?.last_name}
                  </h3>
                </div>
              </div>

              <div className={styles.accountDetails}>
                {t("details.accountDetails")}
              </div>
            </div>

            <div
              className={`${styles.typeBox} ${
                getStatusClass(data?.status)?.class
              }`}
            >
              <div>
                <p>{t("details.requestStatus")}</p>
                <h3>{getStatusClass(data?.status)?.text}</h3>
              </div>

              <Image
                src={getStatusClass(data?.status)?.image}
                width={20}
                height={20}
                alt={t("details.statusImageAlt")}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}