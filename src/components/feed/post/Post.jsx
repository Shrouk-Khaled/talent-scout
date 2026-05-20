"use client";

import Image from "next/image";
import styles from "./Post.module.scss";
import { SavedIcon } from "@/components/common/savedIcon/SavedIcon";
import { useRouter } from "@/i18n/navigation";
import { likePost, unlikePost } from "@/services/api";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function Post({ isTalent, data, imageH, showFooter }) {
  const t = useTranslations("post");

  const router = useRouter();

  const ownerName = data?.owner
    ? `${data.owner.first_name} ${data.owner.last_name}`
    : t("unknownOwner");

  const ownerImage = data?.owner?.image_url || "/images/avatar.png";

  const caption = data?.caption || t("defaultCaption");

  const title = data?.title;

  const mediaUrl =
    data?.image_url || data?.media_url || "/images/home/event.png";

  const date = data?.date
    ? (() => {
        const postDate = new Date(data.date);
        const now = new Date();

        const diffInHours = Math.floor(
          (now - postDate) / (1000 * 60 * 60)
        );

        if (diffInHours < 1) {
          return t("date.minutesAgo");
        }

        if (diffInHours < 24) {
          return t("date.hoursAgo", { count: diffInHours });
        }

        const diffInDays = Math.floor(diffInHours / 24);

        return t("date.daysAgo", { count: diffInDays });
      })()
    : t("date.default");

  const category = data?.category?.name;

  const isVideo = mediaUrl?.match(/\.(mp4|webm|ogg|mov)$/i);
  const isPdf = mediaUrl?.match(/\.pdf$/i);
  const isImage = mediaUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  const [likeLoading, setLikeLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(data?.is_liked);
  const [likesCount, setLikesCount] = useState(data?.likes_count || 0);

  const handleLikePost = () => {
    if (likeLoading) return;

    setLikeLoading(true);

    if (isLiked) {
      unlikePost({ post_id: data?.id })
        .then((res) => {
          setIsLiked(false);
          setLikesCount(res?.likes_count);
        })
        .finally(() => {
          setLikeLoading(false);
        });

      return;
    }

    likePost({ post_id: data?.id })
      .then((res) => {
        setIsLiked(true);
        setLikesCount(res?.likes_count);
      })
      .finally(() => {
        setLikeLoading(false);
      });
  };

  return (
    <div className={styles.post}>
      <div className={styles.talentData}>
        <div className={styles.info}>
          <Image
            src={ownerImage}
            alt={t("alt.userAvatar")}
            width={50}
            height={50}
            className={styles.avatar}
          />

          <div>
            <h6 onClick={() => router.push(`/talents/${data?.owner?.id}`)}>
              {ownerName}
            </h6>

            <p>{date}</p>
          </div>
        </div>

        {/* <div className={styles.personalTalent}>
          <p>موهبة شخصية</p>
        </div> */}
      </div>

      <div className={styles.content}>
        {/* {title && <h5>{title}</h5>} */}

        <div>
          <p>
            {caption}
            {/* <span>قراءة المزيد</span> */}
          </p>
        </div>

        {isVideo ? (
          <video
            src={mediaUrl}
            controls
            className={styles.postImage}
            style={{
              width: "100%",
              objectFit: "contain",
              height: imageH,
            }}
          >
            {t("videoNotSupported")}
          </video>
        ) : (
          <Image
            src={mediaUrl}
            alt={title || t("alt.postImage")}
            width={600}
            height={imageH || 280}
            style={{ height: imageH }}
            className={styles.postImage}
          />
        )}
      </div>

      {showFooter && (
        <div className={styles.postFooter}>
          <div className={styles.reactions}>
            <div
              className={styles.reaction}
              style={{
                filter: likeLoading ? "grayscale(100%)" : "none",
                cursor: likeLoading ? "not-allowed" : "pointer",
              }}
              onClick={handleLikePost}
            >
              <Image
                src={
                  isLiked
                    ? "/images/icons/fav.svg"
                    : "/images/icons/outline-heart.svg"
                }
                alt={t("alt.likeIcon")}
                width={20}
                height={20}
                className={styles.icon}
              />

              <span>{likesCount}</span>
            </div>

            <SavedIcon
              isSaved={data?.is_saved}
              itemId={data?.id}
              itemType={1}
              bgColor="#EEF8F6"
              saveIcon="/images/icons/outline-save-2.svg"
            />
          </div>

          {/* <div className={styles.sendContract}>
            {!isTalent && <Button>أرسل عقد</Button>}
          </div> */}
        </div>
      )}
    </div>
  );
}