"use client";

import Button from "@/components/ui/button/Button";
import { Modal, message } from "antd";
import Image from "next/image";
import styles from "./DeleteAccountModal.module.scss";
import { useRouter } from "next/navigation";
import { deleteAccount } from "@/services/api";
import { useState } from "react";

export const DeleteAccountModal = ({ onClose }) => {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteAccount = () => {
    setDeleteLoading(true);
    deleteAccount().then(() => {
        setDeleteLoading(false)
        message.success("تم حذف الحساب بنجاح");
    }).finally(() => {
        setDeleteLoading(false)
        onClose();
        localStorage.clear();
        sessionStorage.clear();
        router.push("/");
    })
  }

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
          alt="Success"
        />
        <h2>تأكيد حذف الحساب</h2>
        <p>
          هل أنتِ متأكدة من رغبتك في حذف حسابك؟ يمكنكِ العودة في أي وقت بإنشاء
          حساب جديد.
        </p>

        <div className={styles.info}>
            <Image src={"/images/icons/info2.svg"} width={24} height={24} alt="icon"/>
            <span>سيؤدي حذف الحساب إلى إزالة جميع بياناتك ومحتواك بشكل دائم، ولن يكون بالإمكان استعادتها لاحقًا.</span>
        </div>
        <div className={styles.btns}>
          <Button
            type="primary"
            onClick={handleDeleteAccount}
            loading={deleteLoading}
          >
            حذف الحساب
          </Button>

          <Button
            outline
            type="primary"
            onClick={() => {
              onClose();
            }}
          >
            إلغاء
          </Button>
        </div>
      </div>
    </Modal>
  );
};
