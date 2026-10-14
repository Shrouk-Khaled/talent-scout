"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/profile/pageHeader/PageHeader";
import styles from "./page.module.scss";
import { getAllPackages } from "@/services/api";
import CancelSubscriptionModal from "@/components/modals/cancelSubscriptionModal/CancelSubscriptionModal";
import { useUserStore } from "@/store/useUserStore";

export default function Plans() {
  const t = useTranslations("profile");
  const tp = useTranslations("profile.plans");

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const user = useUserStore((state) => state.info);

  const currentPlanId = user?.current_plan?.plan_id;

  useEffect(() => {
    let active = true;

    const fetchPlan = async () => {
      try {
        const response = await getAllPackages();

        const plans = Array.isArray(response)
          ? response
          : (response?.data?.data ?? response?.data ?? []);

        const currentPlan = plans.find((item) => item.id === currentPlanId);

        if (active) {
          setPlan(currentPlan || null);
        }
      } catch (error) {
        console.error("Failed to fetch plan:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPlan();

    return () => {
      active = false;
    };
  }, []);

  const handleConfirmCancellation = async () => {
    // TODO: Connect cancellation API when available.
    // Keep the modal open until the API confirms success.
  };

  return (
    <div className={styles.page} dir="rtl">
      <PageHeader title={t("plans.title")} desc={t("plans.description")} />

      <CancelSubscriptionModal
        open={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancellation}
        plan={plan}
        renewalDate={null}
        loading={cancelLoading}
      />

      <div className={styles.content}>
        <div className={styles.banner}>
          <div className={styles.bannerTop}>
            <span className={styles.rocket}>🚀</span>

            <h3>{tp("visibilityTitle")} </h3>
          </div>

          <p>{tp("visibilityDescription")}</p>
        </div>

        {loading ? (
          <p className={styles.loading}>{tp("loading")}</p>
        ) : plan ? (
          <div className={styles.planCard}>
            <div className={styles.planInfo}>
              <span className={styles.currentBadge}>{tp("currentPlan")}</span>

              <h2>{plan.name}</h2>

              <ul className={styles.features}>
                {[...(plan.features || [])]
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((feature) => (
                    <li key={feature.id}>{feature.feature_text}</li>
                  ))}
              </ul>
            </div>

            <div className={styles.planImage}>
              <Image
                src="/images/icons/crown.svg"
                alt={plan.name}
                fill
                sizes="110px"
                className={styles.image}
              />
            </div>
          </div>
        ) : (
          <p className={styles.loading}>{tp("noActivePlan")}</p>
        )}

        {/* <button
          type="button"
          className={styles.cancelLink}
          onClick={() => setIsCancelModalOpen(true)}
        >
          {tp("cancelSubscription")}
        </button> */}
      </div>
    </div>
  );
}
