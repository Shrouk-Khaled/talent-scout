"use client";

import styles from "./StepTwoResearcher.module.scss";
import Button from "@/components/ui/button/Button";
import { useSearchParams } from "next/navigation";
import Headlines from "../headlines/Headlines";
import { Form, message } from "antd";
import Input from "@/components/ui/input/Input";
import PhoneInput from "@/components/ui/phoneInput/PhoneInput";
import SelectInput from "@/components/ui/selectInput/SelectInput";
import UploadFiles from "@/components/ui/uploadFiles/UploadFiles";
import { useSignupStore } from "@/store/useSignupStore";
import { useEffect, useState } from "react";
import { checkPhoneExists } from "@/services/api";
import { countries } from "../../../../public/countries_with_cities_ar";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function StepTwoResearcher() {
  const t = useTranslations("signup");
  const locale = useLocale()

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const updateSignupData = useSignupStore((state) => state.updateSignupData);
  const signupData = useSignupStore((state) => state.signupData);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      ...signupData,
      email: email,
      country: signupData?.country || undefined,
      city: signupData?.city || undefined,
    });
  }, [signupData, email, form]);

  const makeUrl = (params) => {
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const handleNextStep = async () => {
    try {
      await form.validateFields();

      const values = form.getFieldsValue();

      setLoading(true);

      const res = await checkPhoneExists({
        phone: `${values?.phone?.countryCode}${values?.phone?.localNumber}`,
      });

      if (res?.isExist) {
        messageApi.open({
          type: "error",
          content: t("stepTwoResearcher.messages.phoneAlreadyExists"),
        });

        return;
      }

      messageApi.open({
        type: "success",
        content: res?.otpState?.message,
      });

      updateSignupData(values);

      const params = new URLSearchParams(searchParams.toString());

      params.set("step", "3");

      router.push(makeUrl(params), { scroll: false });
    } catch (error) {
      messageApi.open({
        type: "error",
        content: t("stepTwoResearcher.messages.formError"),
      });

      console.error("Step two researcher validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevStep = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("step", "1");

    router.push(makeUrl(params), { scroll: false });
  };

  return (
    <section className={styles.main}>
      {contextHolder}

      <Headlines
        line1={t("stepTwoResearcher.headlines.line1")}
        line2={t("stepTwoResearcher.headlines.line2")}
      />

      <div className={styles.form}>
        <Form layout="vertical" form={form} initialValues={{ email: email }}>
          <Form.Item
            name="companyName"
            className={styles.field}
            label={t("stepTwoResearcher.fields.companyName")}
            rules={[
              {
                required: true,
                message: t("stepTwoResearcher.validation.companyNameRequired"),
              },
            ]}
          >
            <Input
              type="text"
              placeholder={t("stepTwoResearcher.placeholders.companyName")}
            />
          </Form.Item>

          <Form.Item
            name="commercialRegNo"
            className={styles.field}
            label={t("stepTwoResearcher.fields.commercialRegNo")}
            rules={[
              {
                required: true,
                message: t(
                  "stepTwoResearcher.validation.commercialRegNoRequired"
                ),
              },
              {
                pattern: /^[0-9 ]+$/,
                message: t(
                  "stepTwoResearcher.validation.commercialRegNoNumbersOnly"
                ),
              },
            ]}
          >
            <Input
              type="text"
              placeholder={t("stepTwoResearcher.placeholders.commercialRegNo")}
            />
          </Form.Item>

          <Form.Item
            name="contactPerson"
            className={styles.field}
            label={t("stepTwoResearcher.fields.contactPerson")}
            rules={[
              {
                required: true,
                message: t(
                  "stepTwoResearcher.validation.contactPersonRequired"
                ),
              },
            ]}
          >
            <Input
              type="text"
              placeholder={t("stepTwoResearcher.placeholders.contactPerson")}
            />
          </Form.Item>

          <Form.Item
            name="email"
            className={styles.field}
            label={t("stepTwoResearcher.fields.email")}
            rules={[
              {
                required: true,
                message: t("stepTwoResearcher.validation.emailRequired"),
              },
            ]}
          >
            <Input
              type="text"
              placeholder={t("stepTwoResearcher.placeholders.email")}
              disabled
            />
          </Form.Item>

          <Form.Item
            name="phone"
            className={styles.field}
            label={t("stepTwoResearcher.fields.phone")}
            rules={[
              {
                required: true,
                message: t("stepTwoResearcher.validation.phoneRequired"),
              },
            ]}
            valuePropName="phone"
            trigger="onChange"
          >
            <PhoneInput
              value={`${signupData?.phone?.countryCode || ""}${
                signupData?.phone?.localNumber || ""
              }`}
            />
          </Form.Item>

          <div className={styles.row}>
            <Form.Item
              name="country"
              className={styles.field}
              label={t("stepTwoResearcher.fields.country")}
              rules={[
                {
                  required: true,
                  message: t("stepTwoResearcher.validation.countryRequired"),
                },
              ]}
            >
              <SelectInput
                placeholder={t("stepTwoResearcher.placeholders.country")}
                options={countries.map((country) => ({
                  value: country.country_code,
                  label: locale === "ar" ? country.country_ar : country.country_en,
                }))}
              />
            </Form.Item>

            <Form.Item
              shouldUpdate={(prev, cur) => prev.country !== cur.country}
              noStyle
            >
              {({ getFieldValue }) => (
                <Form.Item
                  name="city"
                  className={styles.field}
                  label={t("stepTwoResearcher.fields.city")}
                  rules={[
                    {
                      required: true,
                      message: t("stepTwoResearcher.validation.cityRequired"),
                    },
                  ]}
                >
                  <SelectInput
                    placeholder={t("stepTwoResearcher.placeholders.city")}
                    options={
                      countries
                        .find(
                          (country) =>
                            country.country_code === getFieldValue("country")
                        )
                        ?.cities.map((city) => ({
                          value: city.city_code,
                          label: locale === "ar" ? city.city_ar : city.city_en,
                        })) || []
                    }
                  />
                </Form.Item>
              )}
            </Form.Item>
          </div>

          <Form.Item
            name="file"
            className={styles.field}
            label={t("stepTwoResearcher.fields.file")}
            rules={[
              {
                required: true,
                message: t("stepTwoResearcher.validation.fileRequired"),
              },
            ]}
            valuePropName="files"
            trigger="onFiles"
          >
            <UploadFiles
              onFiles={(files, meta) => {}}
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.doc,.docx"
              title={t("stepTwoResearcher.upload.title")}
              maxSize={20 * 1024 * 1024}
              dir="rtl"
            />
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
            {t("stepTwoResearcher.buttons.next")}
          </Button>

          <Button className={styles.backBtn} onClick={handlePrevStep} outline>
            {t("stepTwoResearcher.buttons.back")}
          </Button>
        </div>

        <p>{t("stepTwoResearcher.copyright")}</p>
      </div>
    </section>
  );
}