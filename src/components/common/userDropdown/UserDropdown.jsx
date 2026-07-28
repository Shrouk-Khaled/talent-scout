"use client";

import Image from "next/image";
import styles from "./UserDropdown.module.scss";
import { LuChevronDown } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { getUserInfo } from "@/services/api";
import { useUserStore } from "@/store/useUserStore";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function UserDropdown() {
  //message
  const t = useTranslations("feed");
  //store
  const saveUserInfo = useUserStore((state) => state.setUserInfo);
  const userInfo = useUserStore((state) => state.info);

  const boxRef = useRef(null);
  const [openOptions, setOpenOptions] = useState(false);

  const handleOpenOptions = () => {
    setOpenOptions(!openOptions);
  };

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

  useEffect(() => {
    getUserInfo().then((res) => {
      saveUserInfo(res);
    });
  }, []);

  const handleLogout = () => {
    const currentLocale =
      window.location.pathname.split("/")[1] === "en" ||
      window.location.pathname.split("/")[1] === "ar"
        ? window.location.pathname.split("/")[1]
        : "ar";
  
    saveUserInfo(null);
    localStorage.clear();
    sessionStorage.clear();
  
    window.location.href = `/${currentLocale}`;
  };

  return (
    <div className={styles.userBox} ref={boxRef}>
      <div className={styles.userDropdown} onClick={handleOpenOptions}>
        <LuChevronDown className={styles.chev} aria-hidden />
        <Image
          className={styles.flagImg}
         src={userInfo?.user?.image_url || "/images/user.png"}
          alt="🇸🇦"
          width={34}
          height={34}
        />
      </div>

      {openOptions && (
        <div className={styles.content}>
          <div className={styles.info}>
            <Image
              className={styles.flagImg}
              src={userInfo?.user?.image_url || "/images/user.png"}
              alt="🇸🇦"
              width={40}
              height={40}
            />
            <div>
              <h3>
                {userInfo?.user?.first_name} {userInfo?.user?.last_name}
              </h3>
              {userInfo?.user?.short_bio && <p>{userInfo?.user?.short_bio}</p>}
            </div>
          </div>

          <div className={styles.pages} onClick={() => {
            setOpenOptions(false);
          }}>
            <Link href={userInfo?.user?.user_role == 1 ? "/profile/posts" : "/profile/saved?type=posts"} className={styles.pageLink}>
              {t("myProfile")}
            </Link>
            {/* <Link href="#" className={styles.pageLink}>
              {t("packages")}
            </Link> */}
            {
              userInfo?.user?.user_role == 2 && (
                <Link href="/profile/contracts" className={styles.pageLink}>
                  {t("contracts")}
              </Link>
              )
            }
           
          </div>

          <div className={styles.logout} onClick={handleLogout}>
            <p>{t("logout")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
