"use client";
import { TalentsLine } from "@/components/common/talentsLine/TalentsLine";
import styles from "./page.module.scss";
import { Breadcrumb, message } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getEventById } from "@/services/api";
import Image from "next/image";
import Slider from "@/components/ui/slider/Slider";
import { Event } from "@/components/feed/event/Event";
import Loading from "@/app/[locale]/loading";
import { SavedIcon } from "@/components/common/savedIcon/SavedIcon";

export default function Page() {
  const { id } = useParams();
  const isMobile = (typeof window !== undefined) && window.innerWidth < 768;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  //message
  const [messageApi, contextHolder] = message.useMessage();


  useEffect(() => {
    getEventById(id).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    messageApi.open({
      type: "success",
      content: "تم نسخ رابط الفعالية",
    });
  }

  return (
    <div className={styles.container}>
      {contextHolder}
      <div className={styles.categories}>
        <TalentsLine />
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="app-container">
          <Breadcrumb
            items={[
              {
                title: "الرئيسية",
                href: "/feed",
              },
              {
                title: "الفعاليات",
                href: "/search?type=events",
              },
              {
                title: data?.title,
              },
            ]}
          />

          <div className={styles.main}>
            <div className={styles.actions}>
              <Image
                src="/images/icons/share.svg"
                alt="share"
                width={40}
                height={40}
                onClick={handleShareLink}
              />
              <SavedIcon isSaved={data?.is_saved} itemId={data?.id} itemType={2} bgColor={"#F3F3F3"} saveIcon={"/images/icons/outline-save-black.svg"} />

            </div>

            <Image
              src={data?.image_url || "/images/home/event.png"}
              alt="event image"
              priority
              width={200}
              height={430}
              className={styles.eventImage}
            />

            <div className={styles.cat}>{data?.category?.name}</div>

            <div className={styles.content}>
              <div className={styles.right}>
                <h1>{data?.title}</h1>
                <h3>عن الفعالية </h3>
                <p>{data?.description} </p>
              </div>
              <div className={styles.left}>
                <div className={styles.detailsBox}>
                  <div className={styles.boxHeader}>
                    <Image
                      src={"/images/icons/time.svg"}
                      alt="time"
                      width={40}
                      height={40}
                      priority
                    />
                    <h3>التاريخ والوقت</h3>
                  </div>
                  <div className={styles.date}>
                    <div className={styles.start}>
                      <p>يبدأ</p>
                      <h3>{data?.date?.split("T")?.[0]}</h3>
                      <h3>{data?.date?.split("T")?.[1]?.slice(0, 5)}</h3>
                    </div>
                    <div className={styles.end}>
                      <p>ينتهي</p>
                      <h3>{data?.end_date?.split("T")?.[0]}</h3>
                      <h3>{data?.end_date?.split("T")?.[1]?.slice(0, 5)}</h3>
                    </div>
                  </div>
                </div>
                <div className={styles.detailsBox}>
                  <div className={styles.boxHeader}>
                    <Image
                      src={"/images/icons/location.svg"}
                      alt="time"
                      width={40}
                      height={40}
                      priority
                    />
                    <h3>الموقع</h3>
                  </div>
                  <div className={styles.locationData}>
                    <p>المركز الثقافي الرياضي – القاهرة الجديدة</p>
                    Map
                  </div>
                </div>
              </div>
            </div>

            {data?.related_events?.length > 0 && (
              <div className={styles.relatedEvents}>
                <Slider
                  title="إنضم الى التجمعات المتاحة"
                  variant="default"
                  showArrows={true}
                  arrowPosition="side"
                  rtl={true}
                  gap={5}
                  autoplay
                  slidesPerView={isMobile ? 1.2 : 3.5}
                // onViewAllClick={() => router.push("/search?type=events")}
                >
                  {data?.related_events?.map((event, index) => (
                    <Event data={event} key={index} />
                  ))}
                </Slider>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
