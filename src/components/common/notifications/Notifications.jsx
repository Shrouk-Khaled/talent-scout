import { useEffect, useRef, useState } from "react";
import styles from "./Notifications.module.scss";
import {
  getAllNotifications,
  getUnreadNotificationsCount,
} from "@/services/api";
import Image from "next/image";
import Button from "@/components/ui/button/Button";
import { Loader } from "../loader/Loader";

export const Notifications = () => {
  //refs
  const boxRef = useRef(null);
  //states
  const [haveUnreadNotifications, setHaveUnreadNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [openOptions, setOpenOptions] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
  });
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    getUnreadNotificationsCount().then((res) => {
      if (res?.unread_count > 0) {
        setHaveUnreadNotifications(true);
      }
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!boxRef.current) return;

      if (!boxRef.current.contains(e.target)) {
        setOpenOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  //functions
  const fetchNotifications = () => {
    setFirstLoad(true);
    getAllNotifications().then((res) => {
      setFirstLoad(false);
      setNotifications(res?.data || []);
      setPagination({
        page: res?.current_page || 1,
        per_page: res?.per_page || 10,
        total: res?.total_pages || 0,
      });
    });
  };

  const loadMore = () => {
    if (pagination.page >= pagination.total) return;
    setLoadMoreLoading(true);
    getAllNotifications({ page: pagination.page + 1 }).then((res) => {
      setLoadMoreLoading(false);
      setNotifications((prev) => [...prev, ...(res?.data || [])]);
      setPagination({
        page: res?.current_page || 1,
        per_page: res?.per_page || 10,
        total: res?.total_pages || 0,
      });
    });
  };

  const getCorrectDate = (date) => {
    const postDate = new Date(date);
    const now = new Date();
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    if (diffInHours < 1) return "منذ دقائق";
    if (diffInHours < 24) return `منذ ${diffInHours} ساعات`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `منذ ${diffInDays} يوم`;
  };

  return (
    <div className={styles.container} ref={boxRef}>
      <Image
        src={
          haveUnreadNotifications
            ? "/images/icons/unread-notifications.svg"
            : "/images/icons/notification.svg"
        }
        width={haveUnreadNotifications ? 40 : 24}
        height={haveUnreadNotifications ? 40 : 24}
        alt="notification icon"
        onClick={() => {
          setOpenOptions(!openOptions);
          fetchNotifications();
        }}
      />

      {openOptions && (
        <div className={styles.content}>
          <div className={styles.title}>الاشعارات</div>
          {notifications?.length > 0 && (
            <div className={styles.data}>
              {notifications.map((item, i) => {
                return (
                  <div
                    key={i}
                    className={`${styles.notification} ${
                      !item?.is_read && styles.unread
                    }`}
                  >
                    <div className={styles.notificationImage}>
                      <Image
                        src={"/images/icons/user-notification.svg"}
                        width={48}
                        height={48}
                        alt="icon"
                      />
                    </div>
                    <div className={styles.info}>
                      <div className={styles.details}>
                        <h3>{item?.title}</h3>
                        <div>
                          <p>{getCorrectDate(item?.created_at)}</p>
                          {!item?.is_read && (
                            <Image
                              src={"/images/icons/dot.svg"}
                              width={8}
                              height={8}
                              alt="icon"
                            />
                          )}
                        </div>
                      </div>
                      <div className={styles.body}>
                        <p>{item?.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {notifications?.length > 0 &&
                pagination.page < pagination.total && (
                  <div className={styles.loadMore}>
                    <Button
                      onClick={loadMore}
                      loading={loadMoreLoading}
                      style={{ width: "100%" }}
                    >
                      عرض المزيد
                    </Button>
                  </div>
                )}
            </div>
          )}

          {firstLoad && (
            <div className={styles.loading}>
              <Loader />
            </div>
          )}

          {notifications?.length == 0 && (
            <div className={styles.noNotifications}>
              <Image
                src={"/images/home/no-notifications.png"}
                width={150}
                height={150}
                alt="no notifications"
              />
              <h3>لا توجد إشعارات حاليًا</h3>
              <p>
                ستظهر هنا الإشعارات الخاصة بالتفاعلات، الطلبات، وحالة حسابك.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
