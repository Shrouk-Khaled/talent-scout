import Image from "next/image";
import styles from "./Event.module.scss";
import { useRouter } from "@/i18n/navigation";
import { SavedIcon } from "@/components/common/savedIcon/SavedIcon";

export const Event = ({ data, w }) => {
  const router = useRouter();
  const title = data?.title || "يوم اكتشاف المواهب";
  const imageUrl = data?.image_url || "/images/home/event.png";
  const location = data?.location || "المركز الثقافي الرياضي – القاهرة الجديدة";

  const isVideo = imageUrl?.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    <div
      className={styles.event}
      onClick={() => router.push(`/events/${data?.id}`)}
      style={{ width: w }}
    >
      <div className={styles.imageBox}>
        {isVideo ? (
          <video
            src={imageUrl}
            controls
            className={styles.eventImage}
            style={{ width: "100%", height: "280px", objectFit: "cover" }}
          >
            المتصفح لا يدعم عرض الفيديو
          </video>
        ) : (
          <Image
            src={imageUrl}
            alt={title}
            width={600}
            height={280}
            className={styles.eventImage}
          />
        )}
        <div className={styles.save}>
        <SavedIcon isSaved={data?.is_saved || false} itemType={2} itemId={data?.id}/>
        </div>
      </div>

      <h1>{title}</h1>
      <div className={styles.location}>
        <Image
          src="/images/icons/map.svg"
          alt="Location Icon"
          width={20}
          height={20}
          className={styles.icon}
        />
        <p>{location}</p>
      </div>
    </div>
  );
};
