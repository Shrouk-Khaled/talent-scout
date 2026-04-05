"use client";
import { TalentsLine } from "@/components/common/talentsLine/TalentsLine";
import styles from "./page.module.scss";
import { Breadcrumb, message } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getArticleById } from "@/services/api";
import { useParams } from "next/navigation";
import Loading from "@/app/[locale]/loading";
import { SavedIcon } from "@/components/common/savedIcon/SavedIcon";

export default function page() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  //message
  const [messageApi, contextHolder] = message.useMessage();


  useEffect(() => {
    getArticleById(id).then((res) => {
      setData(res);
      setLoading(false);
      setCreatedAt(
        data?.date
          ? new Date(data.date).toLocaleDateString("ar-EG")
          : "13 نوفمبر، 2025"
      );
    });
  }, []);

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    messageApi.open({
      type: "success",
      content: "تم نسخ رابط المقالة",
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
                title: "المقالات",
                href: "/search?type=articles",
              },
              {
                title: data?.title,
              },
            ]}
            className={styles.breadcrumb}
          />

          <div className={styles.main}>
            <div className={styles.header}>
              <div></div>
              <div className={styles.titles}>
                <h1>{data?.title}</h1>
                <p>{data?.date?.split("T")?.[0]} | {data?.date?.split("T")?.[1]?.split(".")?.[0]}</p>
                <div>
                  <p>{data?.category?.name}</p>
                </div>
              </div>
              <div className={styles.actions}>
                <Image
                  src="/images/icons/share.svg"
                  alt="share"
                  width={40}
                  height={40}
                  onClick={handleShareLink}
                />
                {/* <Image
                  src="/images/icons/save4.svg"
                  alt="share"
                  width={40}
                  height={40}
                /> */}
                <SavedIcon isSaved={data?.is_saved} itemId={data?.id} itemType={3} bgColor={"#F3F3F3"} saveIcon={"/images/icons/outline-save-black.svg"}/>
              </div>
            </div>

            <div className={styles.content}>
              {data?.image_url && (
                <Image
                  src={data?.image_url}
                  alt={data?.title}
                  width={800}
                  height={400}
                  className={styles.mainImage}
                />
              )}
            </div>

            <div className={styles.content}>
              {data?.sections?.map((obj, i) => {
                return (
                  <div className={styles.section} key={i}>
                    {obj?.video_url ? (
                      <video
                        src={obj?.video_url}
                        controls
                        className={styles.mainImage}
                        style={{
                          width: "100%",
                          height: "400px",
                          objectFit: "cover",
                        }}
                      >
                        المتصفح لا يدعم عرض الفيديو
                      </video>
                    ) : (
                      <Image
                        src={obj?.image_url || "/images/home/event.png"}
                        alt={obj?.title}
                        width={800}
                        height={400}
                        className={styles.mainImage}
                      />
                    )}

                    <h1>{obj?.title}</h1>
                    <p>{obj?.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
