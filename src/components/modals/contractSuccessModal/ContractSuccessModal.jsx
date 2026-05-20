import Button from "@/components/ui/button/Button";
import { Modal } from "antd";
import Image from "next/image";
import styles from "./ContractSuccessModal.module.scss";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export const ContractSuccessModal = ({ onClose }) => {
  const router = useRouter();
  const t = useTranslations("contract.successModal");

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
          src="/images/contract.png"
          width={230}
          height={230}
          alt={t("imageAlt")}
        />

        <h2>{t("title")}</h2>

        <p>{t("description")}</p>

        <Button
          type="primary"
          onClick={() => {
            onClose();
            router.push("/profile/contracts");
          }}
        >
          {t("followRequest")}
        </Button>
      </div>
    </Modal>
  );
};