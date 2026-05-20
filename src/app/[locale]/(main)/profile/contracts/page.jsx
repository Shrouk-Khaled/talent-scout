"use client";

import { PageHeader } from "@/components/profile/pageHeader/PageHeader";
import styles from "./page.module.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getContracts } from "@/services/api";
import { useSearchParams } from "next/navigation";
import { NoData } from "@/components/common/noData/NoData";
import { Loader } from "@/components/common/loader/Loader";
import { Pagination } from "antd";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("contract");

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page");

  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState([]);

  const [pagination, setPagination] = useState({
    page: currentPage || 1,
    total: 50,
  });

  useEffect(() => {
    setLoading(true);

    getContracts({
      page: currentPage || 1,
    })
      .then((res) => {
        setContracts(res?.data || []);

        setPagination({
          page: res?.current_page || 1,
          total: res?.total_pages || 0,
        });
      })
      .catch((err) => {
        console.error("Get contracts failed:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

  const handleContractClick = (id) => {
    router.push(`/profile/contracts/${id}`);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 1:
        return {
          class: styles.accepted,
          text: t("status.accepted"),
        };

      case 2:
        return {
          class: styles.rejected,
          text: t("status.rejected"),
        };

      case 3:
        return {
          class: styles.pending,
          text: t("status.pending"),
        };

      case 4:
        return {
          class: styles.rejected,
          text: t("status.cancelled"),
        };

      case 5:
        return {
          class: styles.accepted,
          text: t("status.completed"),
        };

      default:
        return {
          class: "",
          text: "",
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

  const handlePagination = (page) => {
    setPagination({ ...pagination, page });

    const searchParams = new URLSearchParams(window.location.search);

    if (page) {
      searchParams.set("page", page);
    } else {
      searchParams.delete("page");
    }

    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${searchParams.toString()}`
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <PageHeader
        title={t("page.title")}
        desc={t("page.description")}
      />

      <div className={styles.noData}>
        {contracts?.length === 0 && !loading && (
          <NoData title={t("page.noData")} />
        )}
      </div>

      {contracts?.length > 0 && !loading && (
        <>
          <div className={styles.data}>
            {contracts?.map((contract) => (
              <div
                className={styles.contract}
                key={contract?.id}
                onClick={() => handleContractClick(contract?.id)}
              >
                <div className={styles.statusInfo}>
                  <div
                    className={`${styles.status} ${
                      getStatusClass(contract?.status)?.class
                    }`}
                  >
                    <span>{getStatusClass(contract?.status)?.text}</span>
                  </div>

                  <p>
                    {t("page.sentAt", {
                      date: contract?.sended_at?.split("T")?.[0] || "",
                    })}
                  </p>
                </div>

                <div className={styles.talentInfo}>
                  <div className={styles.details}>
                    <Image
                      src={contract?.receiver?.image_url || "/images/logo.png"}
                      width={50}
                      height={50}
                      alt={t("page.receiverImageAlt")}
                    />

                    <div>
                      <h3>{t("page.sentTo")}</h3>

                      <p>
                        {contract?.receiver?.first_name}{" "}
                        {contract?.receiver?.last_name}
                      </p>
                    </div>
                  </div>

                  <div className={styles.info}>
                    <p>{getTypeText(contract?.type)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div dir="ltr" className={styles.paginationBox}>
            <Pagination
              current={Number(pagination.page)}
              total={pagination.total * 10}
              onChange={handlePagination}
            />
          </div>
        </>
      )}

      {loading && <Loader />}
    </div>
  );
}