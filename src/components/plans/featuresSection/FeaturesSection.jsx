
import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./FeaturesSection.module.scss";

const features = [
  {
    id: 1,
    titleKey: "feature1Title",
    descriptionKey: "feature1Description",
    image: "/images/plans/upload.png",
  },
  {
    id: 2,
    titleKey: "feature2Title",
    descriptionKey: "feature2Description",
    image: "/images/plans/global.png",
  },
  {
    id: 3,
    titleKey: "feature3Title",
    descriptionKey: "feature3Description",
    image: "/images/plans/network.png",
  },
];

export default function FeaturesSection() {
  const t = useTranslations("packages");

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <p className={styles.subtitle}>
          {t("featuresSubtitle")}
        </p>

        <h2>{t("featuresTitle")}</h2>
      </div>

      <div className={styles.grid}>
        {features.map((feature) => (
          <div
            key={feature.id}
            className={styles.card}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={feature.image}
                alt={t(feature.titleKey)}
                fill
                sizes="120px"
                className={styles.image}
              />
            </div>

            <h3>{t(feature.titleKey)}</h3>

            <p>{t(feature.descriptionKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
