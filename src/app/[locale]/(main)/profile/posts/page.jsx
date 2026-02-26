"use client";
import { PageHeader } from "@/components/profile/pageHeader/PageHeader";
import { getMyPosts } from "@/services/api";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import Post from "@/components/feed/post/Post";
import { Loader } from "@/components/common/loader/Loader";

export default function Page() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMyPosts().then((res) => {
      setData(res?.data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <PageHeader
        title={"منشوراتي"}
        desc={"جميع المنشورات التي قمت بنشرها تظهر هنا."}
      />

      <div className={styles.posts}>
        {loading ? (
          <Loader />
        ) : (
          data?.map((post) => (
            <Post data={post} key={post.id} imageH={275} showFooter={true} />
          ))
        )}
      </div>
    </div>
  );
}
