"use client";

import Button from "@/components/ui/button/Button";
import { useRouter } from "@/i18n/navigation";
import { Result } from "antd";

export default function RemoveUserSuccessPage() {
  const router = useRouter();

  return (
    <Result
      status="success"
      title="تم حذف حسابك بنجاح"
      subTitle="شكرًا لاستخدامك منصة موهبتي."
      extra={
        <Button onClick={() => router.push("/")}>
          العودة للرئيسية
        </Button>
      }
    />
  );
}