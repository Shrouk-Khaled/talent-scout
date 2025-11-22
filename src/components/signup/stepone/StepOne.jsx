"use client";

import Image from "next/image";
import styles from "./StepOne.module.scss";
import { useState } from "react";
import Button from "@/components/ui/button/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Headlines from "../headlines/Headlines";
import { USER_ROLES } from "@/enums/UserRole";
import { USER_TYPES } from "@/enums/UserType";

export default function StepOne() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState(1);

  const handleSelectedType = (type) => {
    setSelectedType(type);
  };

  const handleNextStep = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", "2");
    params.set(
      "user_role",
      selectedType == 1 ? USER_ROLES.TALENT : USER_ROLES.RESEARCHER
    );
    if (selectedType != 1) {
      params.set(
        "user_type",
        selectedType == 2
          ? USER_TYPES.RESEARCHER_INDIVIDUAL
          : USER_TYPES.RESEARCHER_ORGANIZATION
      );
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <section className={styles.main}>
      <Headlines
        line1={"01 مرحبا فى تالنت سكاوت"}
        line2={"هل أنت موهوب أم باحث عن المواهب؟"}
      />

      <div className={styles.typesBox}>
        <div
          className={`${styles.type} ${selectedType == 1 && styles.active}`}
          onClick={() => handleSelectedType(1)}
        >
          <div className={styles.headerTitle}>
            <Image
              src="/images/icons/colors.png"
              alt="Talent"
              width={25}
              height={25}
            />
            <h3>انا موهوب</h3>
          </div>
          <p>أعرض موهبتي، أشارك إبداعي، وأوصل للفرص اللي تستحقني.</p>
        </div>
        <div
          className={`${styles.type} ${selectedType == 2 && styles.active}`}
          onClick={() => handleSelectedType(2)}
        >
          <div className={styles.headerTitle}>
            <Image
              src="/images/icons/search.png"
              alt="Talent"
              width={25}
              height={25}
            />
            <h3> أنا باحث (فرد)</h3>
          </div>
          <p>أكتشف مواهب مميزة، وأبني علاقات مع المبدعين.</p>
        </div>
        <div
          className={`${styles.type} ${selectedType == 3 && styles.active}`}
          onClick={() => handleSelectedType(3)}
        >
          <div className={styles.headerTitle}>
            <Image
              src="/images/icons/building.png"
              alt="Talent"
              width={25}
              height={25}
            />
            <h3>أنا باحث (منشأة)</h3>
          </div>
          <p>أمثّل مؤسستي وأبحث عن المواهب والابتكارات المناسبة لنا.</p>
        </div>
      </div>

      <div className={styles.btns}>
        <Button className={styles.nextBtn} onClick={handleNextStep}>
          التالي
        </Button>
        <p>جميع الحقوق محفوظة تالنت سكوت</p>
      </div>
    </section>
  );
}
