
import { FaCheck, FaTimes } from "react-icons/fa";
import { useTranslations } from "next-intl";
import styles from "./PaymentStatus.module.scss";

export default function PaymentStatus({ success = false }) {
  const t = useTranslations("paymentResult");

  return (
    <div className={styles.status}>
      <div
        className={`${styles.iconCircle} ${
          success ? styles.success : styles.failed
        }`}
      >
        <div className={styles.iconInner}>
          {success ? <FaCheck /> : <FaTimes />}
        </div>
      </div>

      <h1>
        {success ? t("successTitle") : t("failedTitle")}
        {success && " 🎉"}
      </h1>

      <p>
        {success
          ? t("successDescription")
          : t("failedDescription")}
      </p>
    </div>
  );
}
