"use client";

import styles from "./page.module.scss";
import Filter from "@/components/feed/filter/Filter";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Drawer } from "antd";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import DownloadAppBox from "@/components/common/footer/DownloadApp";
import Slider from "../../../../components/ui/slider/Slider"
import CategoryCard from "@/components/feed/categoryCard/CategoryCard";
import Post from "@/components/feed/post/Post";
import { Event } from "@/components/feed/event/Event";
import { Article } from "@/components/feed/article/Article";
import { getAllCategories, homePageSections } from "@/services/api";
import Loading from "../../loading";
import { Link } from "@/i18n/navigation";
import { useHomeStore } from "@/store/useHome";
import { SavedIcon } from "@/components/common/savedIcon/SavedIcon";
import { useUserStore } from "@/store/useUserStore";

export default function Feed() {
  const t = useTranslations("feed");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const categories = useHomeStore((state) => state.categories);
  const saveCategories = useHomeStore((state) => state.setHomeData);
  const user = useUserStore((state) => state.info);

  const [openFilter, setOpenFilter] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  const [homeData, setHomeData] = useState({
    posts: { data: [] },
    events: { data: [] },
    articles: { data: [] },
    talents: { data: [] },
  });

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleGetHomeData = async () => {
    try {
      setLoading(true);

      const response = await homePageSections();

      if (response) {
        setHomeData(response);
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user-data") || "{}");
    const token = data?.state?.token;

    if (!token) {
      router.replace("/");
    } else {
      handleGetHomeData();
    }
  }, [router]);

  useEffect(() => {
    getAllCategories().then((res) => {
      saveCategories({
        categories:
          res?.filter(
            (obj) => obj?.participationTypeId === user?.talent_type?.id
          ) || [],
      });
    });
  }, [user]);

  return (
    <div>
      <div className={`${styles.container}`}>
        <div className={`app-container ${styles.main}`}>
          <DownloadAppBox />

          {/* Talents Categories Section */}
          <div className={styles.talentsBox}>
            <Slider
              title={t("exploreTalents")}
              variant="default"
              showArrows={false}
              arrowPosition="side"
              spaceBetween={5}
              autoplay
              slidesPerView={isMobileScreen ? 3.5 : 7.5}
              onViewAllClick={() => console.log("View all clicked")}
            >
              {categories?.length > 0 &&
                categories.map((category) => (
                  <CategoryCard
                    key={category?.id}
                    onClick={() => {
                      router.push(`/search?type=talents&category=${category.id}`);
                    }}
                    title={category?.name}
                    image={category?.imageUrl || "/images/logo.png"}
                  />
                ))}
            </Slider>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <>
              {/* Posts Section */}
              {homeData.posts?.data?.length > 0 && (
                <div className={styles.postsBox}>
                  <Slider
                    title={t("TalentInspired")}
                    variant="default"
                    showArrows={true}
                    arrowPosition="top"
                    gap={5}
                    showViewAll={t("viewMore")}
                    viewAllText={t("viewMore")}
                    slidesPerView={isMobileScreen ? 1.5 : 3.5}
                    onViewAllClick={() => router.push("/search?type=posts")}
                  >
                    {homeData.posts.data.map((post) => (
                      <Post key={post.id} data={post} showFooter />
                    ))}
                  </Slider>
                </div>
              )}

              {/* Events Section */}
              {homeData.events?.data?.length > 0 && (
                <div className={styles.eventsBox}>
                  <Slider
                    title={t("joinAvailable")}
                    variant="default"
                    showArrows={true}
                    arrowPosition="side"
                    gap={5}
                    showViewAll={t("viewMore")}
                    viewAllText={t("viewMore")}
                    slidesPerView={isMobileScreen ? 1.5 : 3.5}
                    onViewAllClick={() => router.push("/search?type=events")}
                  >
                    {homeData.events.data.map((event) => (
                      <Event key={event.id} data={event} />
                    ))}
                  </Slider>
                </div>
              )}

              {/* Articles Desktop Section */}
              <div className={styles.desctopView}>
                {homeData.articles?.data?.length > 0 && (
                  <div className={styles.articlesBox}>
                    <div className={styles.articlesHeader}>
                      <h1>{t("featuredArticlesForYou")}</h1>
                      <Link href="/search?type=articles">{t("viewMore")}</Link>
                    </div>

                    <div className={styles.articles}>
                     

                      <div className={styles.right}>
                        {homeData.articles.data.length > 0 && (
                          <div
                            className={styles.article}
                            onClick={() =>
                              router.push(
                                `/articles/${homeData.articles.data[0]?.id}`
                              )
                            }
                          >
                            <Image
                              src={
                                homeData.articles.data[0].image_url ||
                                "/images/home/event.png"
                              }
                              alt={t("articleImageAlt")}
                              width={600}
                              height={280}
                              className={styles.eventImage}
                            />

                            <div className={styles.save}>
                              <SavedIcon
                                isSaved={homeData.articles.data[0].is_saved}
                                itemId={homeData.articles.data[0].id}
                                itemType={3}
                              />
                            </div>

                            <div className={styles.info}>
                              <div>
                                <h1>{homeData.articles.data[0].title}</h1>

                                <div className={styles.date}>
                                  <p>
                                    {new Date(
                                      homeData.articles.data[0].date
                                    ).toLocaleDateString(
                                      isRTL ? "ar-EG" : "en-US"
                                    )}
                                  </p>

                                  <span className={styles.sport}>
                                    {homeData.articles.data[0].category.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className={styles.left}>
                        {homeData.articles.data.slice(1, 5).map((article) => (
                          <>
                          <Article key={article.id} data={article} />
                          </>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Articles Mobile Section */}
              <div className={styles.mobileView}>
                {homeData.articles?.data?.length > 0 && (
                  <div className={styles.articlesBox}>
                    <Slider
                      title={t("featuredArticles")}
                      variant="default"
                      showArrows={true}
                      arrowPosition="side"
                      spaceBetween={15}
                      showViewAll={t("viewMore")}
                      viewAllText={t("viewMore")}
                      slidesPerView={1.5}
                      onViewAllClick={() => router.push("/search?type=articles")}
                    >
                      {homeData.articles.data.map((article) => (
                        <Article
                          key={article.id}
                          data={article}
                          articleSlide={true}
                        />
                      ))}
                    </Slider>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <Drawer
          placement={isRTL ? "right" : "left"}
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
          <Filter />
        </Drawer>
      </div>
    </div>
  );
}