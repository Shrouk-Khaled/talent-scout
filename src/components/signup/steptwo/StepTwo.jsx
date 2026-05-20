"use client";

import styles from "./StepTwo.module.scss";
import Button from "@/components/ui/button/Button";
import { useSearchParams } from "next/navigation";
import Headlines from "../headlines/Headlines";
import { Form, message } from "antd";
import Input from "@/components/ui/input/Input";
import PhoneInput from "@/components/ui/phoneInput/PhoneInput";
import SelectInput from "@/components/ui/selectInput/SelectInput";
import SelectBox from "@/components/ui/selectBox/SelectBox";
import { useSignupStore } from "@/store/useSignupStore";
import { checkPhoneExists } from "@/services/api";
import { useEffect, useState } from "react";
import { countries } from "../../../../public/countries_with_cities_ar";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function StepTwo() {
  const t = useTranslations("signup");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale()
  const email = searchParams.get("email") || "";

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const signupData = useSignupStore((state) => state.signupData);
  const updateSignupData = useSignupStore((state) => state.updateSignupData);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!signupData) return;

    form.setFieldsValue({
      ...signupData,
      email: email,
      gender: signupData?.gender || 1,
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
          content: t("stepTwo.messages.phoneAlreadyExists"),
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
      console.error("Validation or phone check failed:", error);
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
        line1={t("stepTwo.headlineLine1")}
        line2={t("stepTwo.headlineLine2")}
      />

      <div className={styles.form}>
        <Form
          layout="vertical"
          form={form}
          initialValues={{ gender: 1, email: email }}
        >
          <div className={styles.row}>
            <Form.Item
              name="firstName"
              className={styles.field}
              label={t("stepTwo.firstName")}
              rules={[
                {
                  required: true,
                  message: t("stepTwo.validation.firstNameRequired"),
                },
                {
                  pattern: /^[A-Za-z\u0600-\u06FF\s]+$/,
                  message: t("stepTwo.validation.lettersOnlyFirstName"),
                },
              ]}
            >
              <Input
                type="text"
                placeholder={t("stepTwo.placeholders.firstName")}
              />
            </Form.Item>

            <Form.Item
              name="lastName"
              className={styles.field}
              label={t("stepTwo.lastName")}
              rules={[
                {
                  required: true,
                  message: t("stepTwo.validation.lastNameRequired"),
                },
                {
                  pattern: /^[A-Za-z\u0600-\u06FF\s]+$/,
                  message: t("stepTwo.validation.lettersOnlyLastName"),
                },
              ]}
            >
              <Input
                type="text"
                placeholder={t("stepTwo.placeholders.lastName")}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="gender"
            label={t("stepTwo.gender")}
            rules={[
              {
                required: true,
                message: t("stepTwo.validation.genderRequired"),
              },
            ]}
            valuePropName="selectedType"
            trigger="onSelectType"
          >
            <SelectBox
              boxStyle={{
                width: "48%",
              }}
              types={[
                { id: 1, label: t("stepTwo.male") },
                { id: 2, label: t("stepTwo.female") },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="email"
            className={styles.field}
            label={t("stepTwo.email")}
            rules={[
              {
                required: true,
                message: t("stepTwo.validation.emailRequired"),
              },
            ]}
          >
            <Input
              disabled
              type="text"
              placeholder={t("stepTwo.placeholders.email")}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            className={styles.field}
            label={t("stepTwo.phone")}
            rules={[
              {
                required: true,
                message: t("stepTwo.validation.phoneRequired"),
              },
            ]}
          >
            <PhoneInput />
          </Form.Item>

          <Form.Item
            name="age"
            className={styles.field}
            label={t("stepTwo.age")}
            rules={[
              {
                required: true,
                message: t("stepTwo.validation.ageRequired"),
              },
              {
                pattern: /^(1[3-9]|[2-9]\d)$/,
                message: t("stepTwo.validation.agePattern"),
              },
            ]}
          >
            <Input
              type="text"
              placeholder={t("stepTwo.placeholders.age")}
            />
          </Form.Item>

          <div className={styles.row}>
            <Form.Item
              name="country"
              className={styles.field}
              label={t("stepTwo.country")}
              rules={[
                {
                  required: true,
                  message: t("stepTwo.validation.countryRequired"),
                },
              ]}
            >
              <SelectInput
                placeholder={t("stepTwo.placeholders.country")}
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
                  label={t("stepTwo.city")}
                  rules={[
                    {
                      required: true,
                      message: t("stepTwo.validation.cityRequired"),
                    },
                  ]}
                >
                  <SelectInput
                    placeholder={t("stepTwo.placeholders.city")}
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
        </Form>
      </div>

      <div className={styles.btns}>
        <div className={styles.info}>
          <Button
            className={styles.nextBtn}
            onClick={handleNextStep}
            loading={loading}
          >
            {t("stepTwo.next")}
          </Button>

          <Button className={styles.backBtn} onClick={handlePrevStep} outline>
            {t("stepTwo.back")}
          </Button>
        </div>

        <p>{t("stepTwo.copyright")}</p>
      </div>
    </section>
  );
}