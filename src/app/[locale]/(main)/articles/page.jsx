"use client";
import { TalentsLine } from "@/components/common/talentsLine/TalentsLine";
import styles from "./page.module.scss";
import { Breadcrumb, Pagination } from "antd";
import { Articles } from "@/components/results/articles/Articles";
import { useEffect, useState } from "react";
import { getArticles } from "@/services/api";
import { useSearchParams } from "next/navigation";

export default function Page() {
  //params
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page");
  const [loading, setLoading] = useState(false)

  //states
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: currentPage || 1,
    total: 50,
  });

  useEffect(() => {
    setLoading(true)
    getArticles({page: currentPage}).then((res) => {
      setData(res?.data);
      setPagination({ page: res?.current_page, total: res?.total_pages });
      setLoading(false)
    });
  }, [currentPage]);

  //functions
  const handlePagination = (page) => {
    setPagination({...pagination, page});
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
  }

  return (
    <div className={styles.container}>
      <TalentsLine />
      <div className="app-container">
        <Breadcrumb
          items={[
            {
              title: "الصفحة الرئيسية",
            },
            {
              title: "المقالات",
            },
          ]}
          className={styles.breadcrumb}
        />

        <div className={styles.content}>
          <Articles data={data} />

          <div dir="ltr" className={styles.paginationBox}>
            <Pagination
              defaultCurrent={pagination.page}
              total={pagination.total * 10}
              onChange={(page) => handlePagination(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
