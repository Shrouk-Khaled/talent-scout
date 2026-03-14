"use client";
import Image from "next/image";
import styles from "./page.module.scss";
import Button from "@/components/ui/button/Button";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Input from "@/components/ui/input/Input";
import { Checkbox, Form, message } from "antd";
import { login } from "@/services/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_BASE_URL } from "@/services/config";

export default function LoginPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  //states
  const [loading, setLoading] = useState(false);
  const [termsConfirmed, setTermsConfirmed] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if(!termsConfirmed) {
        messageApi.open({
          type: "error",
          content: "يرجى الموافقة على الشروط والأحكام للمتابعة"
        });
        return;
      }
      setLoading(true);                    

      const res = await login(values);
      if(!res?.otpState?.success){
        throw new Error(res?.otpState?.message || "Login failed");
      } else {
         // success
         messageApi.open({
          type: "success",
          content: res?.otpState?.message
        });
        router.push(`/auth/verify?userId=${encodeURIComponent(res?.userId)}&email=${encodeURIComponent(values.email)}`);
      }

    } catch (err) {
      if (!err?.errorFields) {
        console.error("Login Failed:", err);
      }
    } finally {
      setLoading(false);                  
    }
  };

  return (
    <div className={styles.formContainer}>
      {contextHolder}
      <div className={styles.header}>
        <div className={styles.brandIcon}>
          <Image src="/images/logo.png" alt="Brand" width={48} height={48} />
        </div>
        <h2 className={styles.title}>البريد الالكتروني</h2>
        <p className={styles.subtitle}>
          أدخل البريد الالكتروني لتسجيل الدخول أو إنشاء حساب
        </p>

        <Form layout="vertical" form={form} className={styles.phone} onFinish={handleSubmit}>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "الرجاء إدخال البريد الالكتروني",
              },
              {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "الرجاء إدخال بريد إلكتروني صحيح",
              }
            ]}
            className={styles.field}
            placeholder="مثال: Ahmedmohamed@gmail.com"
          >
            <Input type="text" placeholder="مثال: Ahmedmohamed@gmail.com" />
          </Form.Item>
        </Form>
      </div>

      <form className={styles.form}>
        <p className={styles.terms}>
          <Checkbox required onChange={(e) => setTermsConfirmed(e.target.checked)}/>
          اوافق على <a href="/terms" target="_blank">الشروط و الأحكام</a> و{" "} 
          <a href="/polices" target="_blank">سياسة الخصوصية</a> 
        </p>

        <Button onClick={handleSubmit} loading={loading} disabled={!termsConfirmed}>التالي</Button>

        <div className={styles.divider}>
          <span>أو</span>
        </div>

        <div className={styles.socialButtons}>
          <button type="button" className={styles.socialBtn}>
            <span>ابل</span>
            <FaApple />
          </button>
          <button type="button" onClick={()=> handleGoogleLogin()} className={styles.socialBtn}>
            <span>جوجل</span>
            <FcGoogle />
          </button>
        </div>
      </form>
    </div>
  );
}
