"use client";

import Image from "next/image";
import styles from "./SideBar.module.scss";
import { Link } from "@/i18n/navigation";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useLocale, useTranslations } from "next-intl";

export const SideBar = () => {
  const t = useTranslations("profile");
  const locale = useLocale();

  const pathname = usePathname();
  const userInfo = useUserStore((state) => state.info);
  const data = useUserStore((state) => state.userData);

  const pages = [
    {
      name: t("sidebar.pages.myPosts"),
      icon: "/images/icons/user.svg",
      path: "/profile/posts",
      unique: "posts",
      alt: t("sidebar.iconsAlt.myPosts"),
    },
    {
      name: t("sidebar.pages.savedItems"),
      icon: "/images/icons/saves.svg",
      path: "/profile/saved?type=posts",
      unique: "saved",
      alt: t("sidebar.iconsAlt.savedItems"),
    },
    {
      name: t("sidebar.pages.orders"),
      icon: "/images/icons/contracts.svg",
      path: "/profile/contracts",
      unique: "contracts",
      alt: t("sidebar.iconsAlt.orders"),
    },
    {
      name: t("sidebar.pages.accountSettings"),
      icon: "/images/icons/sittings.svg",
      path: "/profile/sittings",
      unique: "sittings",
      alt: t("sidebar.iconsAlt.accountSettings"),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <Image
          src="/images/user.png"
          width={85}
          height={85}
          alt={t("sidebar.profilePicAlt")}
          priority
        />

        <h1>
          {t("sidebar.welcome")}, {userInfo?.user?.first_name}{" "}
          {userInfo?.user?.last_name} 👋
        </h1>

        <p>{userInfo?.user?.short_bio}</p>

        <Link href="/profile/edit" className={styles.editBtn}>
          {t("sidebar.editAccount")}
        </Link>
      </div>

      <div className={styles.details}>
        <div>
          <p>{t("sidebar.following")}</p>
          <p>{userInfo?.user?.following}</p>
        </div>

        <div>
          <p>{t("sidebar.followers")}</p>
          <p>{userInfo?.user?.followers}</p>
        </div>

        <div>
          <p>{t("sidebar.postsCount")}</p>
          <p>0</p>
        </div>
      </div>

      {data?.token_type === "LIMITED_ACCESS" && (
        <div className={styles.pendingAcc}>
          <Image
            src="/images/pending-acc.png"
            width={90}
            height={90}
            alt={t("sidebar.pendingAccountImageAlt")}
          />

          <div className={styles.info}>
            <h1>{t("sidebar.pendingAccountTitle")}</h1>
            <p>{t("sidebar.pendingAccountDescription")}</p>
          </div>
        </div>
      )}

      <div className={styles.pages}>
        {pages.map((page) => {
          if (
            userInfo?.user?.user_role !== 1 &&
            page.path === "/profile/posts"
          ) {
            return null;
          }

          if (
            userInfo?.user?.user_role === 1 &&
            page.path === "/profile/contracts"
          ) {
            return null;
          }

          return (
            <Link
              key={page.path}
              className={`${styles.pageDetails} ${
                pathname?.includes(page.unique) ? styles.active : ""
              }`}
              href={page.path}
            >
              <div className={styles.pageTitle}>
                <div className={styles.iconBox}>
                  <Image
                    src={page.icon}
                    width={20}
                    height={20}
                    alt={page.alt}
                    priority
                  />
                </div>

                <p>{page.name}</p>
              </div>

              {locale == "ar" ? (
                <MdOutlineArrowBackIos />
              ) : (
                <MdOutlineArrowBackIos
                  style={{ transform: "rotate(180deg)" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
