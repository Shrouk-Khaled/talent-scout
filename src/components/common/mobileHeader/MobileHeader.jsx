"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { CgMenu } from "react-icons/cg";
import styles from "./MobileHeader.module.scss";
import {  useLocale, useTranslations } from "next-intl";
import Button from "@/components/ui/button/Button";
import { Divider, Drawer } from "antd";
import Language from "../language/Language";
import { LuX } from "react-icons/lu";
import { Notifications } from "../notifications/Notifications";
import { SearchInput } from "../searchInput/SearchInput";
import { useHomeStore } from "@/store/useHome";
import { useUserStore } from "@/store/useUserStore";
import { AddPost } from "../addPost/AddPost";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

export default function MobileHeader() {
  const router = useRouter();
  const t = useTranslations("Header");
  const pathname = usePathname();
  const locale = useLocale();
  const isRTL = locale == "ar";
  const closeBtnRef = useRef(null);
  const categories = useHomeStore((state) => state.categories);
  const userInfo = useUserStore((state) => state.info);
  const [scrolling, setScrolling] = useState(false);
  const [open, setOpen] = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);
  const [sectionId, setSectionId] = useState(1);

  const links = [
    { id: 1, label: t("home") },
    { id: 2, label: t("knowUs") },
    { id: 3, label: t("talents") },
    { id: 4, label: t("howToJoin") },
    // { id: 5, label: t("packages") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolling(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Check if the current page is the home page
  useEffect(() => {
    const homePath = `/${locale}`;
    setIsHomePage(pathname === homePath);
  }, [pathname, locale]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const menu = useMemo(
    () => [
      { href: "", subHref: "/feed", label: "الرئيسية" },
      { label: "المناسبات", href: `` },
      { label: "المقالات", href: `` },
      { label: "المواهب", href: `` },
    ],
    [locale]
  );

  const handleOpenReelsPage = () => {
    router.push(`/${locale}/reels`);
  };

  const handleGoIntoTheSection = (sectionId) => {
    setSectionId(sectionId);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", });
      setOpen(false)
    }
  };

console.log(pathname);
  return (
    <>
      {(pathname == `/` || pathname == `/terms` || pathname == `/polices` || pathname == `/child-safety-standards`) ? (
        <div
          className={`${styles.mobileHeader} ${
            scrolling ? styles.scrolled : ""
          }  ${styles.home}`}
        >
          <button
            aria-label="Open menu"
            className={styles.iconBtn}
            onClick={() => setOpen(true)}
          >
            <CgMenu size={30} className={styles.menuIcon} />
          </button>
          <div className={styles.logo}>
            <Image
              src="/images/logo.png"
              alt="logo"
              width={55}
              height={40}
              onClick={() => router.push(`/`)}
            />
          </div>
        </div>
      ) : (
        <div
          className={`${styles.mobileHeader} ${
            scrolling ? styles.scrolled : ""
          }  ${styles.notHome}`}
        >
          <div className={styles.container}>
            <div className={styles.logoBox}>
              <button
                aria-label="Open menu"
                className={styles.iconBtn}
                onClick={() => setOpen(true)}
              >
                <CgMenu size={30} />
              </button>
              <div className={styles.logo}>
                <Image
                  src="/images/logo.png"
                  alt="logo"
                  width={55}
                  height={40}
                  onClick={() => router.push(`/feed`)}
                />
              </div>
            </div>

            <div>
              <div className={styles.reels} onClick={handleOpenReelsPage}>
                <Image
                  src={"/images/icons/videos.svg"}
                  width={24}
                  height={24}
                  alt="sms icon"
                />
              </div>
              <Notifications />
            </div>
          </div>

          <div className={styles.searchBox}>
            <SearchInput w={"100%"} />
          </div>
        </div>
      )}

      <Drawer
        placement={isRTL ? "right" : "left"}
        open={open}
        onClose={() => setOpen(false)}
        closable={false}
        width={340} // <— tweak to your design
        styles={{
          header: { display: "none" },
          body: { padding: 0, fontFamily: "Alexandria-Regular" },
        }}
        className={styles.drawer} // panel
        rootClassName={styles.drawerRoot} // wrapper
      >
        <div className={`${styles.panel} ${isRTL ? styles.rtl : ""}`}>
          <div className={styles.topbar}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <LuX />
            </button>
            <Language />
          </div>

          {(pathname == `/` || pathname == `/terms` || pathname == `/polices` || pathname == `/child-safety-standards`) ? (
            <>
              <ul className={styles.list}>
                {links?.map((item, i) => {
                  return (
                    <li key={i} onClick={() => handleGoIntoTheSection(item.id)}>
                      <p className={`${styles.link} ${item.id === sectionId && styles.active}`}>{item?.label}</p>
                    </li>
                  );
                })}
              </ul>

              <Button
                onClick={() => {
                  router.push("/auth/login");
                  setOpen(false);
                }}
              >
                {t("signup")}
              </Button>
            </>
          ) : (
            <>
              <div className={styles.userBox}>
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
                  {userInfo?.user?.short_bio && (
                    <p>{userInfo?.user?.short_bio}</p>
                  )}
                </div>
              </div>

              {/* Menu */}
              <nav className={styles.nav} aria-label={"menu"}>
                <ul className={styles.list}>
                  {categories?.map((item, i) => {
                    // const fullPath = `/${locale}${item.href}`;
                    // const isActive =
                    //   pathname === fullPath ||
                    //   pathname === `/${locale}${item.subHref}`;
                    return (
                      <li key={i}>
                        <p className={`${styles.link}`}>{item?.name}</p>
                      </li>
                    );
                  })}
                </ul>

                <AddPost />

                <Divider />

                <div className={styles.settings} onClick={() => {setOpen(false)}}>
                  <Link
                    href={
                      userInfo?.user?.user_role == 1
                        ? "/profile/posts"
                        : "/profile/saved?type=posts"
                    }
                  >
                    حسابي
                  </Link>
                  {/* <Link href="#">
                    إدارة الباقات
                  </Link> */}
                  {userInfo?.user?.user_role != 1 && (
                    <Link href="/profile/contracts">
                      الطلبات
                    </Link>
                  )}
                  <p
                    onClick={() => {
                      localStorage.clear();
                      sessionStorage.clear();
                      router.push("/");
                    }}
                  >
                    تسجيل الخروج
                  </p>
                </div>
              </nav>
            </>
          )}
        </div>
      </Drawer>
    </>
  );
}
