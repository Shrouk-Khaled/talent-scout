import React from "react";
import styles from "./DownloadAppBox.module.scss";
import Image from "next/image";

export default function DownloadAppBox() {
  return (
    <aside className={styles.wrapper} aria-label="Download app">
        <div className={styles.info}>
          <h1>
          حيث تجتمع العقول الموهوبة بالباحثين لصناعة مستقبل مُلهم
          </h1>
          <p>
          اعرض مهاراتك، واكتشف المواهب عبر مختلف المجالات، وتواصل مع الباحثين والمستثمرين من خلال تطبيق واحد. ابقَ مُلهَماً، واجعل موهبتك مرئية، ووسّع فرصك في أي وقت وأي مكان.
          </p>
          <div className={styles.stores}>
            <p>
              التنزيل من جوجل بلاي
              <Image src="/images/icons/google-play.svg" alt="App Store" width={24} height={24} priority />
            </p>
            <p>
              التنزيل من أبب ستور
              <Image src="/images/icons/app-store.svg" alt="App Store" width={24} height={24} priority />
            </p>
          </div>
        </div>
        <div className={styles.imageBox}>
          <Image src="/images/home/download.png" alt="App Screenshot" width={350} height={370} priority />
        </div>
    </aside>
  );
}
