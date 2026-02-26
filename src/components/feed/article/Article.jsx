import Image from "next/image"
import styles from "./Article.module.scss"
import { useRouter } from "next/navigation";
import { SavedIcon } from "@/components/common/savedIcon/SavedIcon";

export const Article = ({ data }) => {
  const router = useRouter()
    const title = data?.title || "كيف تلاقي الرياضة اللي شبهك؟";
    const imageUrl = data?.image_url || "/images/home/event.png";
    const date = data?.date ? new Date(data.date).toLocaleDateString('ar-EG') : "13 نوفمبر، 2025";
    const category = data?.category?.name || "رياضة";

    const isVideo = imageUrl?.match(/\.(mp4|webm|ogg|mov)$/i);

    return (
        <div className={styles.article} onClick={() => router.push(`/articles/${data?.id}`)}>
        {isVideo ? (
          <video
            src={imageUrl}
            controls
            className={styles.eventImage}
            style={{ width: '100%', height: '280px', objectFit: 'cover' }}
          >
            المتصفح لا يدعم عرض الفيديو
          </video>
        ) : (
          <Image
            src={imageUrl}
            alt={title}
            width={310}
            height={172}
            className={styles.eventImage}
          />
        )}
        <div className={styles.save}>
          {/* <Image
            src={data?.is_saved ? "/images/icons/save3.svg" : "/images/icons/save2.svg"}
            alt="Like Icon"
            width={30}
            height={30}
            className={styles.icon}
          /> */}
          <SavedIcon isSaved={data?.is_saved || false} itemType={3} itemId={data?.id}/>
        </div>

        <div className={styles.info}>
          <div>
            <h1>{title}</h1>
            <div className={styles.date}>
              <p>{date}</p>
              <span className={styles.sport}>{category}</span>
            </div>
          </div>
        </div>
      </div>
    )
}