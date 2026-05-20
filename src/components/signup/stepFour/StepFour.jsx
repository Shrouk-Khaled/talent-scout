"use client";

import styles from "./StepFour.module.scss";
import Button from "@/components/ui/button/Button";
import { useSearchParams } from "next/navigation";
import Headlines from "../headlines/Headlines";
import { Form } from "antd";
import Input from "@/components/ui/input/Input";
import SelectInput from "@/components/ui/selectInput/SelectInput";
import TextArea from "@/components/ui/textArea/TextArea";
import UploadFiles from "@/components/ui/uploadFiles/UploadFiles";
import { useEffect, useState } from "react";
import { getSubCatFormFields } from "@/services/api";
import { useSignupStore } from "@/store/useSignupStore";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function StepFour() {
  const t = useTranslations("signup");

  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const user_role = searchParams.get("user_role");
  const user_type = searchParams.get("user_type");

  const [form] = Form.useForm();
  const [bioForm] = Form.useForm();

  const signupData = useSignupStore((state) => state.signupData);
  const updateSignupData = useSignupStore((state) => state.updateSignupData);

  const [formFields, setFormFields] = useState([]);

  useEffect(() => {
    if (!signupData?.subCategoryId) return;

    getSubCatFormFields(signupData?.subCategoryId).then((res) => {
      setFormFields(res?.data?.form?.fields || []);

      form.setFieldsValue(signupData?.talentCategoryForm || {});

      bioForm.setFieldsValue({
        shortBio: signupData?.shortBio || "",
        file: signupData?.file || null,
      });
    });
  }, [signupData?.subCategoryId, form, bioForm]);

  const makeUrl = (params) => {
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const handleNextStep = async () => {
    try {
      await form.validateFields();

      const values = form.getFieldsValue();

      await bioForm.validateFields();

      const bioValues = bioForm.getFieldsValue();

      updateSignupData({
        talentCategoryForm: values,
        shortBio: bioValues?.shortBio,
        file: bioValues?.file,
      });

      const params = new URLSearchParams(searchParams.toString());

      params.set("step", "5");

      router.push(makeUrl(params), { scroll: false });
    } catch (error) {
      console.error("Step four validation failed:", error);
    }
  };

  const handlePrevStep = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("step", "3");

    router.push(makeUrl(params), { scroll: false });
  };

  return (
    <section className={styles.main}>
      <Headlines
        line1={t("stepFour.headlines.line1")}
        line2={t("stepFour.headlines.line2")}
      />

      <div className={styles.form}>
        <Form layout="vertical" form={form}>
          {formFields?.map((field) => {
            if (field.type === "text") {
              return (
                <Form.Item
                  key={field.id}
                  name={field?.id}
                  className={styles.field}
                  rules={
                    field.required
                      ? [
                          {
                            required: true,
                            message: t("stepFour.validation.requiredField", {
                              field: field.label,
                            }),
                          },
                        ]
                      : []
                  }
                  label={field.label}
                >
                  <Input
                    type="text"
                    placeholder={
                      field.placeholder ||
                      t("stepFour.placeholders.enterField", {
                        field: field.label,
                      })
                    }
                  />
                </Form.Item>
              );
            }

            if (field.type === "select" || field.type === "multiselect") {
              return (
                <Form.Item
                  key={field.id}
                  name={field?.id}
                  className={styles.field}
                  rules={
                    field.required
                      ? [
                          {
                            required: true,
                            message: t("stepFour.validation.requiredField", {
                              field: field.label,
                            }),
                          },
                        ]
                      : []
                  }
                  label={field.label}
                >
                  <SelectInput
                    placeholder={
                      field.placeholder ||
                      t("stepFour.placeholders.selectField", {
                        field: field.label,
                      })
                    }
                    options={field.options.map((opt) => ({
                      value: opt.id,
                      label: opt.label,
                    }))}
                    multiple={field.type === "multiselect"}
                  />
                </Form.Item>
              );
            }

            return null;
          })}
        </Form>

        <Form layout="vertical" form={bioForm}>
          <Form.Item
            name="shortBio"
            className={styles.field}
            label={t("stepFour.fields.shortBio")}
            rules={[
              {
                required: true,
                message: t("stepFour.validation.shortBioRequired"),
              },
            ]}
          >
            <TextArea
              maxLength={250}
              placeholder={t("stepFour.placeholders.shortBio")}
              haveLengthLine
            />
          </Form.Item>

          <Form.Item
            name="file"
            className={styles.field}
            label={t("stepFour.fields.file")}
            rules={[
              {
                required: true,
                message: t("stepFour.validation.fileRequired"),
              },
            ]}
            valuePropName="files"
            trigger="onFiles"
          >
            <UploadFiles
              title={t("stepFour.upload.title")}
              accept="image/*,video/*"
              maxSize={80 * 1024 * 1024}
              dir="rtl"
            />
          </Form.Item>
        </Form>
      </div>

      <div className={styles.btns}>
        <div>
          <Button className={styles.nextBtn} onClick={handleNextStep}>
            {t("stepFour.buttons.next")}
          </Button>

          <Button className={styles.backBtn} onClick={handlePrevStep} outline>
            {t("stepFour.buttons.back")}
          </Button>
        </div>

        <p>{t("stepFour.copyright")}</p>
      </div>
    </section>
  );
}