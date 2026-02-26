"use client";

import styles from "./StepTwo.module.scss";
import Button from "@/components/ui/button/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

export default function StepTwo() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  //store
  const signupData = useSignupStore((state) => state.signupData);
  const updateSignupData = useSignupStore((state) => state.updateSignupData);

  useEffect(() => {
    if(!signupData) return;
    form.setFieldsValue({
     ...signupData,
     email: email,
     gender: signupData?.gender || 1,
     country: signupData?.country || undefined,
      city: signupData?.city || undefined,
    })
  },[signupData])

  //states
  const [loading, setLoading] = useState(false);

  // url helpers
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
      }).catch(() => setLoading(false));

      setLoading(false);
      if (res?.isExist) {
        messageApi.open({
          type: "error",
          content: "رقم الجوال مستخدم بالفعل. الرجاء استخدام رقم آخر.",
        });
        return;
      } else {
        messageApi.open({
          type: "success",
          content: res?.otpState?.message
        });
        updateSignupData(values);
        const params = new URLSearchParams(searchParams.toString());
        params.set("step", "3");
        router.push(makeUrl(params), { scroll: false }); // keep history
      }
    } catch {}
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
        line1={"2 خلّنا نتعرف عليك أكثر "}
        line2={"عبّ البيانات الأساسية لملفك الشخصي."}
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
              rules={[{ required: true, message: "الرجاء إدخال الاسم الأول" }]}
              className={styles.field}
              label="الاسم الأول"
            >
              <Input type="text" placeholder="مثال: أحمد" />
            </Form.Item>

            <Form.Item
              name="lastName"
              className={styles.field}
              rules={[{ required: true, message: "الرجاء إدخال الاسم الثاني" }]}
              label="الاسم الثاني"
            >
              <Input type="text" placeholder="مثال: محمد علي" />
            </Form.Item>
          </div>

          <Form.Item
            name="gender"
            label="النوع"
            rules={[{ required: true, message: "الرجاء اختيار النوع" }]}
            valuePropName="selectedType"
            trigger="onSelectType"
          >
            <SelectBox
              boxStyle={{ 
                width: '48%',  
              }}
              types={[
                { id: 1, label: "ذكر" },
                { id: 2, label: "أنثى" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="email"
            className={styles.field}
            rules={[
              { required: true, message: "الرجاء إدخال البريد الالكتروني" },
            ]}
            label="البريد الالكتروني"
          >
            <Input disabled type="text" placeholder="ادخل الايميل" />
          </Form.Item>

          <Form.Item
            name="phone"
            className={styles.field}
            label="رقم الجوال"
            rules={[{ required: true, message: "الرجاء إدخال رقم الهاتف" }]}
          >
            <PhoneInput />
          </Form.Item>

          <Form.Item
            name="age"
            className={styles.field}
            label="العمر"
            rules={[
              { required: true, message: "الرجاء إدخال العمر" },
              {
                pattern: /^(1[3-9]|[2-9]\d)$/,
                message: "العمر لازم يكون بين 13 و 99",
              },
            ]}
          >
            <Input type="text" placeholder="مثال: 25" />
          </Form.Item>

          <div className={styles.row}>
            <Form.Item
              name="country"
              rules={[{ required: true, message: "الرجاء ادخال البلد"}]}
              className={styles.field}
              label="البلد"
            >
              <SelectInput
                placeholder={"اختر بلد"}
                // options={[
                //   {
                //     value: "Egypt",
                //     label: "مصر",
                //   },
                //   {
                //     value: "Ksa",
                //     label: "السعودية",
                //   },
                // ]}
                options={countries.map((country) => ({
                  value: country.country_code,
                  label: country.country_ar,
                }))
                }
              />
            </Form.Item>

            <Form.Item
            shouldUpdate={(prev, cur) => prev.country !== cur.country}
            noStyle
          >
            {({ getFieldValue }) => (
            <Form.Item
              name="city"
              rules={[{ required: true, message: "الرجاء ادخال المدينة"}]}
              className={styles.field}
              label="المدينة"
            >
              <SelectInput
                placeholder={"اختر مدينة"}
                // options={[
                //   {
                //     value: "Cairo",
                //     label: "القاهرة",
                //   },
                //   {
                //     value: "Riyadh",
                //     label: "الرياض",
                //   },
                // ]}
                options={
                  countries.find(c => c.country_code === getFieldValue('country'))?.cities.map((city) => ({
                    value: city.city_code,
                    label: city.city_ar,
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
        <div>
          <Button className={styles.nextBtn} onClick={handleNextStep} loading={loading}>
            التالي
          </Button>
          <Button className={styles.backBtn} onClick={handlePrevStep} outline>
            السابق
          </Button>
        </div>
        <p>جميع الحقوق محفوظة تالنت سكوت</p>
      </div>
    </section>
  );
}
