"use client";

import Image from "next/image";
import styles from "./page.module.scss";
import { Breadcrumb, Form, message } from "antd";
import Input from "@/components/ui/input/Input";
import Button from "@/components/ui/button/Button";
import PhoneInput from "@/components/ui/phoneInput/PhoneInput";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import Loading from "@/app/[locale]/loading";
import TextArea from "@/components/ui/textArea/TextArea";
import { editProfile } from "@/services/api";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Page() {
  const router = useRouter();
  const t = useTranslations("profile");

  const userInfo = useUserStore((state) => state.info);
  const userRole = userInfo?.user?.user_role;
  const userStatus = userInfo?.user?.user_status;
  // console.log(userInfo)
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (userInfo?.user) {
      form.setFieldsValue({
        firstName: userInfo.user.first_name || "",
        lastName: userInfo.user.last_name || "",
        phone: userInfo.user.phone || "",
        short_bio: userInfo.user.short_bio || "",
        companyName: userInfo.user.company_name || "",
      });

      setLoading(false);
    }
  }, [userInfo, form]);

  const handleEditProfile = async () => {
    try {
      const values = await form.validateFields();

      setSaveLoading(true);

      await editProfile({
        first_name: values.firstName,
        last_name: values.lastName,
        short_bio: values.short_bio,
        prefix_code: values.phone?.countryCode || userInfo?.user?.country_code || "",
        phone_number: values.phone?.localNumber || userInfo?.user?.phone?.replace(userInfo?.user?.country_code, "") || "",
      });

      message.success(t("edit.successMessage"));
      router.back();
    } catch (err) {
      console.error("Validation Failed:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {loading && <Loading />}

      <Breadcrumb
        items={[
          {
            title: t("breadcrumb.myAccount"),
            href:
              userInfo?.user?.user_role === 1
                ? "/profile/posts"
                : "/profile/saved?type=posts",
          },
          {
            title: t("breadcrumb.editAccount"),
          },
        ]}
        className={styles.breadcrumb}
      />

      <div className={styles.imagesBox}>
        <Image
          src="/images/bg-hero.png"
          width={1000}
          height={300}
          alt={t("edit.coverAlt")}
          priority
          className={styles.cover}
        />

        <Image
          src="/images/bg-auth.png"
          width={150}
          height={150}
          alt={t("edit.avatarAlt")}
          className={styles.avatar}
        />
      </div>

      <div className={styles.main}>
        <Form layout="vertical" form={form} className={styles.form}>
          {
            (userRole === 1 || (userRole == 2 && userStatus == 1)) &&
            <div className={styles.row}>
              <Form.Item
                name="firstName"
                className={styles.field}
                label={t("edit.firstName")}
                rules={[
                  {
                    required: true,
                    message: t("edit.validation.firstNameRequired"),
                  },
                  {
                    pattern: /^[A-Za-z\u0600-\u06FF\s]+$/,
                    message: t("edit.validation.lettersOnlyFirstName"),
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder={t("edit.firstNamePlaceholder")}
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                className={styles.field}
                label={t("edit.lastName")}
                rules={[
                  {
                    required: true,
                    message: t("edit.validation.lastNameRequired"),
                  },
                  {
                    pattern: /^[A-Za-z\u0600-\u06FF\s]+$/,
                    message: t("edit.validation.lettersOnlyLastName"),
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder={t("edit.lastNamePlaceholder")}
                />
              </Form.Item>
            </div>
          }

          {
            (userRole === 2 && userStatus === 2) &&
            <Form.Item
              name="companyName"
              className={styles.field}
              label={t("edit.companyName")}
              rules={[
                {
                  required: true,
                  message: t("edit.validation.firstNameRequired"),
                },
                {
                  pattern: /^[A-Za-z\u0600-\u06FF\s]+$/,
                  message: t("edit.validation.lettersOnlyFirstName"),
                },
              ]}
            >
              <Input
                type="text"
                placeholder={t("edit.firstNamePlaceholder")}
              />
            </Form.Item>
          }


          <Form.Item
            name="phone"
            className={styles.field}
            label={t("edit.phone")}
            rules={[
              {
                required: true,
                message: t("edit.validation.phoneRequired"),
              },
            ]}
            valuePropName="phone"
            trigger="onChange"
          >
            <PhoneInput value={form.getFieldValue("phone")} />
          </Form.Item>

          <Form.Item
            name="short_bio"
            className={styles.field}
            label={t("edit.shortBio")}
            rules={[
              {
                required: true,
                message: t("edit.validation.shortBioRequired"),
              },
            ]}
          >
            <TextArea
              maxLength={250}
              placeholder={t("edit.shortBioPlaceholder")}
              haveLengthLine
            />
          </Form.Item>

          <Button
            className={styles.submitBtn}
            loading={saveLoading}
            onClick={handleEditProfile}
          >
            {t("edit.saveChanges")}
          </Button>
        </Form>
      </div>
    </div>
  );
}