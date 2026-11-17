
"use client";

import Image from "next/image";
import styles from "./page.module.scss";
import Button from "@/components/ui/button/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import OtpInput from "@/components/ui/otpInput/OtpInput";
import { message } from "antd";
import { useSearchParams } from "next/navigation";
import { resendOtp, verifyOtp, removeUser } from "@/services/api";
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
  const tr = useTranslations("removeUser");

  const router = useRouter();
  const params = useSearchParams();

  const userId = params.get("userId") || "";
  const email = params.get("email") || "";

  const isRemoveUser = params.get("flow") === "remove-user";

  const [messageApi, contextHolder] = message.useMessage();

  const saveUserData = useUserStore((state) => state.setUserData);

  const [secondsLeft, setSecondsLeft] = useState(MIN);
  const [otpNumber, setOtpNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Prevent duplicate requests when OTP reaches 6 digits
  const verifyingRef = useRef(false);

  const restart = useCallback(() => {
    setSecondsLeft(MIN);
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const id = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [secondsLeft]);

  const handleVerify = async (otp) => {
    if (verifyingRef.current || otp?.length !== 6) return;

    verifyingRef.current = true;
    setLoading(true);

    try {
      if (!userId || !email) {
        messageApi.error(t("verify.messages.verifyFailed"));
        return;
      }

      const fcmToken = isRemoveUser
        ? null
        : await getFcmToken().catch(() => null);

      const res = await verifyOtp({
        userId,
        otpCode: otp,
        fcmToken,
        deviceType: "WEB",
      });

      if (!res?.success) {
        messageApi.error(
          res?.message || t("verify.messages.verifyFailed")
        );
        return;
      }

      // ==========================================
      // REMOVE USER FLOW
      // ==========================================
      if (isRemoveUser) {
        const accessToken = res?.token_response?.access_token;

        // No token means we cannot delete an existing account
        if (!accessToken) {
          messageApi.error(tr("accountNotFound"));
          return;
        }

        // Delete account using the verified access token
        const deleteRes = await removeUser(accessToken);

        if (deleteRes?.success) {
          messageApi.success(
            deleteRes?.message || tr("successTitle")
          );

          router.replace("/auth/remove-user/success");
        } else {
          messageApi.error(
            deleteRes?.message || tr("deleteFailed")
          );
        }

        return;
      }

      // ==========================================
      // NORMAL LOGIN FLOW
      // ==========================================
      messageApi.success(
        t("verify.messages.verifySuccess")
      );

      if (res?.token_response?.access_token) {
        saveUserData(res.token_response);
        router.push("/feed");
      } else {
        router.push(
          `/auth/signup?userId=${encodeURIComponent(
            res?.user?.id || userId
          )}&email=${encodeURIComponent(email)}`
        );
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);

      messageApi.error(
        error?.response?.data?.message ||
          (isRemoveUser
            ? tr("deleteFailed")
            : t("verify.messages.verifyFailed"))
      );
    } finally {
      setOtpNumber("");
      setLoading(false);
      verifyingRef.current = false;
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || resendLoading || loading) return;

    try {
      setResendLoading(true);

      const res = await resendOtp({ email });

      if (res?.success) {
        restart();

        messageApi.success(
          t("verify.messages.resendSuccess")
        );
      } else {
        messageApi.error(
          res?.message || t("verify.messages.resendFailed")
        );
      }
    } catch (error) {
      messageApi.error(
        error?.response?.data?.message ||
          t("verify.messages.resendFailed")
      );
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpChange = (val) => {
    if (verifyingRef.current) return;

    setOtpNumber(val);

    if (val.length === 6) {
      handleVerify(val);
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

        <h2 className={styles.title}>
          {isRemoveUser
            ? tr("verifyTitle")
            : t("verify.title")}
        </h2>

        <p className={styles.subtitle}>
          {isRemoveUser
            ? tr("verifySubtitle", { email })
            : t("verify.subtitle", { email })}
        </p>

        <div className={styles.phone}>
          <OtpInput
            length={6}
            onChange={handleOtpChange}
            clearOtp={!otpNumber.length}
          />

          <div className={styles.timerBox}>
            <button
              type="button"
              onClick={handleResend}
              disabled={
                secondsLeft > 0 ||
                resendLoading ||
                loading
              }
            >
              {t("verify.resendQuestion")}
            </button>

            <div className={styles.timer}>
              {formatMMSS(secondsLeft)}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.form}>
        <Button
          onClick={() => handleVerify(otpNumber)}
          disabled={otpNumber.length < 6 || loading}
          loading={loading}
        >
          {isRemoveUser
            ? tr("next")
            : t("verify.next")}
        </Button>
      </div>
    </div>
  );
}
