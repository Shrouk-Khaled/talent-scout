"use client";

import { PageHeader } from "@/components/profile/pageHeader/PageHeader";
import styles from "./page.module.scss";
import Button from "@/components/ui/button/Button";
import { DeleteAccountModal } from "@/components/modals/deleteAccountModal/DeleteAccountModal";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("profile");

  const [showDeleteModal, setShowModal] = useState(false);

  return (
    <div className={styles.container}>
      <PageHeader
        title={t("settings.title")}
        desc={t("settings.description")}
      />

      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowModal(false)} />
      )}

      <div className={styles.deleteAccount}>
        <div>
          <h1>{t("settings.deleteAccount.title")}</h1>
          <p>{t("settings.deleteAccount.description")}</p>
        </div>

        <Button outline onClick={() => setShowModal(true)}>
          {t("settings.deleteAccount.button")}
        </Button>
      </div>
    </div>
  );
}