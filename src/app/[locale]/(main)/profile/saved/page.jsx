"use client";
import { PageHeader } from "@/components/profile/pageHeader/PageHeader";
import styles from "./page.module.scss";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getMySaved } from "@/services/api";
import Post from "@/components/feed/post/Post";
import { NoData } from "@/components/common/noData/NoData";
import { Event } from "@/components/feed/event/Event";
import { Loader } from "@/components/common/loader/Loader";
import Image from "next/image";
import { SavedIcon } from "@/components/common/savedIcon/SavedIcon";
import { Pagination } from "antd";

const tabs = [
  { id: "posts", title: "المنشورات" },
  { id: "articles", title: "المقالات" },
  { id: "events", title: "الفعاليات" },
];

export default function Page() {
  const params = useSearchParams();
  //data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0 });

  useEffect(() => {
    const type = params.get("type");
    setLoading(true);
    getMySaved({
      itemType: type == "posts" ? 1 : type == "articles" ? 3 : 2,
    }).then((res) => {
      setLoading(false);
      setData(res?.[type]?.data);
      setPagination({
        page: res?.[type]?.current_page || 1,
        total: res?.[type]?.total_pages || 0,
      });
    });
  }, [params]);

  const updateRoute = (type) => {
    const sp = new URLSearchParams(params.toString());
    sp.set("type", type);
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${sp.toString()}`
    );
  };

  const handlePagination = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title={"العناصر المحفوظة"}
        desc={
          "هنا يمكنك الوصول بسرعة إلى المحتوى الذي قمت بحفظه لمراجعته في أي وقت."
        }
      />

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <div
            onClick={() => {
              updateRoute(tab.id);
              setData(null);
            }}
            key={tab.id}
            className={`${styles.tab} ${
              params.get("type") == tab.id && styles.active
            }`}
          >
            {tab.title}
          </div>
        ))}
      </div>

      <div className={styles.mainContent}>
        {loading && <Loader />}
        {!loading && data?.length == 0 && (
          <NoData title={"لا توجد عناصر محفوظة"} />
        )}
        {!loading && data?.length > 0 && (
          <>
            {params.get("type") == "posts" && (
              <div className={styles.posts}>
                {data?.map((post) => (
                  <Post key={post?.id} data={post} showFooter/>
                ))}
              </div>
            )}
            {params.get("type") == "articles" && (
              <div className={styles.articles}>
                {data?.map((article, i) => (
                  <div className={styles.article} key={i}>
                    <Image
                      src={article?.image_url || "/images/home/article.png"}
                      alt={article?.title}
                      width={600}
                      height={280}
                      className={styles.articleImage}
                    />
                    <div className={styles.info}>
                      <div>
                        <p>{article?.category?.name}</p>
                      </div>
                      <h1>{article?.title}</h1>
                      <p>{article?.description}</p>
                      <p>{article?.date?.split("T")?.[0]}</p>
                    </div>
                    <SavedIcon
                      isSaved={true}
                      itemType={3}
                      itemId={article?.id}
                    />
                  </div>
                ))}
              </div>
            )}
            {params.get("type") == "events" && (
              <div className={styles.events}>
                {data?.map((event) => (
                  <Event key={event?.id} data={{ ...event, is_saved: true }} />
                ))}
              </div>
            )}
          </>
        )}

        {pagination.total > 1 && (
          <div dir="ltr" className={styles.paginationBox}>
            <Pagination
              defaultCurrent={pagination.page}
              total={pagination.total * 10}
              onChange={(page) => handlePagination(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
