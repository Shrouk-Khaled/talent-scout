
import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./PlanDetails.module.scss";

export default function PlanDetails({ plan }) {
  const t = useTranslations("packages");

  const features = [...(plan.features || [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    <section className={styles.card}>
      <div className={styles.top}>
        <div className={styles.info}>
          {plan.is_featured && (
            <span className={styles.badge}>
              {t("bestChoice")}
            </span>
          )}

          <h2>{plan.name}</h2>

          <p className={styles.description}>
            {t("planDescription")}
          </p>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src="/images/icons/crown.svg"
            alt=""
            fill
            sizes="100px"
            className={styles.image}
          />
        </div>
      </div>

      <div className={styles.divider} />

      <h3 className={styles.featuresTitle}>
        {t("includedFeatures")}
      </h3>

      <ul className={styles.features}>
        {features.map((feature) => (
          <li key={feature.id}>
            {feature.feature_text}
          </li>
        ))}
      </ul>
    </section>
  );
}
