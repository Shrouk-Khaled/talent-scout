"use client";
import Image from "next/image";
import styles from "./page.module.scss";
import Button from "@/components/ui/button/Button";
import { useCallback, useEffect, useState } from "react";
import OtpInput from "@/components/ui/otpInput/OtpInput";
import { message } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { resendOtp, verifyOtp } from "@/services/api";
import { useUserStore } from "@/store/useUserStore";

const MIN = 600; // seconds

const formatMMSS = (s) => {
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${m}:${sec}`;
};

export default function VerifyPage() {
  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get("userId") || "";
  const email = params.get("email") || "";
  const [messageApi, contextHolder] = message.useMessage();
  //store
  const saveUserData = useUserStore((state) => state.setUserData);
  //state
  const [secondsLeft, setSecondsLeft] = useState(MIN);
  const [otpNumber, setOtpNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const restart = useCallback(() => setSecondsLeft(MIN), []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const handleVerify = async (otp) => {
    setLoading(true);
    const res = await verifyOtp({ userId, otpCode: otp })
    .catch((err) => {
      messageApi.open({
        type: "error",
        content: err?.message || "فشل التحقق من رمز التحقق"
      });
      return null;
    })
    if (res?.success) {
      messageApi.open({
        type: "success",
        content: "تم التحقق بنجاح"
      });
      if(res?.tokenResponse?.accessToken) {
        saveUserData(res?.tokenResponse);
        router.push("/feed")
      } else {
        router.push(`/auth/signup?userId=${encodeURIComponent(res?.userId)}&email=${encodeURIComponent(email)}`);
      }
    } else if(res?.success == false) {
      messageApi.open({
        type: "error",
        content: res?.message || "فشل التحقق من رمز التحقق"
      });
    }
    setOtpNumber("");
    setLoading(false);
  }

  const handleResend = async () => {
      try {
        const res = await resendOtp({ email });
        if(res.success) {
          restart();      
          messageApi.open({
            type: 'success',
            content: "تم ارسال رمز التحقق الى بريدك الالكتروني بنجاح"
          });    
        }
      } catch (error) {
        messageApi.open({
          type: 'error',
          content: error?.message || "فشل اعادة ارسال رمز التحقق"
        });        
        return;
      }
  };


  return (
    <div className={styles.formContainer}>
      {contextHolder}
      <div className={styles.header}>
        <div className={styles.brandIcon}>
          <Image src="/images/logo.png" alt="Brand" width={48} height={48} />
        </div>
        <h2 className={styles.title}>ادخل رمز التحقق</h2>
        <p className={styles.subtitle}>ادخل الرمز المرسل إلى {email}</p>

        <div className={styles.phone}>
          <OtpInput length={6} onChange={(val) => {setOtpNumber(val); handleVerify(val)}} clearOtp={!otpNumber.length}/>
          <div className={styles.timerBox}>
            <p onClick={handleResend}>لم يصلك رمز التحقق؟</p>
            <div className={styles.timer}>{formatMMSS(secondsLeft)}</div>
          </div>
        </div>
      </div>

      <form className={styles.form}>
        <Button
          disabled={otpNumber.length < 6}
          loading={loading}
        >التالي</Button>
      </form>
    </div>
  );
}
