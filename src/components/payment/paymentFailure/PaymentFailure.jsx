
import { useTranslations } from "next-intl";
import styles from "./PaymentFailure.module.scss";
import PaymentStatus from "../paymentStatus/PaymentStatus";

export default function PaymentFailure({
  onRetry,
  isVerificationError = false,
  onGoBack,
}) {
  const t = useTranslations("paymentResult");

  return (
    <div className={styles.wrapper}>
      {isVerificationError ? (
        <div className={styles.status}>
          <h1>{t("verificationTitle")}</h1>
          <p>{t("verificationDescription")}</p>
        </div>
      ) : (
        <PaymentStatus />
      )}

      <div className={styles.card}>
        <div className={styles.block}>
          <h3>{t("whatNow")}</h3>
          <p>
            {t(
              isVerificationError
                ? "verificationInstructions"
                : "retryInstructions"
            )}
          </p>
        </div>

        <div className={styles.divider} />

        <div className={styles.block}>
          <h3>{t("needHelp")}</h3>

          <a href="mailto:contact@company.com">
            contact@company.com
          </a>

          <a href="tel:+14146875892" dir="ltr">
            (414) 687 - 5892
          </a>
        </div>
      </div>

      <button
        type="button"
        className={styles.retryButton}
        onClick={onRetry}
      >
        {t(
          isVerificationError
            ? "checkAgain"
            : "retryPayment"
        )}
      </button>

      {isVerificationError && onGoBack && (
        <button
          type="button"
          className={styles.backButton}
          onClick={onGoBack}
        >
          {t("backToPlans")}
        </button>
      )}
    </div>
  );
}
