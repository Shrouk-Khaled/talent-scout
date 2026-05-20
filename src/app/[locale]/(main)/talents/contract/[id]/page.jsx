"use client";

import Image from "next/image";
import styles from "./page.module.scss";
import { Form, message } from "antd";
import TextArea from "@/components/ui/textArea/TextArea";
import Button from "@/components/ui/button/Button";
import { getTalentById, sendContractRequest } from "@/services/api";
import { useEffect, useState } from "react";
import { ContractSuccessModal } from "@/components/modals/contractSuccessModal/ContractSuccessModal";
import { useTranslations } from "next-intl";

export default function Page({ params }) {
  const t = useTranslations("contract.request");

  const { id } = params;

  const [form] = Form.useForm();
  const selectedWorkType = Form.useWatch("type", form);

  const steps = [
    {
      title: t("steps.professionalAgreement.title"),
      description: t("steps.professionalAgreement.description"),
      icon: "users",
    },
    {
      title: t("steps.workTerms.title"),
      description: t("steps.workTerms.description"),
      icon: "document",
    },
    {
      title: t("steps.rightsProtection.title"),
      description: t("steps.rightsProtection.description"),
      icon: "shield",
    },
  ];

  const workTypes = [
    {
      id: 1,
      name: t("workTypes.fullTime"),
    },
    {
      id: 3,
      name: t("workTypes.partTime"),
    },
    {
      id: 4,
      name: t("workTypes.partnership"),
    },
    {
      id: 2,
      name: t("workTypes.freelance"),
    },
    {
      id: 5,
      name: t("workTypes.other"),
    },
  ];

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [talent, setTalent] = useState(null);

  useEffect(() => {
    getTalentById(id).then((res) => {
      setTalent(res);
    });
  }, [id]);

  const handleSendContract = () => {
    form
      .validateFields()
      .then((values) => {
        setLoading(true);

        sendContractRequest({
          receiver_id: Number(id),
          description: values.description,
        })
          .then(() => {
            form.resetFields();
            setShowSuccessModal(true);
          })
          .catch(() => {
            message.error(t("errorMessage"));
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
        <h2>{t("pageTitle")}</h2>
        <p>{t("pageDescription")}</p>
      </div>

      {showSuccessModal && (
        <ContractSuccessModal
          onClose={() => {
            setShowSuccessModal(false);
          }}
        />
      )}

      <div className={styles.main}>
        <div className={styles.contractInfo}>
          <div className={styles.talentInfo}>
            <p>{t("sendTo")}</p>

            <div className={styles.data}>
              <Image
                src={talent?.user?.image_url || "/images/logo.png"}
                width={50}
                height={50}
                alt={t("profileImageAlt")}
              />

              <div>
                <h2>
                  {talent?.user?.first_name} {talent?.user?.last_name}
                </h2>
                <p>{talent?.user?.short_bio}</p>
              </div>
            </div>

            <div className={styles.details}>
              <h2>{t("requestDetailsTitle")}</h2>
              <p>{t("requestDetailsDescription")}</p>
            </div>

            <div className={styles.details}>
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  type: 1,
                }}
              >
                {/* <Form.Item
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
                </Form.Item> */}

                <Form.Item
                  label={t("workDescription")}
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: t("validation.descriptionRequired"),
                    },
                  ]}
                >
                  <TextArea
                    maxLength={500}
                    haveLengthLine
                    placeholder={t("workDescriptionPlaceholder")}
                  />
                </Form.Item>

                <Button onClick={handleSendContract} loading={loading}>
                  {t("sendButton")}
                </Button>
              </Form>
            </div>
          </div>
        </div>

        <div className={styles.info}>
          <h1 className={styles.secTitle}>{t("infoTitle")}</h1>

          <section className={styles.timelineSection}>
            <div className={styles.timeline}>
              {steps.map((step, index) => (
                <div className={styles.item} key={step.icon}>
                  <div className={styles.iconColumn}>
                    <div className={styles.iconWrapper}>
                      {step.icon === "users" && (
                        <Image
                          src="/images/icons/details1.svg"
                          width={40}
                          height={40}
                          alt={t("iconAlt")}
                        />
                      )}

                      {step.icon === "document" && (
                        <Image
                          src="/images/icons/details2.svg"
                          width={40}
                          height={40}
                          alt={t("iconAlt")}
                        />
                      )}

                      {step.icon === "shield" && (
                        <Image
                          src="/images/icons/details3.svg"
                          width={40}
                          height={40}
                          alt={t("iconAlt")}
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