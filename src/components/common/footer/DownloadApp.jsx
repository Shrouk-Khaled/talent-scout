import React from "react";
import styles from "./DownloadAppBox.module.scss";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function DownloadAppBox() {
  const t = useTranslations("footer");
  return (
    <aside className={styles.wrapper} aria-label="Download app" dir="rtl">
        <div className={styles.info}>
          <h1>
            {t("downloadTitle")}
          </h1>
          <p>
            {t("downloadDesc")}
          </p>
          <div className={styles.stores}>
            <p>
              {t("downloadGooglePlay")}
              <Image src="/images/icons/google-play.svg" alt="App Store" width={24} height={24} priority />
            </p>
            <p>
              {t("downloadAppStore")}
              <Image src="/images/icons/app-store.svg" alt="App Store" width={24} height={24} priority />
            </p>
          </div>
        </div>
        <div className={styles.imageBox}>
          <Image src="/images/home/download-app.png" alt="App Screenshot" width={350} height={370} priority />
        </div>
    </aside>
  );
}
