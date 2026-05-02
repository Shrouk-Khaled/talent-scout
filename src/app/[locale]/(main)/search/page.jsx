"use client";

import { TalentsLine } from "@/components/common/talentsLine/TalentsLine";
import styles from "./page.module.scss";
import { Breadcrumb, Drawer, Pagination } from "antd";
import { useEffect, useState } from "react";
import { AllResults } from "@/components/results/allResults/AllResults";
import { Articles } from "@/components/results/articles/Articles";
import { Events } from "@/components/results/events/Events";
import { useSearchParams } from "next/navigation";
import { Posts } from "@/components/results/posts/Posts";
import { Talents } from "@/components/results/talents/Talents";
import Filter from "@/components/feed/filter/Filter";
import { Loader } from "@/components/common/loader/Loader";
import { getArticles, getEvents, getPosts, getTalents } from "@/services/api";
import Image from "next/image";
import { useLocale } from "next-intl";

const tabs = [
  { id: "all", name: "الكل" },
  { id: "posts", name: "المنشورات" },
  { id: "talents", name: "الموهوبين" },
  { id: "articles", name: "المقالات" },
  { id: "events", name: "الفعاليات" },
];

export default function SearchPage() {
  const locale = useLocale();
  const isRTL = locale == "ar";
  const searchParams = useSearchParams();
  const query = searchParams.get("type");
  const currentPage = searchParams.get("page");

  //states
  const [sectionType, setSectionType] = useState(query || "all");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filterObj, setFilterObj] = useState({
    sortBy: "",
    subCategory: "",
  });
  const [openFilter, setOpenFilter] = useState(false);
  const [isClearFilter, setIsClearFilter] = useState(false);

  //pagination states
  const [pagination, setPagination] = useState({
    page: searchParams.get("page") || 1,
    total: 50,
  });

  useEffect(() => {
    const subcategories = searchParams.get("subcategories") || "";
    const category = searchParams.get("category") || "";
    const searchValue = searchParams.get("q") || "";
    setSectionType(searchParams.get("type") || "all");
    const type = searchParams.get("type") || "all";
    if (type == "posts") {
      setLoading(true);
      getPosts({
        page: currentPage,
        sortby: searchParams.get("sortby"),
        category_id: category,
        sub_category: subcategories,
        search: searchValue,
      }).then((res) => {
        handleSaveData(res);
      });
    } else if (type == "articles") {
      setLoading(true);
      getArticles({
        page: currentPage,
        sortby: searchParams.get("sortby"),
        category_id: category,
        sub_category: subcategories,
        search: searchValue,
      }).then((res) => {
        handleSaveData(res);
      });
    } else if (type == "events") {
      setLoading(true);
      getEvents({
        page: currentPage,
        sortby: searchParams.get("sortby"),
        category_id: category,
        sub_category: subcategories,
        search: searchValue,
      }).then((res) => {
        handleSaveData(res);
      });
    } else if (type == "talents") {
      setLoading(true);
      getTalents({
        page: currentPage,
        sortby: searchParams.get("sortby"),
        category_id: category,
        sub_category: subcategories,
        search: searchValue,
      }).then((res) => {
        handleSaveData(res);
      });
    }
  }, [searchParams]);

  //add data into states
  const handleSaveData = (res) => {
    setPagination({ page: res?.current_page, total: res?.total_pages });
    setData(res?.data);
    setLoading(false);
  };

  //function
  const handleSectionTypeChange = (type) => {
    setSectionType(type);
    updateType(type);
    setIsClearFilter(true);
  };

  const updateType = (type) => {
    const searchParams = new URLSearchParams(window.location.search);

    searchParams.set("type", type);
    searchParams.set("page", 1);
    searchParams.delete("sortby");
    searchParams.delete("subcategories");

    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${searchParams.toString()}`
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const handleFilter = (filterData) => {
    setFilterObj(filterData);
    const searchParams = new URLSearchParams(window.location.search);

    // Handle subcategories
    if (filterData.subcategories) {
      searchParams.set("subcategories", filterData.subcategories);
    } else {
      searchParams.delete("subcategories");
    }

    if (filterData.sortby) {
      searchParams.set("sortby", filterData.sortby);
    } else {
      searchParams.delete("sortby");
    }

    searchParams.set("page", "1");
    setPagination({ ...pagination, page: 1 });

    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${searchParams.toString()}`
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className={styles.container}>
      <div className={styles.categories}>
        <TalentsLine />
      </div>
      <div className="app-container">
        <Breadcrumb
          items={[
            {
              title: "الصفحة الرئيسية",
            },
            {
              title: "البحث",
            },
          ]}
          className={styles.breadcrumb}
        />

        <h1 className={styles.results}>نتائج البحث</h1>

        <div className={`${styles.tabs} ${sectionType == "all" && styles.isAll}`}>
          {
            sectionType !== "all" &&
            (
              <Image
              src={"/images/icons/filter.svg"}
              onClick={() => setOpenFilter(true)}
              width={37}
              height={40}
              alt="pic"
              className={styles.filterIcon}
            />
            )
          }
         
          <div className={styles.allTabs}>
            {tabs.map((tab, i) => {
              return (
                <div
                  key={i}
                  className={`${styles.tab} ${
                    sectionType == tab.id && styles.active
                  }`}
                  onClick={() => {
                    handleSectionTypeChange(tab.id);
                  }}
                >
                  {tab.name}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.mainContent}>
          {loading ? (
            <div className={styles.main}>
              <Loader />
            </div>
          ) : (
            <>
              {!loading && data?.length == 0 && sectionType != "all" && (
                <div className={`${styles.noData} ${styles.main}`}>
                  <Image
                    src={"/images/no-data.png"}
                    width={350}
                    height={350}
                    alt="no-data"
                  />
                  <h1>ما فيه نتائج مطابقة</h1>
                  <p>ما لقينا نتائج حالياً، جرب خيارات بحث ثانية.</p>
                </div>
              )}

              {!loading && sectionType == "all" && (
                <div
                  className={styles.main}
                  style={{ width: sectionType == "all" && "100%" }}
                >
                  {sectionType == "all" && <AllResults />}
                </div>
              )}

              {!loading && data.length > 0 && (
                <div
                  className={styles.main}
                  style={{ width: sectionType == "all" && "100%" }}
                >
                  {sectionType == "articles" && <Articles data={data} />}
                  {sectionType == "events" && <Events data={data} />}
                  {sectionType == "posts" && <Posts data={data} />}
                  {sectionType == "talents" && <Talents data={data} />}
                  {sectionType !== "all" && (
                    <div dir="ltr" className={styles.paginationBox}>
                      <Pagination
                        defaultCurrent={pagination.page}
                        total={pagination.total * 10}
                        onChange={(page) => handlePagination(page)}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {sectionType !== "all" && (
            <div className={styles.filter}>
              <Filter
              clearFilters={isClearFilter}
                onFilter={(data) => {
                  handleFilter(data);
                  setIsClearFilter(false);
                }}
              />
            </div>
          )}

          <Drawer
            placement={!isRTL ? "right" : "left"}
            open={openFilter}
            onClose={() => setOpenFilter(false)}
            closable={false}
            width={340}
            styles={{
              header: { display: "none" },
              body: { padding: 0, fontFamily: "Alexandria-Regular" },
            }}
            className={styles.drawer}
            rootClassName={styles.drawerRoot}
          >
            <Filter clearFilters={isClearFilter} isDrawer={true} onFilter={(data) => {
              handleFilter(data)
              setOpenFilter(false)
              setIsClearFilter(false)
            }} />
          </Drawer>
        </div>
      </div>
    </div>
  );
}
