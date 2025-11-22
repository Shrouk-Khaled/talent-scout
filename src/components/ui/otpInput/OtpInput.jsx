"use client";
import { useEffect, useState } from "react";
import { Input } from "antd";
import styles from "./OtpInput.module.scss";

const normalizeDigits = (text = "") =>
  text
    .replace(/[^\d\u0660-\u0669]/g, "")
    .replace(/[\u0660-\u0669]/g, d => String(d.charCodeAt(0) - 0x0660));

export default function OtpInput({ length = 6, onChange, disabled = false, clearOtp }) {
  const [otp, setOtp] = useState("");

  useEffect(() => {
    setOtp(prev => (prev || "").slice(0, length));
  }, [length]);

  useEffect(() => {
    if (clearOtp) {
      setOtp("");
    }
  },[clearOtp])

  const handleChange = (v) => {
    const onlyDigits = normalizeDigits(v || "").slice(0, length);
    setOtp(onlyDigits);
    onChange?.(onlyDigits); 
  };

  return (
    <div className={styles.otpInput}>
      <Input.OTP
        value={otp}
        onChange={handleChange}
        onPaste={(e) => {
          const pasted = e.clipboardData.getData("text");
          handleChange(pasted);
          e.preventDefault();
        }}
        length={length}
        autoFocus
        dir="ltr"
        size="large"
        inputMode="numeric"
        disabled={disabled}
        style={{ gap: 30 }}
        className={styles.bigOtp}
        aria-label="OTP code"
      />
    </div>
  );
}
