import Image from "next/image";
import Link from "next/link";
import styles from "./PaymentStatus.module.scss";

export default function PaymentStatus({
  status,
  title,
  description,
  paymentId,
}) {
  const isSuccess = status === "success";

  return (
    <main className={styles.page}>
      <div
        className={`${styles.card} ${
          isSuccess ? styles.success : styles.failed
        }`}
      >
        <Link href="/" className={styles.logo}>
          <Image
            src="/images/logo.png"
            alt="Mawhebty"
            width={150}
            height={60}
            priority
          />
        </Link>

        <div className={styles.statusIcon}>
          {isSuccess ? (
            <svg viewBox="0 0 24 24">
              <path
                d="M5 12.5L9.5 17L19 7.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path
                d="M7 7L17 17M17 7L7 17"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>

        <h1 className={styles.title}>{title}</h1>

        <p className={styles.description}>{description}</p>

        {paymentId && (
          <div className={styles.paymentInfo}>
            <span>Payment ID</span>
            <strong>{paymentId}</strong>
          </div>
        )}

        <Link href="/" className={styles.button}>
          Back to Home
        </Link>

        {!isSuccess && (
          <p className={styles.helperText}>
            If the amount was deducted, please contact our support team.
          </p>
        )}
      </div>
    </main>
  );
}