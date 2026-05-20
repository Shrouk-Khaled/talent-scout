"use client";

import { PageHeader } from "@/components/profile/pageHeader/PageHeader";
import { getMyPosts } from "@/services/api";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import Post from "@/components/feed/post/Post";
import { Loader } from "@/components/common/loader/Loader";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("profile");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    getMyPosts()
      .then((res) => {
        setData(res?.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <PageHeader
        title={t("posts.title")}
        desc={t("posts.description")}
      />

      <div className={styles.posts}>
        {loading ? (
          <Loader />
        ) : (
          data?.map((post) => (
            <Post
              data={post}
              key={post.id}
              imageH={275}
              showFooter={true}
            />
          ))
        )}
      </div>
    </div>
  );
}