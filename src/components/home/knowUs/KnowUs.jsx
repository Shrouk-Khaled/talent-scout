"use client";
import Image from "next/image";
import styles from "./Know.module.scss";
import Button from "@/components/ui/button/Button";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function KnowUs() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Home");

  return (
    <div className={`${styles.section} app-container`} id="2">
      <div className={styles.reviews}>
        <Image
          src={
            locale == "ar"
              ? "/images/home/review.svg"
              : "/images/home/review-en.svg"
          }
          alt="review"
          width={450}
          height={450}
          loading="lazy"
        />
      </div>

      <div className={styles.info}>
        <p>{t("knowUs")}</p>
        <h1>
          {t("KnowUsDesc")} <span>{t("needs")}</span>
        </h1>
        <h4>{t("knowUsDesc2")}</h4>

        <div className={styles.talents}>
          <Image
            src={"/images/icons/idea-star.svg"}
            alt="star icon"
            width={60}
            height={60}
            priority
          />
          <div>
            <h3>{t("forTalents")}</h3>
            <p>{t("forTalentsDesc")}</p>
          </div>
        </div>

        <div className={styles.talents}>
          <Image
            src={"/images/icons/search-star.svg"}
            alt="star icon"
            width={60}
            height={60}
            priority
          />
          <div>
            <h3>{t("forResearchers")}</h3>
            <p>{t("forResearchersDesc")}</p>
          </div>
        </div>

        <Button
          isArrow
          onClick={() => {
            router.push("/auth/login");
          }}
        >
          {t("getStarted")}
        </Button>
      </div>
    </div>
  );
}
