"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ReelsViewer.module.scss";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { SavedIcon } from "@/components/common/savedIcon/SavedIcon";
import { IoIosArrowDropup, IoIosArrowDropdown } from "react-icons/io";
import { getReels, likePost, unlikePost } from "@/services/api";

export default function ReelsViewer({ onClose }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [videos, setVideos] = useState([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressMap, setProgressMap] = useState({});
  //like states
  const [likeLoading, setLikeLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(null);
  const [likesCount, setLikesCount] = useState(null);

  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const videoRefs = useRef([]);

  const requestedPagesRef = useRef(new Set());
  const lastLoadedPageRef = useRef(0);
  const initialLoadDoneRef = useRef(false);

  const fetchReels = useCallback(async (pageToLoad) => {
    if (isFetching) return;
    if (!hasMore && pageToLoad !== 1) return;
    if (requestedPagesRef.current.has(pageToLoad)) return;

    requestedPagesRef.current.add(pageToLoad);
    setIsFetching(true);

    try {
      const result = await getReels({ page: pageToLoad });

      const reelsData = result?.data || [];
      const currentPage = result?.current_page || pageToLoad;
      const perPage = result?.per_page || reelsData.length || 0;

      setVideos((prev) => {
        const prevIds = new Set(
          prev
            .map((item, index) => item?.id ?? `fallback-${index}-${item?.media_url ?? ""}`)
        );

        const newItems = reelsData.filter((item, index) => {
          const key = item?.id ?? `fallback-new-${index}-${item?.media_url ?? ""}`;
          return !prevIds.has(key);
        });

        // لو أول تحميل وعندك initialVideo، ضيفي الجديد بس من غير تكرار
        if (pageToLoad === 1) {
          return prev.length ? [...prev, ...newItems] : newItems;
        }

        return [...prev, ...newItems];
      });

      setPage(currentPage);
      lastLoadedPageRef.current = currentPage;

      // hasMore تبقى true فقط لو الصفحة رجعت عناصر كفاية
      // وكمان لو مفيش عناصر جديدة خالص، اقفليها
      setHasMore(reelsData.length > 0 && reelsData.length >= perPage);
    } catch (error) {
      console.error("Fetch reels error:", error);
      requestedPagesRef.current.delete(pageToLoad);
    } finally {
      setIsFetching(false);
    }
  }, [getReels, hasMore, isFetching]);

  const goToIndex = useCallback(
    (nextIndex) => {
      if (nextIndex < 0 || nextIndex >= videos.length) return;

      const target = itemRefs.current[nextIndex];
      if (!target) return;

      setActiveIndex(nextIndex);
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [videos.length]
  );

  const formatTime = (time) => {
    if (!time || Number.isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // أول تحميل مرة واحدة فقط
  useEffect(() => {
    if (!mounted) return;
    if (initialLoadDoneRef.current) return;

    initialLoadDoneRef.current = true;
    fetchReels(1);
  }, [mounted, fetchReels]);

  useEffect(() => {
    if (!mounted) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        goToIndex(activeIndex + 1);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        goToIndex(activeIndex - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mounted, activeIndex, goToIndex, onClose]);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestIndex = activeIndex;
        let bestRatio = 0;

        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index || 0);

          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIndex = index;
          }
        });

        if (bestIndex !== activeIndex) {
          setActiveIndex(bestIndex);
        }
      },
      {
        root: containerRef.current,
        threshold: [0.4, 0.6, 0.8, 1],
      }
    );

    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      observer.disconnect();
    };
  }, [mounted, videos.length, activeIndex]);

  // تشغيل الفيديوهات فقط
  useEffect(() => {
    if (!mounted) return;

    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === activeIndex) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } else {
        video.pause();
      }
    });
  }, [mounted, activeIndex, videos.length]);

  // infinite scroll فقط
  useEffect(() => {
    if (!mounted) return;
    if (isFetching || !hasMore) return;

    const remaining = videos.length - activeIndex - 1;
    if (remaining > 2) return;

    const nextPage = lastLoadedPageRef.current + 1;
    fetchReels(nextPage);
  }, [mounted, activeIndex, videos.length, hasMore, isFetching, fetchReels]);

  if (!mounted) return null;

  const handleLikePost = (item) => {
    setLikeLoading(true);
    if(item?.is_liked) {
       unlikePost({ post_id: item?.id }).then((res) => {
        setLikeLoading(false);
        setVideos((prev) =>
          prev.map((video) =>
            video.id === item.id ? { ...video, is_liked: false, likes_count: res?.likes_count } : video
          )
        );
      }).finally(() => {
        setLikeLoading(false);
      });
    } else {
      likePost(({ post_id: item?.id })).then((res) => {
        setLikeLoading(false);
        setVideos((prev) =>
          prev.map((video) =>
            video.id === item.id ? { ...video, is_liked: true, likes_count: res?.likes_count } : video
          )
        );
      }).finally(() => {
        setLikeLoading(false);
      });
    }
  }


  return (
    <ReelsPortal>
      <div className={styles.overlay}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={() => {
            onClose?.();
            router.push("/feed");
          }}
        >
          <Image
            src={"/images/icons/close.svg"}
            alt="close icons"
            width={34}
            height={34}
          />
        </button>

        <div className={styles.reelsContainer} ref={containerRef}>
          {videos.map((item, index) => (
            <div
              key={item.id || `${item.media_url}-${index}`}
              className={styles.reelItem}
              data-index={index}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
            >
              <div className={styles.videoContainer}>
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={item?.media_url}
                  className={styles.video}
                  playsInline
                  // muted
                  autoPlay
                  loop
                  controls={true}
                  preload={index === activeIndex ? "auto" : "metadata"}
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget;
                    const duration = video.duration || 0;

                    setProgressMap((prev) => ({
                      ...prev,
                      [index]: {
                        currentTime: 0,
                        duration,
                        percentage: 0,
                      },
                    }));
                  }}
                  onTimeUpdate={(e) => {
                    const video = e.currentTarget;
                    const currentTime = video.currentTime || 0;
                    const duration = video.duration || 0;
                    const percentage = duration ? (currentTime / duration) * 100 : 0;

                    setProgressMap((prev) => ({
                      ...prev,
                      [index]: {
                        currentTime,
                        duration,
                        percentage,
                      },
                    }));
                  }}
                />

                {/* <div className={styles.videoProgress} dir="ltr">
                  <div
                    className={styles.videoProgressFill}
                    style={{
                      width: `${progressMap[index]?.percentage || 0}%`,
                    }}
                  />
                </div>

                <div className={styles.videoTime} dir="ltr">
                  {formatTime(progressMap[index]?.currentTime)} /{" "}
                  {formatTime(progressMap[index]?.duration)}
                </div> */}

                <div className={styles.overlayContent}>
                  <div className={styles.rightActions}>
                    <button type="button" className={styles.actionButton} 
                    onClick={() => handleLikePost(item)}
                    style={{
                      filter: likeLoading ? "grayscale(100%)" : "none",
                      cursor: likeLoading ? "not-allowed" : "pointer",
                    }}
                    >
                      <Image
                        src={item?.is_liked ? "/images/icons/fav.svg" : "/images/icons/outline-fav.svg"}
                        height={20}
                        width={20}
                        alt="fav icon"
                      />
                      <span>{item.likes_count}</span>
                    </button>

                    <button type="button" className={styles.actionButton}>
                      <SavedIcon withoutBox isSaved={item?.is_saved} itemId={item?.id} itemType={1}/>
                      {/* <span>{item.comments_count || 20}</span> */}
                    </button>
                  </div>

                  <div className={styles.bottomInfo}>
                    <div className={styles.ownerRow}>
                      <div className={styles.avatar}>
                        {item.owner?.image_url ? (
                          <img src={item?.owner?.image_url} alt="owner" />
                        ) : (
                          <img src={"/images/user.png"} alt="owner" />
                        )}
                      </div>

                      <div>
                        <div className={styles.ownerName}>
                          {item.owner?.first_name} {item.owner?.last_name}
                        </div>
                        <div className={styles.category}>
                          {item?.caption}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.arrowsActions}>
                <IoIosArrowDropup
                  className={`${styles.arrowIcon} ${
                    activeIndex === 0 ? styles.disabled : ""
                  }`}
                  onClick={() => goToIndex(activeIndex - 1)}
                />

                <IoIosArrowDropdown
                  className={`${styles.arrowIcon} ${
                    activeIndex === videos.length - 1 ? styles.disabled : ""
                  }`}
                  onClick={() => goToIndex(activeIndex + 1)}
                />
              </div>
            </div>
          ))}

          {isFetching ? (
            <div className={styles.loading}>جاري تحميل المزيد...</div>
          ) : null}
        </div>
      </div>
    </ReelsPortal>
  );
}

function ReelsPortal({ children }) {
  return createPortal(children, document.body);
}