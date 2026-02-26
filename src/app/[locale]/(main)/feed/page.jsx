// "use client";
// import styles from "./page.module.scss";
// import Filter from "@/components/feed/filter/Filter";
// import Input from "@/components/ui/input/Input";
// import { FiSearch } from "react-icons/fi";
// import Image from "next/image";
// import { FaFilter } from "react-icons/fa";
// import { useEffect, useState } from "react";
// import { Drawer } from "antd";
// import { useLocale } from "next-intl";
// import { useRouter } from "next/navigation";
// import DownloadAppBox from "@/components/common/footer/DownloadApp";
// import Slider from "@/components/ui/slider/Slider";
// import CategoryCard from "@/components/feed/categoryCard/CategoryCard";
// import Post from "@/components/feed/post/Post";
// import { Event } from "@/components/feed/event/Event";
// import { TalentsLine } from "@/components/common/talentsLine/TalentsLine";
// import { Article } from "@/components/feed/article/Article";
// import { homePageSections } from "@/services/api";

// export default function Feed() {
//   const locale = useLocale();
//   const isRTL = locale == "ar";
//   const [openFilter, setOpenFilter] = useState(false);

//   const router = useRouter();

//   const handleGetHomeData = () => {
//     const data = homePageSections();
//     console.log(data);
//   }

//   useEffect(() => {
//     const data = JSON.parse(localStorage.getItem("user-data"));
//     const token = data?.state?.token;
//     if (!token) router.replace("/");
//     handleGetHomeData()
//   }, [router]);

//   return (
//     <div>
//       <div className={`${styles.container} `}>
//         <div className={styles.search}>
//           <Input
//             placeholder="ابحث عن موهبة، براءة إختراع، فكرة مشروع ..."
//             className={styles.input}
//             suffix={<FiSearch />}
//           />
//           <span
//             className={styles.filterIcon}
//             onClick={() => setOpenFilter(true)}
//           >
//             <FaFilter className={styles.icon} />
//           </span>
//         </div>
//         <TalentsLine />
//         <div className="app-container" style={{marginTop: "80px"}}>
//           <DownloadAppBox />

//           <div className={styles.talentsBox}>
//             <Slider
//               title="إكتشف أبرز المواهب"
//               variant="default"
//               showArrows={false}
//               arrowPosition="side"
//               rtl={true}
//               gap={5}
//               autoplay
//               slidesPerView={7.5}
//               onViewAllClick={() => console.log("View all clicked")}
//             >
//               <CategoryCard title={"رياضة"} image={"/images/home/talent.png"} />
//               <CategoryCard title={"رياضة"} image={"/images/home/talent.png"} />
//               <CategoryCard title={"رياضة"} image={"/images/home/talent.png"} />
//               <CategoryCard title={"رياضة"} image={"/images/home/talent.png"} />
//               <CategoryCard title={"رياضة"} image={"/images/home/talent.png"} />
//               <CategoryCard title={"رياضة"} image={"/images/home/talent.png"} />
//               <CategoryCard title={"رياضة"} image={"/images/home/talent.png"} />
//               <CategoryCard title={"رياضة"} image={"/images/home/talent.png"} />
//               <CategoryCard title={"رياضة"} image={"/images/home/talent.png"} />
//               <CategoryCard title={"رياضة"} image={"/images/home/talent.png"} />
//               <CategoryCard title={"رياضة"} image={"/images/home/talent.png"} />
//               <CategoryCard title={"رياضة"} image={"/images/home/talent.png"} />
//               <CategoryCard title={"رياضة"} image={"/images/home/talent.png"} />
//             </Slider>
//           </div>

//           <div className={styles.postsBox}>
//             <Slider
//               title="مواهب تلهمك"
//               variant="default"
//               showArrows={true}
//               arrowPosition="side"
//               rtl={true}
//               gap={5}
//               showViewAll="رؤية المزيد"
//               viewAllText="رؤية المزيد"
//               slidesPerView={3.5}
//               onViewAllClick={() => console.log("View all clicked")}
//             >
//               <Post />
//               <Post />
//               <Post />
//               <Post />
//               <Post />
//             </Slider>
//           </div>

