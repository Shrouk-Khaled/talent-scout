"use client";
import { PageHeader } from "@/components/profile/pageHeader/PageHeader";
import styles from "./page.module.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getContracts } from "@/services/api";
import { useRouter, useSearchParams } from "next/navigation";
import { NoData } from "@/components/common/noData/NoData";
import { Loader } from "@/components/common/loader/Loader";
import { Pagination } from "antd";

export default function Page() {
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
        setLoading(false);
        setContracts(res?.data || []);
        setPagination({ page: res?.current_page, total: res?.total_pages });
      })
      .catch((err) => {
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
          text: "مقبول",
        };
      case 2:
        return {
          class: styles.rejected,
          text: "مرفوض",
        };
      case 3:
        return {
          class: styles.pending,
          text: "قيد الانتظار",
        };
      case 4:
        return {
          class: styles.rejected,
          text: "ملغي",
        };
      case 5:
        return {
          class: styles.accepted,
          text: "مكتمل",
        };
      default:
        return "";
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 1:
        return "دوام كلي";
      case 3:
        return "دوام جزئى";
      case 4:
        return "شراكة";
      case 2:
        return "عمل حر";
      case 5:
        return "أخرى";
      default:
        return "";
    }
  };

  //functions
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
        title={"الطلبات"}
        desc={"تتبع حالة طلبات الخدمات المقدمة والمستلمة"}
      />

      <div className={styles.noData}>
        {contracts?.length == 0 && !loading && (
          <NoData title={"لا توجد طلبات حتى الآن"} />
        )}
      </div>

      {(contracts?.length && !loading) > 0 && (
        <>
          <div className={styles.data}>
            {contracts?.map((contract, i) => (
              <div
                className={styles.contract}
                key={i}
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
              defaultCurrent={pagination.page}
              total={pagination.total * 10}
              onChange={(page) => handlePagination(page)}
            />
          </div>
        </>
      )}

      {loading && <Loader />}
    </div>
  );
}
