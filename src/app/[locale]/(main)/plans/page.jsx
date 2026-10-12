import styles from "./page.module.scss";
import PlansBanner from "@/components/plans/plansBanner/PlansBanner";
import FeaturesSection from "@/components/plans/featuresSection/FeaturesSection";
import PricingSection from "@/components/plans/pricingSection/PricingSection";
import { useTranslations } from "next-intl";
import Questions from "@/components/home/questions/Questions";

export default function PlansPage() {
  const t = useTranslations("packages");
  const isFreePlan = false;

  return (
    <div className={`app-container marginTop ${styles.container}`}>
      <PlansBanner isFreePlan={isFreePlan} />
      <FeaturesSection />
      <PricingSection isFreePlan={isFreePlan} />
      {
        isFreePlan && (
          <p className={styles.note}>{t("pricingNote")}</p>
        )
      }
      {
        !isFreePlan && (
            <Questions/>
        )
      }
    </div>
  );
}
