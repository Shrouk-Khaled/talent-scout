import Button from "@/components/ui/button/Button";
import { Modal } from "antd";
import Image from "next/image";
import styles from "./ContractSuccessModal.module.scss";
import { useRouter } from "next/navigation";

export const ContractSuccessModal = ({ onClose }) => {
    const router = useRouter();
    
  return (
    <Modal
      open={true}
      footer={null}
      onCancel={onClose}
      centered
      style={{ direction: "rtl", textAlign: "center" }}      
    >
      <div className={styles.content}>
        <Image src="/images/contract.png" width={230} height={230} alt="Success" />
        <h2>تم إرسال الطلب بنجاح</h2>
        <p>
        سيتم إخطار الموهوب بالطلب و سيتم فتح المحادثة في حالة قبوله للطلب
        </p>
        <Button type="primary" onClick={() => {
            onClose();
            router.push("/profile/contracts");
        }}>
          متابعة الطلب
        </Button>
      </div>
    </Modal>
  );
};
