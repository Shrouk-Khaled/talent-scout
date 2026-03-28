"use client";
import Image from "next/image";
import styles from "./MainHeader.module.scss";
import { useLocale, useTranslations } from "next-intl";
import Language from "../language/Language";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import UserDropdown from "../userDropdown/UserDropdown";
import { SearchInput } from "../searchInput/SearchInput";
import { useUserStore } from "@/store/useUserStore";
import { Divider, message } from "antd";
import CreatePostModal from "@/components/feed/createPostModal/CreatePostModal";
import { createPost, saveFCMToken } from "@/services/api";
import { Notifications } from "../notifications/Notifications";
import { getFcmToken } from "@/lib/fcm";

export default function MainHeader() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("Header");
  //message
  const [messageApi, contextHolder] = message.useMessage();
  //store
  const userInfo = useUserStore((state) => state.info);
  const userAccess = useUserStore((state) => state.userData)?.token_type;
  //states
  const [scrolling, setScrolling] = useState(false);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [sumbitLoading, setSubmitLoading] = useState(false);

  useEffect(async() => {
    const fcmToken = await getFcmToken();
    console.log("FCM Token:", fcmToken);
    saveFCMToken({ fcm_token: fcmToken, device_type: "WEB" })
  },[])

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

  const handleCreatePost = (body, attachment) => {
    setSubmitLoading(true);
    createPost({
      type_id: attachment?.[0]?.type === "image" ? 1 : 2,
      caption: body,
      media: attachment?.[0]?.file,
      visibility_id: 1,
      title: "",
    })
      .then((res) => {
        console.log("Post created:", res);
        setOpenCreatePost(false);
        setSubmitLoading(false);
        messageApi.success("تم إنشاء المنشور بنجاح!");
      })
      .catch((err) => {
        console.error("Error creating post:", err);
        setSubmitLoading(false);
      });
  };

  const handleOpenReelsPage = () => {
    router.push(`/${locale}/reels`);
  }

  return (
    <header
      className={`${styles.header} ${scrolling ? styles.scrolled : ""}  ${
        styles.notHome
      }`}
    >
      {contextHolder}
      <CreatePostModal
        open={openCreatePost}
        onClose={() => setOpenCreatePost(false)}
        userName="محمد أحمد"
        submitting={sumbitLoading}
        value={""}
        onSubmit={(body, attachment) => {
          handleCreatePost(body, attachment);
        }}
      />
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
              onClick={() => router.push(`/${locale}/feed`)}
            />
          </div>
          <SearchInput />
        </div>

        <div
          className={styles.actions}
          style={{
            width: "50%",
          }}
        >
          <Language />
          {userInfo?.user?.user_role == 1 && userAccess == "FULL_ACCESS" ? (
            <Button
              onClick={() => {
                setOpenCreatePost(true);
              }}
              icon={<FiPlus />}
            >
              اضافة منشور
            </Button>
          ) : null}
          {userInfo?.user?.user_role == 1 && userAccess == "FULL_ACCESS" && (
            <Divider type="vertical" style={{ height: 28, margin: "0 8px" }} />
          )}
          <div className={styles.reels} onClick={handleOpenReelsPage}>
            <span>الفيديوهات</span>
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