//           <div className={styles.eventsBox}>
//             <Slider
//               title="إنضم الى التجمعات المتاحة"
//               variant="default"
//               showArrows={false}
//               arrowPosition="side"
//               rtl={true}
//               gap={5}
//               autoplay
//               slidesPerView={3.5}
//               onViewAllClick={() => console.log("View all clicked")}
//             >
//               <Event />
//               <Event />
//               <Event />
//               <Event />
//               <Event />
//               <Event />
//               <Event />
//             </Slider>
//           </div>

//           <div className={styles.articlesBox}>
//             <h1>مقالات مميزة لك</h1>
//             <div className={styles.articles}>
//               <div className={styles.left}>
//                 <Article/>
//                 <Article/>
//                 <Article/>
//                 <Article/>
//               </div>
//               <div className={styles.right}>
//                 <div className={styles.article}>
//                   <Image
//                     src="/images/home/event.png"
//                     alt="Event Image"
//                     width={600}
//                     height={280}
//                     className={styles.eventImage}
//                   />
//                   <div className={styles.save}>
//                     <Image
//                       src="/images/icons/save2.svg"
//                       alt="Like Icon"
//                       width={30}
//                       height={30}
//                       className={styles.icon}
//                     />
//                   </div>

//                   <div className={styles.info}>
//                     <div>
//                       <h1>كيف تلاقي الرياضة اللي شبهك؟</h1>
//                       <div className={styles.date}>
//                         <p>13 نوفمبر، 2025 | 4 دقائق</p>
//                         <span className={styles.sport}>رياضة</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <Drawer
//           placement={isRTL ? "right" : "left"}
//           open={openFilter}
//           onClose={() => setOpenFilter(false)}
//           closable={false}
//           width={340} // <— tweak to your design
//           styles={{
//             header: { display: "none" },
//             body: { padding: 0, fontFamily: "Alexandria-Regular" },
//           }}
//           className={styles.drawer} // panel
//           rootClassName={styles.drawerRoot} // wrapper
//         >
//           <Filter />
//         </Drawer>
//       </div>
//     </div>
//   );
// }


"use client";
import styles from "./page.module.scss";
import Filter from "@/components/feed/filter/Filter";
import Input from "@/components/ui/input/Input";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import { FaFilter } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Drawer } from "antd";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import DownloadAppBox from "@/components/common/footer/DownloadApp";
import Slider from "@/components/ui/slider/Slider";
import CategoryCard from "@/components/feed/categoryCard/CategoryCard";
import Post from "@/components/feed/post/Post";
import { Event } from "@/components/feed/event/Event";
import { TalentsLine } from "@/components/common/talentsLine/TalentsLine";
import { Article } from "@/components/feed/article/Article";
import { homePageSections } from "@/services/api";
import Loading from "../../loading";
import Link from "next/link";
import { useHomeStore } from "@/store/useHome";
import { SavedIcon } from "@/components/common/savedIcon/SavedIcon";

