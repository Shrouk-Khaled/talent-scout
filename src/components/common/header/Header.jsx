"use client";
import Image from "next/image";
import styles from "./Header.module.scss";
import { useLocale, useTranslations } from "next-intl";
import Language from "../language/Language";
import Button from "@/components/ui/button/Button";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MainHeader from "../mainHeader/MainHeader";
import { useRouter } from "@/i18n/navigation";

export default function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Header");
  //states
  const [scrolling, setScrolling] = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);
  const [sectionId, setSectionId] = useState(1);

  const links = [
    { id: 1, label: t("home") },
    { id: 2, label: t("knowUs") },
    { id: 3, label: t("talents") },
    { id: 4, label: t("howToJoin") },
    // { id: 5, label: t("packages") },
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

  useEffect(() => {
    const sectionIds = ["1", "2", "3", "4", "5"];
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSectionId(Number(entry.target.id));
          }
        });
      },
      {
        root: null,
        threshold: 0.5,
      }
    );
  
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        observer.observe(section);
      }
    });
  
    return () => observer.disconnect();
  }, []);

  if (
    pathname != `/${locale}` &&
    pathname != `/${locale}/terms` &&
    pathname != `/${locale}/polices` &&
    pathname != `/${locale}/child-safety-standards`
  )
    return <MainHeader />;

    const handleGoIntoTheSection = (sectionId) => {
      setSectionId(sectionId);
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", });
      }
    };

  return (
    <header className={`${styles.header} ${scrolling ? styles.scrolled : ""}`}>
      <div className={`${styles.mainInfo} app-container`}>
        <div className={styles.logoBox}>
          <Image
            src={"/images/logo.png"}
            alt="Logo"
            width={70}
            height={60}
            className={styles.logo}
            priority
            onClick={() => router.push(`/`)}
          />
        </div>
        <div className={styles.links}>
          {links.map((link, i) => {
            return (
              <button
                key={i}
                href={"#"}
                className={`${styles.link} ${sectionId === link.id ? styles.active : ""}`}
                onClick={() => handleGoIntoTheSection(link.id)}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        <div className={styles.actions}>
          <Language />
          <Button
            onClick={() => {
              router.push("/auth/login");
            }}
          >
            {t("login")}
          </Button>
        </div>
      </div>
    </header>
  );
}
