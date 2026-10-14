"use client";
import { FaCheckCircle } from "react-icons/fa";
import { useTranslations } from "next-intl";
import styles from "./PlanCard.module.scss";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function PlanCard({ plan, isFreePlan }) {
  const t = useTranslations("packages");
  const router = useRouter();
  const user = useUserStore((state) => state.info);

  const isFeatured = plan.is_featured;

  const price = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(plan.price);

  const features = [...(plan.features || [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  return (
    <article className={`${styles.card} ${isFeatured ? styles.featured : ""} ${(!isFreePlan && isFeatured) ? styles.notFreePlan : ""}`}>
      {isFeatured && (
        <span className={styles.featuredBadge}>{t("featured")}</span>
      )}

      <h3 className={styles.name}>{plan.name}</h3>

      <div className={styles.priceWrapper}>
        <strong className={styles.price}>{price}</strong>

        <span className={styles.currency}>{plan.currency}</span>

        <span className={styles.duration}>
          / {plan.duration_months} {t("months")}
        </span>
      </div>

      {plan.is_free && <p className={styles.freeLabel}>{t("freePlan")}</p>}

      <p className={styles.includes}>{t("includes")}</p>

      <ul className={styles.features}>
        {features.map((feature) => (
          <li key={feature.id}>
            <span>{feature.feature_text}</span>
            <FaCheckCircle className={styles.checkIcon} />
          </li>
        ))}
      </ul>

      {(!isFreePlan && !plan?.is_free && user?.current_plan?.plan_id !== plan?.id) && (
        <button
          type="button"
          className={styles.selectButton}
          onClick={() => router.push(`/plans/${plan.id}`)}
        >
          {t("subscribeNow")}
        </button>
      )}
    </article>
  );
}
