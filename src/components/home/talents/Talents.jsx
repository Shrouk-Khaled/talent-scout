import { useTranslations } from "next-intl";
import styles from "./Talents.module.scss";

export default function Talents() {
  const t = useTranslations("Home");
  const cats = t.raw("categories");

  return (
    <div className={styles.section} id="3">
      <p className={styles.title}>{t("smallSteps")}</p>
      <h1 className={styles.desc}>
        {t("talentsDesc")} <span>{t("talents")}</span>
      </h1>

      <div className={`${styles.talents} app-container`}>
        {
            cats.map((cat, i) => (
                <div
                key={i}
                className={styles.talent}
                style={{ backgroundImage: `url("/images/home/${cat?.icon}")` }}
                >
                <h1 className={styles.title}>{cat?.title}</h1>
                </div>
            ))
        }
      </div>
    </div>
  );
}
