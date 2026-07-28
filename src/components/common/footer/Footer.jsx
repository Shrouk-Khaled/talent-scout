"use client";
import Image from "next/image";
import DownloadAppBox from "./DownloadApp";
import styles from "./Footer.module.scss";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { RiTwitterXLine } from "react-icons/ri";
import { FaFacebookF } from "react-icons/fa";
import { Link } from "@/i18n/navigation";
import { IoIosStar } from "react-icons/io";
import { LuMail } from "react-icons/lu";
import { LuPhone } from "react-icons/lu";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { usePathname } from "next/navigation";
import { useTranslations } from "use-intl";
import { useState } from "react";

export default function Footer() {
  const pathname = usePathname() || "";
  const t = useTranslations("footer");
  const tHeader = useTranslations("Header");
  const [sectionId, setSectionId] = useState(null);

  const links = [
    { id: 1, label: tHeader("home") },
    { id: 2, label: tHeader("knowUs") },
    { id: 3, label: tHeader("talents") },
    { id: 4, label: tHeader("howToJoin") },
    // { id: 5, label: tHeader("packages") },
  ];

  // handles localized paths like /en/feed or /ar/feed and also /feed
  const parts = pathname.split("/").filter(Boolean); // ["en","feed"] or ["feed"]
  const isFeed =
    parts[0] === "feed" || // /feed
    (parts.length > 1 && parts[1] === "feed"); // /en/feed, /ar/feed, etc.
  const isHomePage =
    parts.length === 0 ||
    (parts.length === 1 && (parts[0] === "ar" || parts[0] == "en")); // / or /en or /ar

  const handleGoIntoTheSection = (sectionId) => {
    setSectionId(sectionId);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={styles.footer}>
      <div className={`${styles.main} app-container`}>
        {isFeed ? <></> : <DownloadAppBox />}

        <div
          className={styles.info}
          style={{ paddingTop: isFeed ? "1rem" : "4rem" }}
        >
          <div className={styles.right}>
            <Image
              src={"/images/logo2.png"}
              alt={"Talent Scout"}
              width={80}
              height={60}
              className={styles.logo}
              priority
            />
            <p className={styles.desc}>{t("appDesc")}</p>
            <div className={styles.social}>
              <a
                href="https://www.youtube.com/@talentscout9671"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.icon}
              >
                <FaYoutube />
              </a>

              <a
                href="https://www.youtube.com/@talentscout9671"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.icon}
              >
                <FaLinkedinIn />
              </a>

              <a
                href="https://www.youtube.com/@talentscout9671"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.icon}
              >
                <RiInstagramFill />
              </a>

              <a
                href="https://www.youtube.com/@talentscout9671"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.icon}
              >
                <RiTwitterXLine />
              </a>

              <a
                href="https://www.youtube.com/@talentscout9671"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.icon}
              >
                <FaFacebookF />
              </a>
            </div>
          </div>
          <div className={styles.mid}>
            <h3>{t("importantLinks")}</h3>
            {isHomePage ? (
              <div className={styles.links}>
                {links.map((link, i) => (
                  <div className={styles.link}>
                    <IoIosStar />
                    <button
                      key={i}
                      onClick={() => handleGoIntoTheSection(link.id)}
                    >
                      {link.label}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.links}>
                <div className={styles.link}>
                  <IoIosStar />
                  <Link href="/feed">{tHeader("home")}</Link>
                </div>
                <div className={styles.link}>
                  <IoIosStar />
                  <Link href="/search?type=talents">{tHeader("talents")}</Link>
                </div>
                <div className={styles.link}>
                  <IoIosStar />
                  <Link href="/search?type=articles">{tHeader("articles")}</Link>
                </div>
                <div className={styles.link}>
                  <IoIosStar />
                  <Link href="/search?type=events">{tHeader("events")}</Link>
                </div>
              </div>
            )}
          </div>
          <div className={styles.left}>
            <div className={styles.contacts}>
              <h3>{t("contactUs")}</h3>

              <div className={styles.contact}>
                <LuMail />
                <a
                  href="mailto:contact@company.com"
                  className={styles.contactLink}
                >
                  contact@company.com
                </a>
              </div>
              <div className={styles.contact}>
                <LuPhone />
                <a href="tel:+14146875892" className={styles.contactLink}>
                  687 - 5892 (414)
                </a>
              </div>
              <div className={styles.contact}>
                <HiOutlineLocationMarker />
                <a
                  href="https://www.google.com/maps?q=24.7136,46.6753" // Replace with actual coordinates or address
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactLink}
                >
                  السعودية الرياض
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.shortDesc}>
          <p>جميع الحقوق محفوظة تالنت سكوت</p>
        </div>
      </div>
    </div>
  );
}
