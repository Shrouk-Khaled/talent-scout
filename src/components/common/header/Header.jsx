"use client";
import Image from "next/image";
import styles from "./Header.module.scss";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Language from "../language/Language";
import Button from "@/components/ui/button/Button";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Input from "@/components/ui/input/Input";
import { FiSearch } from "react-icons/fi";
import { IoMail } from "react-icons/io5";
import { IoNotificationsSharp } from "react-icons/io5";

export default function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Header");
  const [scrolling, setScrolling] = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);

  const links = [
    { href: "", subHref: "/feed", label: t("home") },
    { href: "/", label: t("talents") },
    { href: "/", label: t("articles") },
    { href: "/", label: t("events") },
  ];

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

  // Check if the current page is the home page
  useEffect(() => {
    const homePath = `/${locale}`;
    setIsHomePage(pathname === homePath);
  }, [pathname, locale]);

  return (
    <header className={`${styles.header} ${scrolling ? styles.scrolled : ""}  ${pathname !== `/${locale}` && styles.notHome}`}>
      <div className={`${styles.mainInfo} app-container`}>
        <div className={styles.logoBox}>
          <Image
            src={"/images/logo.png"}
            alt="Logo"
            width={70}
            height={60}
            className={styles.logo}
            priority
          />
        </div>
        <div className={styles.links}>
          {links.map((link) => {
            const fullPath = `/${locale}${link.href}`;
            const isActive = (pathname === fullPath) || (pathname === `/${locale}${link.subHref}`);
            return (
              <Link
                key={link.href}
                href={fullPath}
                className={`${styles.link} ${isActive ? styles.active : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        {
          pathname === `/${locale}` ? 
          <div className={styles.actions}>
            <Language />
            <Button>{t("login")}</Button>
          </div>
          :
          <div className={styles.actions}>
            <Input
            type="search"
            placeholder="ابحث هنا"
            clearable
            size="lg"
            suffix={<FiSearch />}
            // onEnter={goSearch}
          />
            <IoMail className={styles.icon} />
            <IoNotificationsSharp className={styles.icon} />
          </div>
        }
 
      </div>
    </header>
  );
}
