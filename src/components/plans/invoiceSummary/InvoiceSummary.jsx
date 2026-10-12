
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./InvoiceSummary.module.scss";
import Button from "@/components/ui/button/Button";

const TAX_RATE = 0.15;

export default function InvoiceSummary({
  plan,
  onPayment,
  paymentLoading
}) {
  const t = useTranslations("packages");
  const [accepted, setAccepted] = useState(false);

  const subtotal = plan.price;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const handlePayment = () => {
    if (!accepted) return;
    onPayment(plan);
  };

  return (
    <aside className={styles.card}>
      <h2 className={styles.title}>
        {t("invoiceDetails")}
      </h2>

      <div className={styles.rows}>
        <div className={styles.row}>
          <span>
            {plan.name} ({t("annual")})
          </span>
          <strong>
            {formatPrice(subtotal)} {plan.currency}
          </strong>
        </div>

        <div className={styles.row}>
          <span>
            {t("vat")} (15%)
          </span>
          <strong>
            {formatPrice(tax)} {plan.currency}
          </strong>
        </div>
      </div>

      <div className={styles.totalRow}>
        <span>{t("total")}</span>
        <strong>
          {formatPrice(total)} {plan.currency}
        </strong>
      </div>

      <label className={styles.terms}>
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) =>
            setAccepted(e.target.checked)
          }
        />
        <span>
          {t("agreeTo")}{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            {t("terms")}
          </a>{" "}
          {t("and")}{" "}
          <a href="/polices" target="_blank" rel="noopener noreferrer">
            {t("privacy")}
          </a>
        </span>
      </label>

      <Button
        type="button"
        className={styles.payButton}
        disabled={!accepted || paymentLoading}
        onClick={handlePayment}
        loading={paymentLoading}
        style={{width: "100%"}}
      >
        {t("continuePayment")}
      </Button>

      <div className={styles.footer}>
        <div className={styles.paymentMethods}>
          <span className={styles.visa}>VISA</span>
          <span className={styles.mastercard}>
            <i />
            <i />
          </span>
          <span className={styles.applePay}>
            Apple Pay
          </span>
        </div>

        <span className={styles.secure}>
          {t("securePayment")}
        </span>
      </div>
    </aside>
  );
}
