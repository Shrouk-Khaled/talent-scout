"use client";

import styles from "./StepFive.module.scss";
import Button from "@/components/ui/button/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Headlines from "../headlines/Headlines";
import { Form, message } from "antd";
import UploadFiles from "@/components/ui/uploadFiles/UploadFiles";
import Input from "@/components/ui/input/Input";
import {
  confirmSignup,
  draftSignupData,
  signupSpecialCases,
} from "@/services/api";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useSignupStore } from "@/store/useSignupStore";

export default function StepFive() {
  const router = useRouter();
  const pathname = usePathname();
   //query params
  const searchParams = useSearchParams();
   const user_role = searchParams.get("user_role");
  const user_type = searchParams.get("user_type");
  const [form] = Form.useForm();
  //message
  const [messageApi, contextHolder] = message.useMessage();
  //store
  const saveUserData = useUserStore((state) => state.setUserData);
  const signupData = useSignupStore((state) => state.signupData);
  const clearSignupData = useSignupStore((state) => state.resetSignup);
  //states
  const [loading, setLoading] = useState(false);

  const makeUrl = (params) => {
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const handleNextStep = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      setLoading(true);
      const payload = {
        ...signupData,
        talentCategoryForm: `${JSON.stringify(signupData?.talentCategoryForm)}`,
        shortBio: signupData?.shortBio,
        file: signupData?.file,
        roleId: user_role,
        userTypeId: user_type,
        phone: signupData?.phone?.localNumber,
        prefixCode: signupData?.phone?.countryCode,
        email: signupData?.email,
      }
      const res = draftSignupData(payload, (progress) => {console.log(progress)}).then(() => {
          if (values?.shortBrief) {
            signupSpecialCases({
              shortBrief: form.getFieldValue("shortBrief"),
              file: form.getFieldValue("file"),
              email: searchParams.get("email"),
            })
              .then((res) => {
                handleConfirmSignup();
              })
              .catch((err) => {
                messageApi.open({
                  type: "error",
                  content: err?.message || "فشل في تعديل الحساب",
                });
                setLoading(false);
              });
          } else {
            handleConfirmSignup();
          }
        }).catch((err) => {
          setLoading(false);
        });
    } catch {}
  };

  const handleConfirmSignup = () => {
    confirmSignup({
      email: searchParams.get("email"),
    })
      .then((res) => {
        setLoading(false);
        saveUserData({
          ...res?.tokenResponse,
          firstName: signupData?.firstName,
          lastName: signupData?.lastName,
        });
        clearSignupData();
        router.push("/feed");
      })
      .catch((err) => {
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
        line1={"05 الفئات المدعومة مجانًا"}
        line2={" اختيارك يساعدنا في منحك دعم مجاني وباقة مميزة."}
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
                rules={[
                  {
                    required: getFieldValue("file") ? true : false,
                    message: "يرجى اختيار فئتك.",
                  },
                ]}
                className={styles.field}
                label="اذكر فئتك إن وجدت (اختياري)"
              >
                {/* <SelectInput
              placeholder={"اختر من هنا "}
              options={[
                { label: "ذوي الاحتياجات الخاصة", value: "disabled" },
                { label: "الأيتام", value: "orphan" },
                { label: "المطلقات", value: "divorced" },
                { label: "الأسر ذات الدخل المحدود", value: "low_income" },
              ]}
            /> */}
                <Input type="text" placeholder="اذكر فئتك إن وجدت" />
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
                label="أرفق ما يثبت حالتك"
                rules={
                  getFieldValue("shortBrief")
                    ? [
                        {
                          required: true,
                          message: "يرجى إرفاق ملف لإثبات حالتك.",
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
                  title="ارفع PDF لإثبات حالتك."
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.doc,.docx"
                  dir="rtl"
                  maxSize={20 * 1024 * 1024} // 20 MB soft limit (optional)
                />
              </Form.Item>
            )}
          </Form.Item>
        </Form>
      </div>

      <div className={styles.btns}>
        <div>
          <Button
            className={styles.nextBtn}
            onClick={handleNextStep}
            loading={loading}
          >
            انشاء الحساب
          </Button>
          <Button
            className={styles.backBtn}
            onClick={handlePrevStep}
            outline
          >
            السابق
          </Button>
        </div>
        <p>جميع الحقوق محفوظة تالنت سكوت</p>
      </div>
    </section>
  );
}
