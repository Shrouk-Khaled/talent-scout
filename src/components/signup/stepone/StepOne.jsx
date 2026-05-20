"use client";

import Image from "next/image";
import styles from "./StepOne.module.scss";
import { useState } from "react";
import Button from "@/components/ui/button/Button";
import { useSearchParams } from "next/navigation";
import Headlines from "../headlines/Headlines";
import { USER_ROLES } from "@/enums/UserRole";
import { USER_TYPES } from "@/enums/UserType";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function StepOne() {
  const t = useTranslations("signup");

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
        line1={t("stepOne.headlineLine1")}
        line2={t("stepOne.headlineLine2")}
      />

      <div className={styles.typesBox}>
        <div
          className={`${styles.type} ${selectedType == 1 ? styles.active : ""}`}
          onClick={() => handleSelectedType(1)}
        >
          <div className={styles.headerTitle}>
            <Image
              src="/images/icons/colors.png"
              alt={t("stepOne.types.talent.iconAlt")}
              width={25}
              height={25}
            />

            <h3>{t("stepOne.types.talent.title")}</h3>
          </div>

          <p>{t("stepOne.types.talent.description")}</p>
        </div>

        <div
          className={`${styles.type} ${selectedType == 2 ? styles.active : ""}`}
          onClick={() => handleSelectedType(2)}
        >
          <div className={styles.headerTitle}>
            <Image
              src="/images/icons/search.png"
              alt={t("stepOne.types.individualResearcher.iconAlt")}
              width={25}
              height={25}
            />

            <h3>{t("stepOne.types.individualResearcher.title")}</h3>
          </div>

          <p>{t("stepOne.types.individualResearcher.description")}</p>
        </div>

        <div
          className={`${styles.type} ${selectedType == 3 ? styles.active : ""}`}
          onClick={() => handleSelectedType(3)}
        >
          <div className={styles.headerTitle}>
            <Image
              src="/images/icons/building.png"
              alt={t("stepOne.types.organizationResearcher.iconAlt")}
              width={25}
              height={25}
            />

            <h3>{t("stepOne.types.organizationResearcher.title")}</h3>
          </div>

          <p>{t("stepOne.types.organizationResearcher.description")}</p>
        </div>
      </div>

      <div className={styles.btns}>
        <Button className={styles.nextBtn} onClick={handleNextStep}>
          {t("stepOne.next")}
        </Button>

        <p>{t("stepOne.copyright")}</p>
      </div>
    </section>
  );
}