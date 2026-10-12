
import { FaCheckCircle } from "react-icons/fa";
import { useTranslations, useLocale } from "next-intl";
import styles from "./PaymentSummary.module.scss";

export default function PaymentSummary({ payment, plan }) {
  const t = useTranslations("paymentResult");
  const locale = useLocale();

  const features = [...(plan?.features || [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  const formatPrice = (amount, currency) => {
    if (amount == null) return "—";

    return `${new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)} ${currency || ""}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(parsedDate);
  };

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2>
            {plan?.name || t("planActivated")}
          </h2>

          <p>{t("subscriptionActive")}</p>
        </div>

        <span className={styles.paidBadge}>
          {t("paymentSuccessful")}
        </span>
      </div>

      <div className={styles.divider} />

      <h3 className={styles.featuresHeading}>
        {t("featuresHeading")}
      </h3>

      {features.length > 0 ? (
        <ul className={styles.features}>
          {features.map((feature) => (
            <li key={feature.id}>
              <span>{feature.feature_text}</span>
              <FaCheckCircle />
            </li>
          ))}
        </ul>
      ) : (
        <p>{t("featuresUnavailable")}</p>
      )}

      <div className={styles.divider} />

      <h3 className={styles.detailsHeading}>
        {t("subscriptionDetails")}
      </h3>

      <div className={styles.details}>
        <div className={styles.detailRow}>
          <span>{t("subscriptionValue")}</span>

          <strong className={styles.amount}>
            {formatPrice(
              payment?.amount,
              payment?.currency
            )}
          </strong>
        </div>

        <div className={styles.detailRow}>
          <span>{t("paymentDate")}</span>

          <strong>
            {formatDate(payment?.paid_at)}
          </strong>
        </div>

        <div className={styles.detailRow}>
          <span>{t("subscriptionDuration")}</span>

          <strong>
            {plan?.duration_months
              ? t("durationMonths", {
                  count: plan.duration_months,
                })
              : "—"}
          </strong>
        </div>

        <div className={styles.detailRow}>
          <span>{t("paymentReference")}</span>

          <strong
            dir="ltr"
            style={{
              overflowWrap: "anywhere",
              textAlign: "left",
            }}
          >
            {payment?.payment_reference || "—"}
          </strong>
        </div>
      </div>

      <p className={styles.note}>
        {t("confirmationNote")}
      </p>
    </section>
  );
}
