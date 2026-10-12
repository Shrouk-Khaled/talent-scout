"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import { createPayment, getAllPackages } from "@/services/api";
import PlanDetails from "@/components/plans/planDetails/PlanDetails";
import InvoiceSummary from "@/components/plans/invoiceSummary/InvoiceSummary";
import { message } from "antd";

export default function PackageDetailsPage() {
  const t = useTranslations("packages");
  const { id } = useParams();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchPlan = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await getAllPackages();
        const plans = response?.data;

        const selectedPlan = plans.find(
          (item) => String(item.id) === String(id),
        );

        if (active) {
          setPlan(selectedPlan || null);
        }
      } catch (err) {
        console.error("Error fetching plan:", err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPlan();

    return () => {
      active = false;
    };
  }, [id]);

  const handlePayment = async (selectedPlan) => {
    if (paymentLoading) return;

    try {
      setPaymentLoading(true);

      const payload = {
        subscription_plan_id: selectedPlan.id,
        channel: "WEB",
      };

      const response = await createPayment(payload);

      const data = response;

      if (data?.checkout_url) {
        window.location.assign(data.checkout_url);
      } else {
        console.error("Checkout URL not found:", data);
      }
    } catch (error) {
      console.error("Payment creation failed:", error);
      message.error(error?.response?.data?.message || "Payment creation failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <main className={`${styles.page} page-container marginTop`} dir="rtl">
      <div className={styles.container}>
        <header className={styles.heading}>
          <h1>{t("title")}</h1>
          <p>{t("subtitle")}</p>
        </header>

        {loading ? (
          <p className={styles.status}>{t("loading")}</p>
        ) : error ? (
          <p className={styles.status}>{t("error")}</p>
        ) : !plan ? (
          <p className={styles.status}>{t("notFound")}</p>
        ) : (
          <div className={styles.grid}>
            <PlanDetails plan={plan} />
            <InvoiceSummary plan={plan} onPayment={handlePayment} paymentLoading={paymentLoading}/>
          </div>
        )}
      </div>
    </main>
  );
}
