import { TalentsLine } from "@/components/common/talentsLine/TalentsLine";
import styles from "./layout.module.scss";
import "antd/dist/reset.css";
import { SideBar } from "@/components/profile/sideBar/SideBar";

export default function SignupLayout({ children }) {
  return (
    <main className={styles.container}>
      <TalentsLine />
      <div className={`${styles.main} app-container`}>
        <div className={styles.sideBar}>
          <SideBar />
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </main>
  );
}
