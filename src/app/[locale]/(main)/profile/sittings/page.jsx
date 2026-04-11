"use client";
import { PageHeader } from "@/components/profile/pageHeader/PageHeader";
import styles from "./page.module.scss";
import Button from "@/components/ui/button/Button";
import { DeleteAccountModal } from "@/components/modals/deleteAccountModal/DeleteAccountModal";
import { useUserStore } from "@/store/useUserStore";
import { useState } from "react";

export default function Page() {
  const userInfo = useUserStore((state) => state.info);
  console.log("user info:", userInfo);
  //states
  const [showDeleteModal, setShowModal] = useState();

  return (
    <div className={styles.container}>
      <PageHeader
        title={"إعدادات الحساب"}
        desc={"إدارة نوع حسابك و إعدادات الأمان النهائية"}
      />

      {showDeleteModal && <DeleteAccountModal onClose={() => setShowModal(false)}/>}

      <div className={styles.deleteAccount}>
        <div>
          <h1>حذف الحساب نهائيا</h1>
          <p>سيتم مسح كافة البيانات و المنشورات بشكل دائم ولا يمكن استرجاعها</p>
        </div>

        <Button outline onClick={() => setShowModal(true)}>
          حذف الحساب
        </Button>
      </div>
    </div>
  );
}
