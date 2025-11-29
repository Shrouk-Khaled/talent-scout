"use client";

import styles from "./StepFour.module.scss";
import Button from "@/components/ui/button/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Headlines from "../headlines/Headlines";
import { Form } from "antd";
import Input from "@/components/ui/input/Input";
import SelectInput from "@/components/ui/selectInput/SelectInput";
import TextArea from "@/components/ui/textArea/TextArea";
import UploadFiles from "@/components/ui/uploadFiles/UploadFiles";
import { useEffect, useState } from "react";
import { getSubCatFormFields } from "@/services/api";
import { useSignupStore } from "@/store/useSignupStore";

export default function StepFour() {
  const router = useRouter();
  const pathname = usePathname();
  //query params
  const searchParams = useSearchParams();
  const user_role = searchParams.get("user_role");
  const user_type = searchParams.get("user_type");
  const [form] = Form.useForm();
  const [bioForm] = Form.useForm();
  //store
  const signupData = useSignupStore((state) => state.signupData);
  const updateSignupData = useSignupStore((state) => state.updateSignupData);
  //states
  const [formFields, setFormFields] = useState([]);

  useEffect(() => {
    if(!signupData?.subCategoryId) return;
    getSubCatFormFields(signupData?.subCategoryId).then((res) => {
      setFormFields(res?.data?.form?.fields);
      form.setFieldsValue(signupData?.talentCategoryForm || {});
      bioForm.setFieldsValue({
        shortBio: signupData?.shortBio || "",
        file: signupData?.file || null,
      });
    });
  }, [signupData?.subCategoryId]);

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
    
    } catch {
      // Delete
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
        line1={"04 نبذة عنك وعن موهبتك"}
        line2={"نبذة قصيرة عنك واهتماماتك."}
      />

      <div className={styles.form}>
        <Form layout="vertical" form={form}>
          {formFields?.map((field) => {
            if (field.type === "text") {
              return (
                <Form.Item
                  key={field.id}
                  // name={field.label.toLowerCase().replace(/ /g, "_")}
                  name={field?.id}
                  className={styles.field}
                  rules={
                    field.required
                      ? [
                          {
                            required: true,
                            message: `الرجاء إدخال ${field.label}`,
                          },
                        ]
                      : []
                  }
                  label={field.label}
                >
                  <Input
                    type="text"
                    placeholder={field.placeholder || `ادخل ${field.label}`}
                  />
                </Form.Item>
              );
            } else if (field.type === "select" || field.type === "multiselect") {
              return (
                <Form.Item
                  key={field.id}
                  // name={field.label.toLowerCase().replace(/ /g, "_")}
                  name={field?.id}
                  className={styles.field}
                  rules={
                    field.required
                      ? [
                          {
                            required: true,
                            message: `الرجاء إدخال ${field.label}`,
                          },
                        ]
                      : []
                  }
                  label={field.label}
                >
                  <SelectInput
                    placeholder={field.placeholder || `اختر ${field.label}`}
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
            rules={[{ required: true, message: "اكتب نبذة قصيرة عنك" }]}
            label="اكتب نبذة قصيرة عنك"
          >
            <TextArea maxLength={250} placeholder="اكتب هنا" haveLengthLine />
          </Form.Item>

          <Form.Item
            name="file"
            className={styles.field}
            rules={[{ required: true, message: "أثبت موهبتك بملف بسيط" }]}
            label="أثبت موهبتك بملف بسيط"
            valuePropName="files"
            trigger="onFiles"
          >
            <UploadFiles
              accept="image/*,video/*"
              // multiple
              maxSize={80 * 1024 * 1024} // 80 MB soft limit (optional)
              dir="rtl"
            />
          </Form.Item>
        </Form>
      </div>

      <div className={styles.btns}>
        <div>
          <Button className={styles.nextBtn} onClick={handleNextStep}>
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
