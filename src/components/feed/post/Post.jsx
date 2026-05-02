"use client";
import Image from "next/image";
import styles from "./Post.module.scss";
import { SavedIcon } from "@/components/common/savedIcon/SavedIcon";
import { useRouter } from "next/navigation";
import { likePost, unlikePost } from "@/services/api";
import { useState } from "react";

export default function Post({ isTalent, data, imageH, showFooter }) {
  const router = useRouter()
  const ownerName = data?.owner
    ? `${data.owner.first_name} ${data.owner.last_name}`
    : "مجهول 212";
  const ownerImage = data?.owner?.image_url || "/images/avatar.png";
  const caption =
    data?.caption ||
    "أهم جزء من يومي مو بس التمرين… الأكل اللي يساعدني أكمّل مشواري كلاعب كرة قدم. 💪🔥 أركز دايمًا على البروتين، الخضار، وشرب الموية، لأن اللاعب اللي يهتم بصحته…";
  const title = data?.title;
  const mediaUrl = data?.image_url || data?.media_url || "/images/home/event.png";
  const date = data?.date
    ? (() => {
        const postDate = new Date(data.date);
        const now = new Date();
        const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
        if (diffInHours < 1) return "منذ دقائق";
        if (diffInHours < 24) return `منذ ${diffInHours} ساعات`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `منذ ${diffInDays} يوم`;
      })()
    : "منذ 3 ساعات";
  const category = data?.category?.name;

  const isVideo = mediaUrl?.match(/\.(mp4|webm|ogg|mov)$/i);
  const isPdf = mediaUrl?.match(/\.pdf$/i);
  const isImage = mediaUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  //states
  const [likeLoading, setLikeLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(data?.is_liked);
  const [likesCount, setLikesCount] = useState(data?.likes_count || 0);

  const handleLikePost = () => {
    setLikeLoading(true);
    if(isLiked) {
       unlikePost({ post_id: data?.id }).then((res) => {
        setLikeLoading(false);
        setIsLiked(false);
        setLikesCount(res?.likes_count)
      }).finally(() => {
        setLikeLoading(false);
      });
    } else {
      likePost(({ post_id: data?.id })).then((res) => {
        setLikeLoading(false);
        setIsLiked(true);
        setLikesCount(res?.likes_count)
      }).finally(() => {
        setLikeLoading(false);
      });
    }
  }

  return (
    <div className={styles.post}>
      <div className={styles.talentData}>
        <div className={styles.info}>
          <Image
            src={ownerImage}
            alt="User Avatar"
            width={50}
            height={50}
            className={styles.avatar}
          />
          <div>
            <h6 onClick={() => router.push(`/talents/${data?.owner?.id}`)}>{ownerName}</h6>
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
            style={{ width: "100%", objectFit: "contain", height: imageH }}
          >
            المتصفح لا يدعم عرض الفيديو
          </video>
        ) : (
          <Image
            src={mediaUrl}
            alt={title || "Post Image"}
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
            <div className={styles.reaction} 
              style={{
                filter: likeLoading ? "grayscale(100%)" : "none",
                cursor: likeLoading ? "not-allowed" : "pointer",
              }}
            onClick={handleLikePost}>
              <Image
                src={isLiked ? "/images/icons/fav.svg" : "/images/icons/outline-heart.svg"}
                alt="Like Icon"
                width={20}
                height={20}
                className={styles.icon}
              />
              <span>{likesCount}</span>
            </div>
            {/* <div className={styles.reaction}> */}
              {/* <Image
                src={
                  data?.is_saved
                    ? "/images/icons/saved.svg"
                    : "/images/icons/outline-save.svg"
                }
                alt="Like Icon"
                width={20}
                height={20}
                className={styles.icon}
              /> */}
              <SavedIcon isSaved={data?.is_saved} itemId={data?.id} itemType={1} bgColor={"#EEF8F6"} saveIcon="/images/icons/outline-save-2.svg"/>
            {/* </div> */}
          </div>
          {/* <div className={styles.sendContract}>
          {
            !isTalent && 
              <Button>أرسل عقد</Button>
          }
        </div> */}
        </div>
      )}
    </div>
  );
}
