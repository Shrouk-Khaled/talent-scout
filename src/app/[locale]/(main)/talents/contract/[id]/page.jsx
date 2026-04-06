"use client";
import Image from "next/image";
import styles from "./page.module.scss";
import { Form, message } from "antd";
import TextArea from "@/components/ui/textArea/TextArea";
import Input from "@/components/ui/input/Input";
import Button from "@/components/ui/button/Button";
import { sendContractRequest } from "@/services/api";
import { useState } from "react";
import { ContractSuccessModal } from "@/components/modals/contractSuccessModal/ContractSuccessModal";

const steps = [
  {
    title: "اتفاق مهني موثوق",
    description:
      "العقد هو اتفاق بين الباحث والموهوب يحدد طبيعة التعاون والعمل بين الطرفين بشكل واضح.",
    icon: "users",
  },
  {
    title: "تحديد شروط العمل",
    description:
      "يتضمن العقد تفاصيل مثل مدة التعاون، قيمة الاتفاق، والمهام المطلوبة لضمان وضوح التوقعات.",
    icon: "document",
  },
  {
    title: "حماية الحقوق والتواصل",
    description:
      "يقوم فريق المنصة بمراجعة الطلب والتواصل مع الموهوب للمساعدة في تنسيق التعاقد بين الطرفين.",
    icon: "shield",
  },
];

const workTypes = [
  {
    id: 1,
    name: "دوام كامل",
  },
  {
    id: 3,
    name: "دوام جزئي",
  },
  {
    id: 4,
    name: "شراكة",
  },
  {
    id: 2,
    name: "عمل حر",
  },
  {
    id: 5,
    name: "أخرى",
  },
];

export default function Page({ params }) {
  const { id } = params;

  const [form] = Form.useForm();
  const selectedWorkType = Form.useWatch("type", form);

  //states
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSendContract = () => {
    form
      .validateFields()
      .then((values) => {
        setLoading(true);
        sendContractRequest({
          receiver_id: Number(id),
          type: values.type,
          description: values.description,
          period: values.period,
          amount: values.amount,
        })
          .then(() => {
            form.resetFields();
            setShowSuccessModal(true);
          })
          .catch((err) => {
            console.error("Error sending contract request:", err);
            message.error(
                err?.response?.data?.message || "حدث خطأ أثناء إرسال الطلب"
                );
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  return (
    <div className={`${styles.container} app-container`}>
      <div className={styles.desc}>
        <h2>طلب تواصل مهني</h2>
        <p>أرسل طلب يتضمن تفاصيل العمل أو التعاون.</p>
      </div>

      {showSuccessModal && <ContractSuccessModal onClose={() => {setShowSuccessModal(false)}} />}

      <div className={styles.main}>
        <div className={styles.contractInfo}>
          <div className={styles.talentInfo}>
            <p>ارسال الطلب الي</p>
            <div className={styles.data}>
              <Image
                src={"/images/logo.png"}
                width={50}
                height={50}
                alt="pic"
              />
              <div>
                <h2>شروق خالد</h2>
                <p>مصممة جرافيك</p>
              </div>
            </div>

            <div className={styles.details}>
              <h2>تفاصيل الطلب</h2>
              <p>يرجى ملئ المعلومات التاليه لتجهيز العقد</p>
            </div>

            <div className={styles.details}>
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  type: 1,
                }}
              >
                <Form.Item
                  label="اختر نوع العمل"
                  name="type"
                  rules={[
                    { required: true, message: "الرجاء اختيار نوع العمل" },
                  ]}
                >
                  <div className={styles.types}>
                    {workTypes.map((type) => (
                      <span
                        key={type.id}
                        className={
                          selectedWorkType === type.id ? styles.activeType : ""
                        }
                        onClick={() => form.setFieldsValue({ type: type.id })}
                      >
                        {type.name}
                      </span>
                    ))}
                  </div>
                </Form.Item>

                <Form.Item
                  label="وصف العمل"
                  name="description"
                  rules={[
                    { required: true, message: "الرجاء كتابة وصف للعمل" },
                  ]}
                >
                  <TextArea
                    maxLength={500}
                    haveLengthLine
                    placeholder="شارك تفاصيل عن المشروع، المهام المطلوبة، وأي معلومات أخرى مهمة."
                  />
                </Form.Item>

                <Form.Item
                  label="مدة العمل"
                  name="period"
                  rules={[
                    { required: true, message: "الرجاء كتابة مدة العمل" },
                  ]}
                >
                  <Input placeholder="مثال: 3 أشهر" />
                </Form.Item>

                <Form.Item
                  label="قيمة الطلب"
                  name="amount"
                  rules={[
                    { required: true, message: "الرجاء كتابة قيمة العمل" },
                  ]}
                >
                  <Input placeholder="مثال: 1000 ريال" />
                </Form.Item>

                <Button onClick={handleSendContract} loading={loading}>
                  ارسال الطلب
                </Button>
              </Form>
            </div>
          </div>
        </div>
        <div className={styles.info}>
          <h1 className={styles.secTitle}>ما هو طلب التواصل المهنى؟</h1>
          <section className={styles.timelineSection}>
            <div className={styles.timeline}>
              {steps.map((step, index) => (
                <div className={styles.item} key={index}>
                  <div className={styles.iconColumn}>
                    <div className={styles.iconWrapper}>
                      {step.icon === "users" && (
                        <Image
                          src={"/images/icons/details1.svg"}
                          width={40}
                          height={40}
                          alt="pic"
                        />
                      )}
                      {step.icon === "document" && (
                        <Image
                          src={"/images/icons/details2.svg"}
                          width={40}
                          height={40}
                          alt="pic"
                        />
                      )}
                      {step.icon === "shield" && (
                        <Image
                          src={"/images/icons/details3.svg"}
                          width={40}
                          height={40}
                          alt="pic"
                        />
                      )}
                    </div>

                    {index !== steps.length - 1 && (
                      <div className={styles.line} />
                    )}
                  </div>

                  <div className={styles.content}>
                    <h3 className={styles.title}>{step.title}</h3>
                    <p className={styles.description}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
