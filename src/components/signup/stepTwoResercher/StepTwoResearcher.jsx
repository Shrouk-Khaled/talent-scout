"use client";

import styles from "./StepTwoResearcher.module.scss";
import Button from "@/components/ui/button/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

export default function StepTwoResearcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  //form
  const [form] = Form.useForm();
  //message
  const [messageApi, contextHolder] = message.useMessage();
  //store
  const updateSignupData = useSignupStore((state) => state.updateSignupData);
  const signupData = useSignupStore((state) => state.signupData);
  //states
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue({...signupData, email: email});
  }, [signupData]);


  // url helpers
  const makeUrl = (params) => {
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const handleNextStep = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      checkPhoneExists({
        phone: `${values?.phone?.countryCode}${values?.phone?.localNumber}`,
      }).then((res) => {
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
        }
        updateSignupData(values);
        const params = new URLSearchParams(searchParams.toString());
        params.set("step", "3");
        router.push(makeUrl(params), { scroll: false }); // keep history
      }).catch((err) => {
        messageApi.open({
          type: "error",
          content: "الرجاء تصحيح الأخطاء في النموذج قبل المتابعة.",
        });
      })
   
    } catch {
      // antd will show validation messages automatically
      // Delete
    }
  };

  const handlePrevStep = () => {
    // step 1 should be plain /signup (no query)
    const params = new URLSearchParams(searchParams.toString());
    // params.delete("step");
    params.set("step", "1");
    router.push(makeUrl(params), { scroll: false });
  };

  return (
    <section className={styles.main}>
      {contextHolder}
      <Headlines
        line1={"02 عرّفنا بمؤسستك أكثر "}
        line2={"عبّ البيانات الأساسية لمؤسستك."}
      />

      <div className={styles.form}>
        <Form layout="vertical" form={form} initialValues={{email: email}}>
          <Form.Item
            name="organization_name"
            rules={[{ required: true, message: "الرجاء إدخال إسم المنشأه" }]}
            className={styles.field}
            label="إسم المنشأه"
          >
            <Input type="text" placeholder="مثال: شركة المراعي" />
          </Form.Item>

          <Form.Item
            name="commercial_registration_number"
            rules={[
              { required: true, message: "الرجاء إدخال رقم السجل التجاري" },
            ]}
            className={styles.field}
            label="رقم السجل التجاري"
          >
            <Input type="text" placeholder="مثال: 142 1546 11" />
          </Form.Item>

          <Form.Item
            name="representative_name"
            rules={[
              {
                required: true,
                message: "الرجاء إدخال إسم الشخص الممثل للجهة",
              },
            ]}
            className={styles.field}
            label="إسم الشخص الممثل للجهة"
          >
            <Input type="text" placeholder="مثال: أحمد محمد" />
          </Form.Item>

          <Form.Item
            name="email"
            className={styles.field}
            rules={[
              { required: true, message: "الرجاء إدخال البريد الالكتروني" },
            ]}
            label="البريد الالكتروني"
          >
            <Input type="text" placeholder="ادخل الايميل" disabled/>
          </Form.Item>

          <Form.Item
            name="phone"
            className={styles.field}
            label="رقم الجوال"
            rules={[{ required: true, message: "الرجاء إدخال رقم الهاتف" }]}
            valuePropName="phone"
            trigger="onChange"
          >
            <PhoneInput value={`${signupData?.phone?.countryCode}${signupData?.phone?.localNumber}`}/>
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

          <Form.Item
            name="commercial_registration_file"
            className={styles.field}
            rules={[
              {
                required: true,
                message: "أرفق السجل التجاري او الترخيص الرسمي",
              },
            ]}
            label="السجل التجاري او الترخيص الرسمي"
            valuePropName="files"
            trigger="onFiles"
          >
            <UploadFiles
              onFiles={(files, meta) => {
                // console.table(meta);
              }}
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.doc,.docx"
              title="ارفع مستند PDF"
              maxSize={20 * 1024 * 1024} // 20 MB soft limit (optional)
              dir="rtl"
            />
          </Form.Item>
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
