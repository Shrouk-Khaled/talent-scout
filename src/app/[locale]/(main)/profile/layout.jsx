"use client";
import { TalentsLine } from "@/components/common/talentsLine/TalentsLine";
import styles from "./layout.module.scss";
import "antd/dist/reset.css";
import { SideBar } from "@/components/profile/sideBar/SideBar";
import { usePathname } from "next/navigation";

export default function SignupLayout({ children }) {
  const pathname = usePathname();
  const isContractDetails = pathname?.includes("/profile/contracts/");

  return (
    <main className={styles.container}>
      <div className={styles.categories}>
      <TalentsLine />
      </div>
      <div className={`${styles.main} app-container`}>
        {!isContractDetails && (
          <div className={styles.sideBar}>
            <SideBar />
          </div>
        )}

        <div className={styles.content} style={{
          width: isContractDetails && "100%"
        }}>{children}</div>
      </div>
    </main>
  );
}
