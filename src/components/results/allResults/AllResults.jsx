import Image from "next/image";
import Post from "../../feed/post/Post";
import Slider from "../../ui/slider/Slider";
import { Event } from "../../feed/event/Event";
import { Article } from "../../feed/article/Article";
import styles from "./AllResults.module.scss";
import { useEffect, useState } from "react";
import { homePageSections } from "@/services/api";
import { useSearchParams } from "next/navigation";
import { Loader } from "@/components/common/loader/Loader";

export const AllResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  //states
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    posts: [],
    talents: [],
    events: [],
    articles: [],
  });

  useEffect(() => {
    setLoading(true);
    const res = homePageSections({ search: query });
    res.then((response) => {
      setLoading(false);
      setData(response);
    });
  }, [searchParams, query]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {data?.posts?.data?.length > 0 && (
            <div className={styles.talents}>
              <Slider
                title="مواهب تلهمك"
                variant="default"
                showArrows={true}
                arrowPosition="side"
                rtl={true}
                gap={5}
                showViewAll="رؤية المزيد"
                viewAllText="رؤية المزيد"
                slidesPerView={3.5}
                onViewAllClick={() => console.log("View all clicked")}
              >
                {data?.posts?.data?.map((post, index) => (
                  <Post key={index} data={post} />
                ))}
              </Slider>
            </div>
          )}

          {data?.talents?.data?.length > 0 && (
            <div className={styles.section2}>
              <Slider
                title="الموهوبين"
                variant="default"
                showArrows={false}
                arrowPosition="side"
                rtl={true}
                gap={5}
                slidesPerView={7.5}
                onViewAllClick={() => console.log("View all clicked")}
              >
                {data?.talents?.data?.map((talent, index) => (
                  <div key={index} className={styles.talentBox}>
                    <Image
                      src={
                        talent?.user?.image_url || "/images/logo.png"
                      }
                      width={100}
                      height={100}
                      alt="user"
                      priority
                    />
                    <h2>
                      {talent?.user?.first_name?.substring(0, 10)}{" "}
                      {talent?.user?.last_name}
                    </h2>
                    <p>{talent?.user?.subcategory?.name}</p>
                  </div>
                ))}
              </Slider>
            </div>
          )}

          {data.events?.data?.length > 0 && (
            <div className={styles.eventsBox}>
              <Slider
                title="الفعاليات"
                variant="default"
                showArrows={true}
                arrowPosition="side"
                rtl={true}
                gap={5}
                showViewAll="رؤية المزيد"
                viewAllText="رؤية المزيد"
                slidesPerView={3.5}
                onViewAllClick={() => console.log("View all clicked")}
              >
                {data.events?.data?.map((obj, i) => {
                  return <Event key={i} data={obj} />;
                })}
              </Slider>
            </div>
          )}

          {data.articles?.data?.length > 0 && (
            <div className={styles.articles}>
              <Slider
                title="المقالات"
                variant="default"
                showArrows={true}
                arrowPosition="side"
                rtl={true}
                gap={5}
                autoplay
                showViewAll="رؤية المزيد"
                viewAllText="رؤية المزيد"
                slidesPerView={3.5}
                onViewAllClick={() => console.log("View all clicked")}
              >
                {data.articles?.data?.map((article, i) => {
                  return <Article key={article.id} data={article} />;
                })}
              </Slider>
            </div>
          )}
        </>
      )}
    </>
  );
};
