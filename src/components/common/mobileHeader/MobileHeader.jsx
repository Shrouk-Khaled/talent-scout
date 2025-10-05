"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CgMenu } from "react-icons/cg";
import styles from "./MobileHeader.module.scss";
import { useLocale } from "next-intl";
import Button from "@/components/ui/button/Button";
import { Drawer } from "antd";
import Language from "../language/Language";
import Input from "@/components/ui/input/Input";
import { LuX } from "react-icons/lu";
import { FiSearch } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { IoMail, IoNotificationsSharp } from "react-icons/io5";


export default function MobileHeader() {
  const pathname = usePathname();
  const locale = useLocale();
  const isRTL = locale == "ar";
  const closeBtnRef = useRef(null);
  const [scrolling, setScrolling] = useState(false);
  const [open, setOpen] = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);

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
      { label: "المناسبات", href: `/${locale}/events` },
      { label: "المقالات", href: `/${locale}/articles` },
      { label: "المواهب", href: `/${locale}/about` },
    ],
    [locale]
  );

  return (
    <>
      {pathname === `/${locale}` ? (
        <div
          className={`${styles.mobileHeader} ${
            scrolling ? styles.scrolled : ""
          }  ${pathname !== `/${locale}` && styles.notHome}`}
        >
          <button
            aria-label="Open menu"
            className={styles.iconBtn}
            onClick={() => setOpen(true)}
          >
            <CgMenu size={30} className={styles.menuIcon}/>
          </button>
          <div className={styles.logo}>
            <Image src="/images/logo.png" alt="logo" width={55} height={40} />
          </div>
        </div>
      ) : (
        <div
          className={`${styles.mobileHeader} ${
            scrolling ? styles.scrolled : ""
          }  ${styles.notHome}`}
        >
          <div className={styles.logoBox}>
            <button
              aria-label="Open menu"
              className={styles.iconBtn}
              onClick={() => setOpen(true)}
            >
              <CgMenu size={30}/>
            </button>
            <div className={styles.logo}>
              <Image src="/images/logo.png" alt="logo" width={55} height={40} />
            </div>
          </div>

          <div>
            <IoMail className={styles.icon} />
            <IoNotificationsSharp className={styles.icon} />
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
          header: { display: 'none' },               
          body:   { padding: 0, fontFamily: 'MadaniArabic' },
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

          <div className={styles.searchBox}>
            <Input
              placeholder={"ابحث هنا"}
              size="md"
              clearable
              suffix={<FiSearch />}
            />
          </div>

          {/* Menu */}
          <nav className={styles.nav} aria-label={"menu"}>
            <ul className={styles.list}>
              {menu.map((item) => {
                const fullPath = `/${locale}${item.href}`;
                const isActive =
                  pathname === fullPath ||
                  pathname === `/${locale}${item.subHref}`;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${styles.link} ${
                        isActive ? styles.active : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
              {
                pathname === `/${locale}` &&
                  <Button>تسجيل الحساب</Button>
              }
          </nav>
        </div>
      </Drawer>

    </>
  );
}
