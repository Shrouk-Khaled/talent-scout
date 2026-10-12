
"use client";

import { Modal } from "antd";
import { useTranslations } from "next-intl";
import { FaExclamationTriangle } from "react-icons/fa";
import Button from "@/components/ui/button/Button";
import styles from "./CancelSubscriptionModal.module.scss";

export default function CancelSubscriptionModal({
  open,
  onClose,
  onConfirm,
  plan,
  renewalDate,
  loading = false,
}) {
  const t = useTranslations("cancelSubscription");

  const formattedDate = renewalDate
    ? new Intl.DateTimeFormat("ar-SA", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(renewalDate))
    : null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={650}
      closable
      destroyOnHidden
      className={styles.modal}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <h2>{t("title")}</h2>
          <p>{plan?.name || t("activePlan")}</p>
        </div>

        <div className={styles.warningBox}>
          <div className={styles.warningTitle}>
            <FaExclamationTriangle />
            <h3>{t("warningTitle")}</h3>
          </div>

          <p>
            {t("warningDescription")}
           
          </p>
        </div>

        <ul className={styles.losses}>
          <li>{t("loss1")}</li>
          <li>{t("loss2")}</li>
        </ul>

        <div className={styles.actions}>
          <Button
            onClick={onClose}
            disabled={loading}
          >
            {t("keepSubscription")} ✨
          </Button>

          <button
            type="button"
            className={styles.cancelButton}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? t("cancelling")
              : t("confirmCancellation")}
          </button>
        </div>
      </div>
    </Modal>
  );
}
