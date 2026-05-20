"use client";

import Button from "@/components/ui/button/Button";
import { Modal, message } from "antd";
import Image from "next/image";
import styles from "./DeleteAccountModal.module.scss";
import { useRouter } from "@/i18n/navigation";
import { deleteAccount } from "@/services/api";
import { useState } from "react";
import { useTranslations } from "next-intl";

export const DeleteAccountModal = ({ onClose }) => {
  const router = useRouter();
  const t = useTranslations("profile");

  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteAccount = () => {
    setDeleteLoading(true);

    deleteAccount()
      .then(() => {
        message.success(t("deleteAccountModal.successMessage"));
      })
      .finally(() => {
        setDeleteLoading(false);
        onClose();
        localStorage.clear();
        sessionStorage.clear();
        router.push("/");
      });
  };

  return (
    <Modal
      open={true}
      footer={null}
      onCancel={onClose}
      centered
      style={{ direction: "rtl", textAlign: "center" }}
    >
      <div className={styles.content}>
        <Image
          src="/images/delete-acc.png"
          width={200}
          height={200}
          alt={t("deleteAccountModal.imageAlt")}
        />

        <h2>{t("deleteAccountModal.title")}</h2>

        <p>{t("deleteAccountModal.description")}</p>

        <div className={styles.info}>
          <Image
            src="/images/icons/info2.svg"
            width={24}
            height={24}
            alt={t("deleteAccountModal.infoIconAlt")}
          />

          <span>{t("deleteAccountModal.warning")}</span>
        </div>

        <div className={styles.btns}>
          <Button
            type="primary"
            onClick={handleDeleteAccount}
            loading={deleteLoading}
          >
            {t("deleteAccountModal.deleteButton")}
          </Button>

          <Button outline type="primary" onClick={onClose}>
            {t("deleteAccountModal.cancelButton")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};