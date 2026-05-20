"use client";

import styles from "./StepFive.module.scss";
import Button from "@/components/ui/button/Button";
import { useSearchParams } from "next/navigation";
import Headlines from "../headlines/Headlines";
import { Form, message } from "antd";
import UploadFiles from "@/components/ui/uploadFiles/UploadFiles";
import {
  confirmSignup,
  draftSignupData,
  signupSpecialCases,
} from "@/services/api";
import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useSignupStore } from "@/store/useSignupStore";
import { getFcmToken } from "@/lib/fcm";
import SelectInput from "@/components/ui/selectInput/SelectInput";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function StepFive() {
  const t = useTranslations("signup");

  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const user_role = searchParams.get("user_role");
  const user_type = searchParams.get("user_type");

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const saveUserData = useUserStore((state) => state.setUserData);
  const signupData = useSignupStore((state) => state.signupData);
  const clearSignupData = useSignupStore((state) => state.resetSignup);

  const [loading, setLoading] = useState(false);

  const makeUrl = (params) => {
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const handleNextStep = async () => {
    try {
      await form.validateFields();

      const values = form.getFieldsValue();
      const fcmToken = await getFcmToken().catch(() => null);

      setLoading(true);

      const payload = {
        ...signupData,
        talentCategoryForm: JSON.stringify(signupData?.talentCategoryForm),
        shortBio: signupData?.shortBio,
        file: signupData?.file,
        roleId: user_role,
        userTypeId: user_type,
        phone: signupData?.phone?.localNumber,
        prefixCode: signupData?.phone?.countryCode,
        email: signupData?.email,
        fcmToken,
        typeId: signupData?.file?.[0]?.type?.includes("image") ? 1 : 2,
        deviceType: "WEB",
      };

      draftSignupData(payload, (progress) => {
        console.log(progress);
      })
        .then(() => {
          if (values?.shortBrief) {
            signupSpecialCases({
              shortBrief: form.getFieldValue("shortBrief"),
              file: form.getFieldValue("file"),
              email: searchParams.get("email"),
            })
              .then(() => {
                handleConfirmSignup();
              })
              .catch((err) => {
                messageApi.open({
                  type: "error",
                  content:
                    err?.message || t("stepFive.messages.editAccountFailed"),
                });

                setLoading(false);
              });

            return;
          }

          handleConfirmSignup();
        })
        .catch((err) => {
          console.error("Draft signup failed:", err);
          setLoading(false);
        });
    } catch (error) {
      console.error("Step five validation failed:", error);
    }
  };

  const handleConfirmSignup = () => {
    confirmSignup({
      email: searchParams.get("email"),
    })
      .then((res) => {
        saveUserData({
          ...res?.token_response,
          firstName: signupData?.firstName,
          lastName: signupData?.lastName,
          token: res?.token_response?.access_token,
        });

        clearSignupData();
        router.push("/feed");
      })
      .catch((err) => {
        console.error("Confirm signup failed:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePrevStep = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("step", "4");

    router.push(makeUrl(params), { scroll: false });
  };

  return (
    <section className={styles.main}>
      {contextHolder}

      <Headlines
        line1={t("stepFive.headlines.line1")}
        line2={t("stepFive.headlines.line2")}
      />

      <div className={styles.form}>
        <Form layout="vertical" form={form}>
          <Form.Item
            shouldUpdate={(prev, cur) => prev.file !== cur.file}
            noStyle
          >
            {({ getFieldValue }) => (
              <Form.Item
                name="shortBrief"
                className={styles.field}
                label={t("stepFive.fields.shortBrief")}
                rules={[
                  {
                    required: getFieldValue("file")?.length > 0,
                    message: t("stepFive.validation.categoryRequired"),
                  },
                ]}
              >
                <SelectInput
                  placeholder={t("stepFive.placeholders.shortBrief")}
                  options={[
                    {
                      label: t("stepFive.categories.blind"),
                      value: t("stepFive.categories.blind"),
                    },
                    {
                      label: t("stepFive.categories.disability"),
                      value: t("stepFive.categories.disability"),
                    },
                    {
                      label: t("stepFive.categories.hearing"),
                      value: t("stepFive.categories.hearing"),
                    },
                    {
                      label: t("stepFive.categories.deaf"),
                      value: t("stepFive.categories.deaf"),
                    },
                    {
                      label: t("stepFive.categories.physicalDisability"),
                      value: t("stepFive.categories.physicalDisability"),
                    },
                    {
                      label: t("stepFive.categories.other"),
                      value: t("stepFive.categories.other"),
                    },
                  ]}
                />
              </Form.Item>
            )}
          </Form.Item>

          <Form.Item
            shouldUpdate={(prev, cur) => prev.shortBrief !== cur.shortBrief}
            noStyle
          >
            {({ getFieldValue }) => (
              <Form.Item
                name="file"
                className={styles.field}
                label={t("stepFive.fields.file")}
                rules={
                  getFieldValue("shortBrief")
                    ? [
                        {
                          required: true,
                          message: t("stepFive.validation.fileRequired"),
                        },
                      ]
                    : []
                }
                valuePropName="files"
                trigger="onFiles"
              >
                <UploadFiles
                  onFiles={(files, meta) => {}}
                  files={getFieldValue("file")}
                  title={t("stepFive.upload.title")}
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.doc,.docx"
                  dir="rtl"
                  maxSize={20 * 1024 * 1024}
                />
              </Form.Item>
            )}
          </Form.Item>
        </Form>
      </div>

      <div className={styles.btns}>
        <div className={styles.info}>
          <Button
            className={styles.nextBtn}
            onClick={handleNextStep}
            loading={loading}
          >
            {t("stepFive.buttons.createAccount")}
          </Button>

          <Button className={styles.backBtn} onClick={handlePrevStep} outline>
            {t("stepFive.buttons.back")}
          </Button>
        </div>

        <p>{t("stepFive.copyright")}</p>
      </div>
    </section>
  );
}