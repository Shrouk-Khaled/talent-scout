"use client";

import Image from "next/image";
import styles from "./page.module.scss";
import Button from "@/components/ui/button/Button";
import Post from "@/components/feed/post/Post";
import { useSearchParams } from "next/navigation";
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
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function TalentDetailsPage({ params }) {
  const t = useTranslations("talentDetails");

  const { id } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page");

  const userRole = useUserStore((state) => state.info)?.user?.user_role;
  const userAccess = useUserStore((state) => state.userData);
  console.log(userAccess)


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
    setLoading(true);

    getTalentById(id)
      .then((res) => {
        setTalent(res);
      })
      .catch((err) => {
        console.error("Get talent failed:", err);
      })
      .finally(() => {
        setLoading(false);
      });

    getPostsByUserId(id, {
      page: currentPage || 1,
    })
      .then((res) => {
        setPosts(res?.data || []);
        setPagination({
          page: res?.current_page || 1,
          total: res?.total_pages || 0,
        });
        setTotalPosts(res?.total_items || 0);
      })
      .catch((err) => {
        console.error("Get talent posts failed:", err);
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
        .then(() => {
          setTalent({
            ...talent,
            user: {
              ...talent?.user,
              is_following: false,
              followers: Math.max((talent?.user?.followers || 0) - 1, 0),
            },
          });

          notification.success({
            message: t("notifications.unfollowed"),
          });
        })
        .finally(() => {
          setFollowLoading(false);
        });

      return;
    }

    followUser({ user_id: talent?.user?.id })
      .then(() => {
        setTalent({
          ...talent,
          user: {
            ...talent?.user,
            is_following: true,
            followers: (talent?.user?.followers || 0) + 1,
          },
        });

        notification.success({
          message: t("notifications.followed"),
        });
      })
      .finally(() => {
        setFollowLoading(false);
      });
  };

  return (
    <div className={`${styles.container} app-container`}>
      {loading && <Loading />}

      <div className={styles.talentBox}>
        <Image
          src="/images/talent-cover.png"
          className={styles.talentImage}
          width={1000}
          height={221}
          alt={t("coverAlt")}
        />

        <div className={styles.talentInfo}>
          <div className={styles.left}>
            <Image
              src={talent?.user?.image_url || "/images/logo.png"}
              width={100}
              height={100}
              alt={t("profileImageAlt")}
            />

            <div>
              <h2>
                {talent?.user?.first_name} {talent?.user?.last_name}
              </h2>

              <p>{talent?.user?.short_bio}</p>
            </div>
          </div>

          <div className={styles.right}>
            {(userRole !== 1 && userAccess?.token_type === "FULL_ACCESS") && (
              <Button
                onClick={() => {
                  router.push(`/talents/contract/${id}`);
                }}
                icon={
                  <Image
                    src="/images/icons/connect.svg"
                    width={15}
                    height={15}
                    alt={t("connectIconAlt")}
                  />
                }
              >
                {t("connect")}
              </Button>
            )}

            <Button
              outline
              loading={followLoading}
              onClick={handleFollowAndUnfollow}
            >
              {talent?.user?.is_following ? t("unfollow") : t("follow")}
            </Button>
          </div>
        </div>

        <div className={styles.followers}>
          <div className={styles.info}>
            <h3>{t("following")}</h3>

            <div>
              <Image
                src="/images/icons/following.svg"
                width={20}
                height={20}
                alt={t("followingIconAlt")}
              />
              <span>{talent?.user?.following}</span>
            </div>
          </div>

          <div className={styles.info}>
            <h3>{t("followers")}</h3>

            <div>
              <Image
                src="/images/icons/followers.svg"
                width={20}
                height={20}
                alt={t("followersIconAlt")}
              />
              <span>{talent?.user?.followers}</span>
            </div>
          </div>

          <div className={styles.info}>
            <h3>{t("posts")}</h3>

            <div>
              <Image
                src="/images/icons/posts.svg"
                width={20}
                height={20}
                alt={t("postsIconAlt")}
              />
              <span>{totalPosts}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.posts}>
        {posts?.map((post) => (
          <Post key={post?.id} showFooter data={post} imageH={275} />
        ))}

        {pagination.total > 1 && (
          <div dir="ltr" className={styles.paginationBox}>
            <Pagination
              current={Number(pagination.page)}
              total={pagination.total * 10}
              onChange={handlePagination}
            />
          </div>
        )}
      </div>
    </div>
  );
}