export default function Feed() {
  const locale = useLocale();
  const isRTL = locale == "ar";
  const categories = useHomeStore((state) => state.categories);

  const [openFilter, setOpenFilter] = useState(false);
  const [homeData, setHomeData] = useState({
    posts: { data: [] },
    events: { data: [] },
    articles: { data: [] },
    talents: { data: [] }
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
  }

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user-data"));
    const token = data?.state?.token;
    if (!token) router.replace("/");
    else handleGetHomeData();
  }, [router]);

  return (
    <div>
      <div className={`${styles.container} `}>
        <div className={styles.search}>
          <Input
            placeholder="ابحث عن موهبة، براءة إختراع، فكرة مشروع ..."
            className={styles.input}
            suffix={<FiSearch />}
          />
          <span
            className={styles.filterIcon}
            onClick={() => setOpenFilter(true)}
          >
            <FaFilter className={styles.icon} />
          </span>
        </div>
        <TalentsLine />
        <div className="app-container" style={{ marginTop: "80px" }}>
          <DownloadAppBox />

          {/* Talents Categories Section */}
          <div className={styles.talentsBox}>
            <Slider
              title="إكتشف أبرز المواهب"
              variant="default"
              showArrows={false}
              arrowPosition="side"
              rtl={true}
              gap={5}
              autoplay
              slidesPerView={7.5}
              onViewAllClick={() => console.log("View all clicked")}
            >
              {categories?.length > 0 && (
                categories?.map((category) => (
                  <CategoryCard
                    key={category?.id}
                    title={category?.name}
                    image={category?.imageUrl || "/images/logo.png"}
                  />
                ))
              )}
            </Slider>
          </div>

          {
            loading ?
              <Loading /> :
              <>
                {/* Posts Section */}
                {
                  homeData.posts?.data?.length > 0 &&
                  <div className={styles.postsBox}>
                  <Slider
                    title="مواهب تلهمك"
                    variant="default"
                    showArrows={true}
                    arrowPosition="top"
                    rtl={true}
                    gap={5}
                    showViewAll="رؤية المزيد"
                    viewAllText="رؤية المزيد"
                    slidesPerView={3.5}
                    onViewAllClick={() => router.push("/search?type=posts")}
                  >
                    {homeData.posts?.data?.length > 0 && (
                      homeData.posts.data.map((post) => (
                        <Post
                          key={post.id}
                          data={post}
                        />
                      ))
                    )}
                  </Slider>
                </div>
                }
               

                {/* Events Section */}
                {
                  homeData.events?.data?.length > 0 &&
                  <div className={styles.eventsBox}>
                  <Slider
                    title="إنضم الى التجمعات المتاحة"
                    variant="default"
                    showArrows={true}
                    arrowPosition="side"
                    rtl={true}
                    gap={5}
                    showViewAll="رؤية المزيد"
                    viewAllText="رؤية المزيد"
                    slidesPerView={3.5}
                    onViewAllClick={() => router.push("/search?type=events")}
                  >
                    {loading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <Event key={index} />
                      ))
                    ) : homeData.events?.data?.length > 0 ? (
                      homeData.events.data.map((event) => (
                        <Event
                          key={event.id}
                          data={event}
                        />
                      ))
                    ) : (
                      <Event />
                    )}
                  </Slider>
                </div>

                }
             
                {/* Articles Section */}
                {
                  homeData.articles?.data?.length > 0 &&
                  <div className={styles.articlesBox}>
                    <div className={styles.articlesHeader}>
                      <h1>مقالات مميزة لك</h1>
                      <Link href={"/search?type=articles"}>رؤية المزيد</Link>
                    </div>
                    <div className={styles.articles}>
                      <div className={styles.left}>
                        {homeData.articles?.data?.length > 0 && (
                          homeData.articles.data.slice(0, 4).map((article) => (
                            <Article
                              key={article.id}
                              data={article}
                            />
                          ))
                        )}
                      </div>
                      <div className={styles.right}>
                        {homeData.articles?.data?.length > 4 && (
                          <div className={styles.article} onClick={() => router.push(`/articles/${homeData.articles.data[4]?.id}`)}>
                            <Image
                              src={homeData.articles.data[4].image_url || "/images/home/event.png"}
                              alt="Event Image"
                              width={600}
                              height={280}
                              className={styles.eventImage}
                            />
                            <div className={styles.save}>
                              <SavedIcon isSaved={homeData.articles.data[4].is_saved} itemId={homeData.articles.data[4].id} itemType={3} />
                            </div>

                            <div className={styles.info}>
                              <div>
                                <h1>{homeData.articles.data[4].title}</h1>
                                <div className={styles.date}>
                                  <p>{new Date(homeData.articles.data[4].date).toLocaleDateString('ar-EG')}</p>
                                  <span className={styles.sport}>{homeData.articles.data[4].category.name}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                }

              </>
          }
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