"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./PricingSection.module.scss";
import { getAllPackages } from "@/services/api";
import PlanCard from "@/components/plans/planCard/PlanCard";

export default function PricingSection({ isFreePlan }) {
  const t = useTranslations("packages");

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); 

  useEffect(() => {
    let active = true;

    const fetchPackages = async () => {
      try {
        const response = await getAllPackages();

        // Axios response without response interceptor
        const plans = response?.data;

        if (active) {
          const sortedPlans = [...plans].sort(
            (a, b) => a.sort_order - b.sort_order,
          );

          const featuredPlan = sortedPlans.find((plan) => plan.is_featured);

          const normalPlans = sortedPlans.filter((plan) => !plan.is_featured);

          if (featuredPlan) {
            normalPlans.splice(
              Math.floor(normalPlans.length / 2),
              0,
              featuredPlan,
            );
          }

          setPackages(normalPlans);
        }
      } catch (err) {
        console.error("Error fetching packages", err);

        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchPackages();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className={styles.section} id="pricing-plans">
      <div className={styles.heading}>
        <p className={styles.subtitle}>{t("pricingSubtitle")}</p>

        <h2>{t("pricingTitle")}</h2>
      </div>

      {loading ? (
        <p className={styles.status}>{t("loading")}</p>
      ) : error ? (
        <p className={styles.status}>{t("error")}</p>
      ) : packages.length === 0 ? (
        <p className={styles.status}>{t("empty")}</p>
      ) : (
        <div className={styles.grid}>
          {packages.map((plan) => (
            <PlanCard key={plan.id} plan={plan} isFreePlan={isFreePlan} />
          ))}
        </div>
      )}

    </section>
  );
}
