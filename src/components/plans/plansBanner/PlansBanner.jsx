"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./PlansBanner.module.scss";
import Button from "@/components/ui/button/Button";

export default function PlansBanner({ isFreePlan }) {
  const t = useTranslations("packages");

  const handleExplore = () => {
    document.getElementById("pricing-plans")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className={styles.banner}>
      <div className={styles.content}>
        <p className={styles.badge}>
          <span>★</span>
          {t(isFreePlan ? "freeBannerBadge" : "subscribedBannerBadge")}
        </p>

        <h1 className={styles.heading}>
          {isFreePlan ? (
            <>
              {t("freeBannerTitle")}
              <br />
              {t("freeBannerSubtitle")}
              <span className={styles.emoji}> 🎉</span>
            </>
          ) : (
            <>
              {t("subscribedBannerTitle")}
              <br />
              {t("subscribedBannerSubtitleFirst")}{" "}
              <span className={styles.highlight}>
                {t("subscribedBannerSubtitleHighlight")}
              </span>
            </>
          )}
        </h1>

        <p className={styles.description}>{t("bannerDescription")}</p>

        <Button
          type="button"
          className={styles.button}
          onClick={handleExplore}
          icon={
            <Image
              src="/images/icons/arrow-circle-down.svg"
              width={20}
              height={20}
              alt="icon"
            />
          }
        >
          {t("explorePlans")}
        </Button>
      </div>

      <div className={styles.imageWrapper}>
        <Image
          src={
            isFreePlan
              ? "/images/plans/plan-user.png"
              : "/images/plans/plan-user2.png"
          }
          alt={t("bannerImageAlt")}
          fill
          sizes="(max-width: 768px) 100vw, 440px"
          className={styles.image}
          priority
        />
      </div>
    </section>
  );
}
