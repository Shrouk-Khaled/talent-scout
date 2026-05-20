import styles from "./layout.module.scss";
import "antd/dist/reset.css";

export default function SignupLayout({ children }) {
  return (
    <main className={styles.signupMain}>
      <div className={styles.signupContainer}>
        <div className={styles.content}>{children}</div>
      </div>
    </main>
  );
}
