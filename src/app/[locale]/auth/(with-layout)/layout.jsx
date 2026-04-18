import Image from "next/image";
import styles from "./layout.module.scss";
import Language from "@/components/common/language/Language";
import { IoIosStar } from "react-icons/io";
import { useTranslations } from "next-intl";

export default function AuthLayout({ children }) {
  const t = useTranslations("auth")

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
                {t("layoutTitle")}
              </p>
              <h1 className={styles.headline}>
                  {t("layoutDesc1")}
                <br />
                  {t("layoutDesc2")}
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
