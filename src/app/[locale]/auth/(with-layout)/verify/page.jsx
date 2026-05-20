"use client";

import Image from "next/image";
import styles from "./page.module.scss";
import Button from "@/components/ui/button/Button";
import { useCallback, useEffect, useState } from "react";
import OtpInput from "@/components/ui/otpInput/OtpInput";
import { message } from "antd";
import { useSearchParams } from "next/navigation";
import { resendOtp, verifyOtp } from "@/services/api";
import { useUserStore } from "@/store/useUserStore";
import { getFcmToken } from "@/lib/fcm";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const MIN = 60;

const formatMMSS = (s) => {
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");

  return `${m}:${sec}`;
};

export default function VerifyPage() {
  const t = useTranslations("auth");

  const router = useRouter();
  const params = useSearchParams();

  const userId = params.get("userId") || "";
  const email = params.get("email") || "";

  const [messageApi, contextHolder] = message.useMessage();

  const saveUserData = useUserStore((state) => state.setUserData);

  const [secondsLeft, setSecondsLeft] = useState(MIN);
  const [otpNumber, setOtpNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const restart = useCallback(() => setSecondsLeft(MIN), []);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const id = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [secondsLeft]);

  const handleVerify = async (otp) => {
    try {
      setLoading(true);

      const fcmToken = await getFcmToken().catch(() => null);

      const res = await verifyOtp({
        userId,
        otpCode: otp,
        fcmToken,
        deviceType: "WEB",
      }).catch(() => {
        messageApi.open({
          type: "error",
          content: t("verify.messages.verifyFailed"),
        });

        return null;
      });

      if (res?.success) {
        messageApi.open({
          type: "success",
          content: t("verify.messages.verifySuccess"),
        });

        if (res?.token_response?.access_token) {
          saveUserData(res?.token_response);
          router.push("/feed");
        } else {
          router.push(
            `/auth/signup?userId=${encodeURIComponent(
              res?.user?.id
            )}&email=${encodeURIComponent(email)}`
          );
        }
      } else if (res?.success === false) {
        messageApi.open({
          type: "error",
          content: res?.message || t("verify.messages.verifyFailed"),
        });
      }

      setOtpNumber("");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await resendOtp({ email });

      if (res.success) {
        restart();

        messageApi.open({
          type: "success",
          content: t("verify.messages.resendSuccess"),
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error?.message || t("verify.messages.resendFailed"),
      });
    }
  };

  return (
    <div className={styles.formContainer}>
      {contextHolder}

      <div className={styles.header}>
        <div className={styles.brandIcon}>
          <Image
            src="/images/logo.png"
            alt={t("verify.brandAlt")}
            width={48}
            height={48}
          />
        </div>

        <h2 className={styles.title}>{t("verify.title")}</h2>

        <p className={styles.subtitle}>
          {t("verify.subtitle", { email })}
        </p>

        <div className={styles.phone}>
          <OtpInput
            length={6}
            onChange={(val) => {
              setOtpNumber(val);

              if (val.length === 6) {
                handleVerify(val);
              }
            }}
            clearOtp={!otpNumber.length}
          />

          <div className={styles.timerBox}>
            <button onClick={handleResend} disabled={secondsLeft > 0}>
              {t("verify.resendQuestion")}
            </button>

            <div className={styles.timer}>{formatMMSS(secondsLeft)}</div>
          </div>
        </div>
      </div>

      <form className={styles.form}>
        <Button disabled={otpNumber.length < 6} loading={loading}>
          {t("verify.next")}
        </Button>
      </form>
    </div>
  );
}