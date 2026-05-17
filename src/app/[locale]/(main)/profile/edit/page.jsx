"use client";
import Image from "next/image";
import styles from "./page.module.scss";
import { Breadcrumb, Form } from "antd";
import Input from "@/components/ui/input/Input";
import Button from "@/components/ui/button/Button";
import PhoneInput from "@/components/ui/phoneInput/PhoneInput";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import Loading from "@/app/[locale]/loading";

export default function Page() {
  const userInfo = useUserStore((state) => state.info);
  const [form] = Form.useForm();
  //states
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userInfo?.user) {
      form.setFieldsValue({
        firstName: userInfo.user.first_name || "",
        lastName: userInfo.user.last_name || "",
        phone: userInfo.user.phone || "",
      });
      setLoading(false);
    }
  }, [userInfo]);

  const handleEditProfile = async () => {
    try {
      const values = await form.validateFields();
      console.log("Profile Data:", values);
    } catch (err) {
      console.error("Validation Failed:", err);
    }
  };

  return (
    <div className={styles.container}>
      {loading && <Loading />}
      <Breadcrumb
        items={[
          {
            title: "حسابي",
            href:
              userInfo?.user?.user_role == 1
                ? "/profile/posts"
                : "/profile/saved?type=posts",
          },
          {
            title: "تعديل الحساب",
          },
        ]}
        className={styles.breadcrumb}
      />

      <div className={styles.imagesBox}>
        <Image
          src={"/images/bg-hero.png"}
          width={1000}
          height={300}
          alt="profile edit"
          priority
          className={styles.cover}
        />
        <Image
          src={"/images/bg-auth.png"}
          width={150}
          height={150}
          alt="user profile"
          className={styles.avatar}
        />
      </div>

      <div className={styles.main}>
        <Form layout="vertical" form={form} className={styles.form}>
          <div className={styles.row}>
            <Form.Item
              name="firstName"
              rules={[
                { required: true, message: "الرجاء إدخال الاسم الأول" },
                {
                  pattern: /^[A-Za-z\u0600-\u06FF\s]+$/,
                  message: "الاسم الأول يجب أن يحتوي على حروف فقط",
                },
              ]}
              className={styles.field}
              label="الاسم الأول"
            >
              <Input type="text" placeholder="مثال: أحمد" />
            </Form.Item>

            <Form.Item
              name="lastName"
              className={styles.field}
              rules={[
                { required: true, message: "الرجاء إدخال الاسم الثاني" },
                {
                  pattern: /^[A-Za-z\u0600-\u06FF\s]+$/,
                  message: "الاسم الأول يجب أن يحتوي على حروف فقط",
                },
              ]}
              label="الاسم الثاني"
            >
              <Input type="text" placeholder="مثال: محمد علي" />
            </Form.Item>
          </div>

          <Form.Item
            name="phone"
            className={styles.field}
            label="رقم الجوال"
            rules={[{ required: true, message: "الرجاء إدخال رقم الهاتف" }]}
            valuePropName="phone"
            trigger="onChange"
          >
            <PhoneInput value={form.getFieldValue("phone")} />
          </Form.Item>

          <Button className={styles.submitBtn} onClick={handleEditProfile}>
            Save
          </Button>
        </Form>
      </div>
    </div>
  );
}
