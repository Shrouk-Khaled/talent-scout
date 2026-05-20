"use client";

import styles from "./StepThree.module.scss";
import Button from "@/components/ui/button/Button";
import { useSearchParams } from "next/navigation";
import Headlines from "../headlines/Headlines";
import { Form, message } from "antd";
import SelectBox from "@/components/ui/selectBox/SelectBox";
import SelectInput from "@/components/ui/selectInput/SelectInput";
import TextArea from "@/components/ui/textArea/TextArea";
import { useEffect, useState } from "react";
import {
  confirmSignup,
  draftSignupData,
  getAllCategories,
} from "@/services/api";
import { useSignupStore } from "@/store/useSignupStore";
import { useUserStore } from "@/store/useUserStore";
import { getFcmToken } from "@/lib/fcm";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function StepThree() {
  const t = useTranslations("signup");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const user_role = searchParams.get("user_role");
  const user_type = searchParams.get("user_type");

  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const updateSignupData = useSignupStore((state) => state.updateSignupData);
  const saveUserData = useUserStore((state) => state.setUserData);
  const signupData = useSignupStore((state) => state.signupData);
  const clearSignupData = useSignupStore((state) => state.resetSignup);

  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllCategories().then((res) => {
      setCategories(res);

      setFilteredCategories(
        res?.filter((obj) => obj?.participationTypeId == 1) || []
      );

      setSubCategories(
        res?.find((cat) => cat?.id === signupData?.categoryId)
          ?.subCategories || []
      );
    });
  }, [signupData?.categoryId]);

  useEffect(() => {
    if (!signupData) return;

    form.setFieldsValue({
      ...signupData,
    });
  }, [signupData, form]);

  const makeUrl = (params) => {
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const getHeadlineLine1 = () => {
    if (user_role == 1) {
      return t("stepThree.headlines.talentLine1");
    }

    if (user_type == 1) {
      return t("stepThree.headlines.individualResearcherLine1");
    }

    return t("stepThree.headlines.organizationResearcherLine1");
  };

  const getHeadlineLine2 = () => {
    if (user_role == 1) {
      return t("stepThree.headlines.talentLine2");
    }

    return t("stepThree.headlines.researcherLine2");
  };

  const handleNextStep = async () => {
    try {
      await form.validateFields();

      const values = form.getFieldsValue();

      if (!values?.subCategoryId) {
        messageApi.open({
          type: "error",
          content: t("stepThree.messages.subCategoryRequired"),
        });

        return;
      }

      updateSignupData(values);

      const params = new URLSearchParams(searchParams.toString());
      params.set("step", "4");

      router.push(makeUrl(params), { scroll: false });
    } catch (error) {
      console.error("Step three validation failed:", error);
    }
  };

  const handleSignup = async () => {
    try {
      await form.validateFields();

      const values = form.getFieldsValue();

      setLoading(true);

      const fcmToken = await getFcmToken().catch(() => null);

      draftSignupData(
        {
          ...signupData,
          shortBio: values?.bioDescription,
          roleId: user_role,
          userTypeId: user_type,
          phone: signupData?.phone?.localNumber,
          prefixCode: signupData?.phone?.countryCode,
          email: signupData?.email,
          categoryId: values?.categoryId,
          subCategoryId: values?.subCategoryId,
          participationTypeId: values?.participationTypeId,
          fcmToken,
          typeId: 3,
          deviceType: "WEB",
        },
        (p) => {
          console.log(p);
        }
      )
        .then((res) => {
          if (user_type == 2) {
            handleConfirmSignup();
            return;
          }

          saveUserData({
            ...res?.token_response,
            firstName: signupData?.firstName,
            lastName: signupData?.lastName,
          });

          clearSignupData();
          router.push("/feed");
        })
        .catch((err) => {
          console.error("Draft signup failed:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("Signup validation failed:", error);
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

    params.set("step", "2");

    router.push(makeUrl(params), { scroll: false });
  };

  return (
    <section className={styles.main}>
      {contextHolder}

      <Headlines line1={getHeadlineLine1()} line2={getHeadlineLine2()} />

      <div className={styles.form}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ participationTypeId: 1 }}
        >
          <Form.Item
            label={
              user_role == 1
                ? t("stepThree.fields.participationTypeTalent")
                : t("stepThree.fields.participationTypeResearcher")
            }
            name="participationTypeId"
            rules={[
              {
                required: true,
                message: t("stepThree.validation.participationTypeRequired"),
              },
            ]}
            valuePropName="selectedType"
            trigger="onSelectType"
          >
            <SelectBox
              onSelectType={(v) => {
                setFilteredCategories(
                  categories.filter((cat) => cat?.participationTypeId == v)
                );

                form.setFieldsValue({
                  categoryId: null,
                  subCategoryId: null,
                });

                setSubCategories([]);
              }}
              types={[
                {
                  id: 1,
                  label: t("stepThree.participationTypes.patent"),
                },
                {
                  id: 2,
                  label: t("stepThree.participationTypes.personalTalent"),
                },
                {
                  id: 3,
                  label: t("stepThree.participationTypes.projectIdea"),
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label={t("stepThree.fields.category")}
            name="categoryId"
            rules={[
              {
                required: true,
                message: t("stepThree.validation.categoryRequired"),
              },
            ]}
          >
            <SelectInput
              onChange={(value) => {
                const selectedCategory = filteredCategories.find(
                  (cat) => cat?.id === value
                );

                setSubCategories(selectedCategory?.subCategories || []);
              }}
              placeholder={t("stepThree.placeholders.category")}
              options={filteredCategories?.map((cat) => ({
                label: cat?.name,
                value: cat?.id,
              }))}
            />
          </Form.Item>

          {subCategories.length > 0 && (
            <Form.Item
              label={t("stepThree.fields.subCategory")}
              name="subCategoryId"
              rules={[
                {
                  required: true,
                  message: t("stepThree.validation.subCategoryRequired"),
                },
              ]}
              valuePropName="selectedType"
              trigger="onSelectType"
            >
              <SelectBox
                types={
                  subCategories?.map((subCat) => ({
                    id: subCat?.id,
                    label: subCat?.name,
                  })) || []
                }
                boxStyle={{ width: "auto" }}
              />
            </Form.Item>
          )}

          {user_role != 1 && (
            <Form.Item
              name="bioDescription"
              className={styles.field}
              label={t("stepThree.fields.bio")}
              rules={[
                {
                  required: true,
                  message: t("stepThree.validation.bioRequired"),
                },
              ]}
            >
              <TextArea
                maxLength={250}
                placeholder={t("stepThree.placeholders.bio")}
                haveLengthLine
              />
            </Form.Item>
          )}
        </Form>
      </div>

      <div className={styles.btns}>
        <div>
          {user_role == 1 ? (
            <Button className={styles.nextBtn} onClick={handleNextStep}>
              {t("stepThree.buttons.next")}
            </Button>
          ) : (
            <Button
              className={styles.nextBtn}
              onClick={handleSignup}
              loading={loading}
            >
              {t("stepThree.buttons.createAccount")}
            </Button>
          )}

          <Button className={styles.backBtn} onClick={handlePrevStep} outline>
            {t("stepThree.buttons.back")}
          </Button>
        </div>

        <p>{t("stepThree.copyright")}</p>
      </div>
    </section>
  );
}