
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import styles from "./page.module.scss";
import {
  getPaymentDetails,
  getAllPackages,
} from "@/services/api";

import PaymentStatus from "@/components/payment/paymentStatus/PaymentStatus";
import PaymentSummary from "@/components/payment/paymentSummary/PaymentSummary";
import PaymentFailure from "@/components/payment/paymentFailure/PaymentFailure";

const getStatus = (value) => {
  const status = String(value || "").toUpperCase();

  if (["PAID", "SUCCESS", "COMPLETED"].includes(status)) {
    return "success";
  }

  if (
    ["FAILED", "CANCELLED", "CANCELED", "REJECTED"].includes(status)
  ) {
    return "failed";
  }

  return "unknown";
};

export default function PaymentDetails() {
  const t = useTranslations("paymentResult");
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentId = searchParams.get("payment_id");

  const [payment, setPayment] = useState(null);
  const [plan, setPlan] = useState(null);
  const [status, setStatus] = useState("loading");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchPayment = async () => {
      if (!paymentId) {
        setStatus("unknown");
        return;
      }

      setStatus("loading");
      setPayment(null);
      setPlan(null);

      try {
        const response = await getPaymentDetails(paymentId);

        // Your API helper currently returns the response body
        const paymentData = response;

        if (!active) return;

        setPayment(paymentData);

        const verifiedStatus = getStatus(paymentData.status);

        setStatus(verifiedStatus);

        if (
          verifiedStatus === "success" &&
          paymentData.subscription_plan_id
        ) {
          try {
            const plansResponse = await getAllPackages();

            // Adjust if your helper returns an Axios response
            const plans = Array.isArray(plansResponse)
              ? plansResponse
              : plansResponse?.data?.data ??
                plansResponse?.data ??
                [];

            const selectedPlan = plans.find(
              (item) =>
                String(item.id) ===
                String(paymentData.subscription_plan_id)
            );

            if (active) {
              setPlan(selectedPlan || null);
            }
          } catch (planError) {
            console.error(
              "Failed to fetch subscription plan:",
              planError
            );
          }
        }
      } catch (error) {
        if (!active) return;

        console.error("Failed to fetch payment:", error);
        setStatus("unknown");
      }
    };

    fetchPayment();

    return () => {
      active = false;
    };
  }, [paymentId, retryCount]);

  const handleRetry = () => {
    const planId = payment?.subscription_plan_id;

    if (planId) {
      router.push(`/plans/${planId}`);
    } else {
      router.push("/plans");
    }
  };

  return (
    <main
      className={`${styles.page} page-container marginTop`}
      dir="rtl"
    >
      {status === "loading" ? (
        <p className={styles.message}>{t("loading")}</p>
      ) : status === "unknown" ? (
        <PaymentFailure
          isVerificationError
          onRetry={() => setRetryCount((prev) => prev + 1)}
          onGoBack={handleRetry}
        />
      ) : status === "success" ? (
        <>
          <PaymentStatus success />

          <PaymentSummary
            payment={payment}
            plan={plan}
          />

          <button
            type="button"
            className={styles.homeButton}
            onClick={() => router.push("/feed")}
          >
            {t("goHome")}
          </button>
        </>
      ) : (
        <PaymentFailure onRetry={handleRetry} />
      )}
    </main>
  );
}
