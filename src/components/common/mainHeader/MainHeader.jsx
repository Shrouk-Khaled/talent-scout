"use client";
import Image from "next/image";
import styles from "./MainHeader.module.scss";
import { useLocale, useTranslations } from "next-intl";
import Language from "../language/Language";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import UserDropdown from "../userDropdown/UserDropdown";
import { SearchInput } from "../searchInput/SearchInput";
import { useUserStore } from "@/store/useUserStore";
import { Divider } from "antd";
import { refreshToken, saveFCMToken } from "@/services/api";
import { Notifications } from "../notifications/Notifications";
import { getFcmToken } from "@/lib/fcm";
import { AddPost } from "../addPost/AddPost";
import { getRefreshToken, setAccessToken } from "@/services/tokenStore";

export default function MainHeader() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("Header");
  //message
  //store
  const userInfo = useUserStore((state) => state.info);
  const userAccess = useUserStore((state) => state.userData)?.token_type;
  const saveUserData = useUserStore((state) => state.setUserData);

  //states
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    refreshToken("", getRefreshToken()).then((res) => {
      const tokens = res?.token_response;
      setAccessToken(tokens?.access_token, tokens?.token_type, tokens?.refresh_token);
      saveUserData(tokens)
    })
  },[])

  useEffect(() => {
    const initFcm = async () => {
      try {
        const fcmToken = await getFcmToken();
        console.log("FCM Token:", fcmToken);
  
        if (!fcmToken) return;
  
        await saveFCMToken({
          fcm_token: fcmToken,
          device_type: "WEB",
        });
      } catch (error) {
        console.error("Error getting/saving FCM token:", error);
      }
    };
  
    initFcm();
  }, []);

  // Detect scroll to change background color of the header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        // Adjust scroll threshold if needed
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenReelsPage = () => {
    router.push(`/reels`);
  }

  return (
    <header
      className={`${styles.header} ${scrolling ? styles.scrolled : ""}  ${
        styles.notHome
      }`}
    >
      <div className={`${styles.mainInfo} app-container`}>
        <div className={styles.searchBox}>
          <div className={styles.logoBox}>
            <Image
              src={"/images/logo.png"}
              alt="Logo"
              width={70}
              height={60}
              className={styles.logo}
              priority
              onClick={() => router.push(`/feed`)}
            />
          </div>
          <SearchInput />
        </div>

        <div
          className={styles.actions}
          style={{
            width: (userInfo?.user?.user_role == 1 && userAccess == "FULL_ACCESS") ? "50%" : "30%",
          }}
        >
          <Language />
          <AddPost/>
          {userInfo?.user?.user_role == 1 && userAccess == "FULL_ACCESS" && (
            <Divider type="vertical" style={{ height: 28, margin: "0 8px" }} />
          )}
          <div className={styles.reels} onClick={handleOpenReelsPage}>
            <span>{t("videoes")}</span>
            <Image
              src={"/images/icons/videos.svg"}
              width={24}
              height={24}
              alt="sms icon"
            />
          </div>
          <Notifications />

          {/* <TbMail  className={styles.icon}/> */}
          {/* <RiNotification3Line  className={styles.icon}/> */}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
