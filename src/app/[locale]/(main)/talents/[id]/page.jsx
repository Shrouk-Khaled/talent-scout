"use client";
import Image from "next/image";
import styles from "./page.module.scss";
import Button from "@/components/ui/button/Button";
import Post from "@/components/feed/post/Post";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  followUser,
  getPostsByUserId,
  getTalentById,
  unfollowUser,
} from "@/services/api";
import Loading from "@/app/[locale]/loading";
import { Pagination, notification } from "antd";
import { useUserStore } from "@/store/useUserStore";

export default function TalentDetailsPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page");
  //user
  const userRole = useUserStore((state) => state.info)?.user?.user_role;

  //states
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [talent, setTalent] = useState(null);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [pagination, setPagination] = useState({
    page: currentPage || 1,
    total: 50,
  });

  useEffect(() => {
    getTalentById(id)
      .then((res) => {
        setTalent(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
    getPostsByUserId(id).then((res) => {
      setPosts(res?.data);
      setPagination({ page: res?.current_page, total: res?.total_pages });
      setTotalPosts(res?.total_items || 0);
    });
  }, [id, currentPage]);

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

  const handleFollowAndUnfollow = () => {
    setFollowLoading(true);
    if (talent?.user?.is_following) {
      unfollowUser({ user_id: talent?.user?.id })
        .then((res) => {
          setTalent({
            ...talent,
            user: { ...talent?.user, is_following: false, followers: talent?.user?.followers - 1 },
          });
          notification.success({
            message: "تم إلغاء المتابعة",
          });
        })
        .finally(() => setFollowLoading(false));
    } else {
      followUser({ user_id: talent?.user?.id })
        .then((res) => {
          setTalent({
            ...talent,
            user: { ...talent?.user, is_following: true, followers: talent?.user?.followers + 1 },
          });
          notification.success({
            message: "تم المتابعة",
          });
        })
        .finally(() => setFollowLoading(false));
    }
  };

  return (
    <div className={`${styles.container} app-container`}>
      {loading && <Loading />}
      <div className={styles.talentBox}>
        <Image
          src={"/images/talent-cover.png"}
          className={styles.talentImage}
          width={1000}
          height={221}
          alt="pic"
        />

        <div className={styles.talentInfo}>
          <div className={styles.left}>
            <Image
              src={talent?.user?.image_url || "/images/logo.png"}
              width={100}
              height={100}
              alt="pic"
            />
            <div>
              <h2>
                {talent?.user?.first_name} {talent?.user?.last_name}
              </h2>
              <p>{talent?.user?.short_bio}</p>
            </div>
          </div>
          <div className={styles.right}>
            {userRole != 1 && (
              <Button
                onClick={() => {
                  router.push(`/talents/contract/${id}`);
                }}
                icon={
                  <Image
                    src={"/images/icons/connect.svg"}
                    width={15}
                    height={15}
                    alt="pic"
                  />
                }
              >
                تواصل
              </Button>
            )}

            <Button
              outline
              loading={followLoading}
              onClick={handleFollowAndUnfollow}
            >
              {talent?.user?.is_following ? "إلغاء المتابعة" : "متابعة"}
            </Button>
          </div>
        </div>

        <div className={styles.followers}>
          <div className={styles.info}>
            <h3>المتابعون</h3>
            <div>
              <Image
                src={"/images/icons/following.svg"}
                width={20}
                height={20}
                alt="pic"
              />
              <span>{talent?.user?.following}</span>
            </div>
          </div>
          <div className={styles.info}>
            <h3>المتابعين</h3>
            <div>
              <Image
                src={"/images/icons/followers.svg"}
                width={20}
                height={20}
                alt="pic"
              />
              <span>{talent?.user?.followers}</span>
            </div>
          </div>
          <div className={styles.info}>
            <h3>المنشورات</h3>
            <div>
              <Image
                src={"/images/icons/posts.svg"}
                width={20}
                height={20}
                alt="pic"
              />
              <span>{totalPosts}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.posts}>
        {posts?.map((post, i) => (
          <Post key={i} showFooter data={post} imageH={275} />
        ))}

        <div dir="ltr" className={styles.paginationBox}>
          <Pagination
            defaultCurrent={pagination.page}
            total={pagination.total * 10}
            onChange={(page) => handlePagination(page)}
          />
        </div>
      </div>
    </div>
  );
}
