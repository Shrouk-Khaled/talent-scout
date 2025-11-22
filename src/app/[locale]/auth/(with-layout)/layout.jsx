import Image from "next/image";
import styles from "./layout.module.scss";
import Language from "@/components/common/language/Language";
import { IoIosStar } from "react-icons/io";

export default function AuthLayout({ children }) {

  return (
    <main className={styles.main}>
      {/* {pathname?.includes("/signup") ? (
          <div className={styles.signupContainer}>
            <div className={styles.content}>{children}</div>
          </div>
      ) : ( */}
        <div className={styles.container}>
          <div className={styles.cover}>
            <Image
              src="/images/bg-auth.png"
              alt="Auth Cover"
              fill
              sizes="50vw"
              style={{ objectFit: "cover" }}
              loading="lazy"
            />
            <span className={styles.overlay} />

            <div className={styles.titles}>
              <p className={styles.eyebrow}>
                <IoIosStar className={styles.star} />
                منصة ربط بين المبدعين والباحثين في عالم واحد
              </p>
              <h1 className={styles.headline}>
                اكتشف، تواصل، و ابدأ
                <br />
                رحلتك مع المواهب
                <Image
                  src="/images/icons/idea.png"
                  alt=""
                  aria-hidden="true"
                  width={32}
                  height={32}
                  className={styles.icon}
                  priority
                />
              </h1>
            </div>
          </div>

          <div className={styles.left}>
            <div className={styles.lang}>
              <Language />
            </div>

            <div className={styles.content}>{children}</div>
          </div>
        </div>
      {/* )} */}
    </main>
  );
}
