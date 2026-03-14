"use client";

import styles from "./StepThree.module.scss";
import Button from "@/components/ui/button/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Headlines from "../headlines/Headlines";
import { Form, message } from "antd";
import SelectBox from "@/components/ui/selectBox/SelectBox";
import SelectInput from "@/components/ui/selectInput/SelectInput";
import TextArea from "@/components/ui/textArea/TextArea";
import { useEffect, useState } from "react";
import { confirmSignup, draftSignupData, getAllCategories } from "@/services/api";
import { useSignupStore } from "@/store/useSignupStore";
import { useUserStore } from "@/store/useUserStore";
import { getFcmToken } from "@/lib/fcm";

export default function StepThree() {
  // router and params
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user_role = searchParams.get("user_role");
  const user_type = searchParams.get("user_type");
  //message
  const [messageApi, contextHolder] = message.useMessage();
  //form
  const [form] = Form.useForm();
  //store
  const updateSignupData = useSignupStore((state) => state.updateSignupData);
  const saveUserData = useUserStore((state) => state.setUserData);
  const signupData = useSignupStore((state) => state.signupData);
  const clearSignupData = useSignupStore((state) => state.resetSignup);
  //states
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
        (res?.find((cat) => cat?.id === signupData?.categoryId)
          ?.subCategories) || []
      );
    });
  }, []);

  useEffect(() => {
    if(!signupData) return;
    form.setFieldsValue({
     ...signupData,
    })
  },[signupData])

  const handleNextStep = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      if(!values?.subCategoryId) {
        messageApi.open({
          type: "error",
          content: "يرجى اختيار الفئة الفرعية"
        });
        return;
      }
      updateSignupData(values);
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", "4");
      router.push(makeUrl(params), { scroll: false });
    } catch {}
  };

  const handleSignup = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      setLoading(true);
      const fcmToken = await getFcmToken().catch(() => null);
      const res = draftSignupData({
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
        deviceType: "WEB"
      }, (p) => {console.log(p)}).then(() => {
        if(user_type == 2){
          handleConfirmSignup();
        } else {
          setLoading(false);
          saveUserData({
            ...res?.token_response,
            firstName: signupData?.firstName,
            lastName: signupData?.lastName,
          });
          clearSignupData();
          router.push("/feed");
        }
      }).catch((err) => {
        setLoading(false);
      });
    }catch {}
  }

  const handleConfirmSignup = () => {
    confirmSignup({
      email: searchParams.get("email"),
    })
      .then((res) => {
        setLoading(false);
        saveUserData({
          ...res?.token_response,
          firstName: signupData?.firstName,
          lastName: signupData?.lastName,
          token: res?.token_response?.access_token
      });
        clearSignupData();
        router.push("/feed");
      })
      .catch((err) => {
        setLoading(false);
      });
  };


  const makeUrl = (params) => {
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const handlePrevStep = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", "2");
    router.push(makeUrl(params), { scroll: false });
  };

  return (
    <section className={styles.main}>
      {contextHolder}
      <Headlines
        line1={user_role == 1 ?  "3 عرّفنا على موهبتك أكثر" : user_type == 1 ? "3 مجالات بحثك واهتمامك" : "3 مجالات اهتمام مؤسستك"}
        line2={user_role == 1 ? "شارك لمحة بسيطة عنك وعن شغفك." : "ما المجالات التي تهتم باكتشافها؟"}
      />

      <div className={styles.form}>
        <Form form={form} layout="vertical" initialValues={{ participationTypeId: 1 }}>
          <Form.Item
            label={
              user_role == 1 ? "ما الذي ترغب بمشاركته" : "ما الذي تبحث عنه؟"
            }
            name="participationTypeId"
            rules={[{ required: true, message: "يرجى كتابة نبذة عنك" }]}
            valuePropName="selectedType"
            trigger="onSelectType"
          >
            <SelectBox
              onSelectType={(v) =>
                {
                  setFilteredCategories(
                  categories.filter((cat) => cat?.participationTypeId == v)
                )
                form.setFieldsValue({ categoryId: null, subCategoryId: null })
                setSubCategories([])}
              }
              types={[
                { id: 1, label: "فكرة مشروع" },
                { id: 2, label: "موهبة شخصية" },
                { id: 3, label: "براءة اختراع" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="تحت أي فئة"
            name="categoryId"
            rules={[{ required: true, message: "يرجى كتابة تحت أي فئة" }]}
          >
            <SelectInput
            onChange={(value) => {
              const selectedCategory = filteredCategories.find(
                (cat) => cat?.id === value
              );
              setSubCategories(selectedCategory?.subCategories || []);
            }}
              placeholder={"اختر الفئة"}
              options={filteredCategories?.map((cat) => ({
                label: cat?.name,
                value: cat?.id,
              }))}
            />
          </Form.Item>

          {subCategories.length > 0 && (
            <Form.Item
              label="اختر الفئة الفرعية"
              name="subCategoryId"
              rules={[{ required: true, message: "يرجى اختيار الفئة الفرعية" }]}
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
              rules={[{ required: true, message: "اكتب نبذة قصيرة عنك" }]}
              label="اكتب نبذة قصيرة عنك"
            >
              <TextArea maxLength={250} placeholder="اكتب هنا" haveLengthLine />
            </Form.Item>
          )}
        </Form>
      </div>

      <div className={styles.btns}>
        <div>
          {user_role == 1 ? (
            <Button className={styles.nextBtn} onClick={handleNextStep}>
              التالي
            </Button>
          ) : (
            <Button className={styles.nextBtn} onClick={handleSignup} loading={loading}>
              انشاء حساب
            </Button>
          )}

          <Button className={styles.backBtn} onClick={handlePrevStep} outline>
            السابق
          </Button>
        </div>
        <p>جميع الحقوق محفوظة تالنت سكوت</p>
      </div>
    </section>
  );
}
