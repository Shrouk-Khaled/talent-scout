"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import CheckboxList from "@/components/ui/checkboxList/CheckboxList";
import styles from "./Filter.module.scss";
import { useHomeStore } from "@/store/useHome";
import RadioList from "@/components/ui/radioList/RadioList";
import { useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useTranslations } from "next-intl";

/** Keep option values unique per group (codes), labels can repeat */
const OPTIONS = {
  category: [
    { label: "موهبة شخصية", value: "cat_talent" },
    { label: "براءة إختراع", value: "cat_patent" },
    { label: "أفكار المشاريع", value: "cat_ideas" },
  ],
  subcategory: [
    { label: "الرياضة", value: "sub_talent" },
    { label: "التكنولوجيا و البرمجة", value: "sub_patent" },
    { label: "التصوير و تعديل الفيديوهات", value: "sub_ideas" },
    { label: "أخرى", value: "sub_other" },
    { label: "أخرى 2", value: "sub_other_2" },
  ],
  gender: [
    { label: "ذكر", value: "gender_male" },
    { label: "انثى", value: "gender_female" },
  ],
  age: [
    { label: "10 - 20 سنه", value: "age_10_20" },
    { label: "21 - 30 سنة", value: "age_21_30" },
    { label: "31 - 40 سنة", value: "age_31_40" },
  ],
  country: [
    { label: "السعودية", value: "country_sa" },
    { label: "مصر", value: "country_eg" },
    { label: "الامارات", value: "country_ae" },
  ],
  skill: [
    { label: "مبتدئ", value: "skill_beginner" },
    { label: "متوسط", value: "skill_intermediate" },
    { label: "متقدم", value: "skill_advanced" },
  ],
};

const EMPTY_FILTERS = {
  sortby: [],
  subcategory: [],
};

export default function Filter({ onFilter, isDrawer, clearFilters }) {
  const t = useTranslations("filter");

  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const category = searchParams.get("category");

  const subCats = useHomeStore((state) => state.categories);
  const user = useUserStore((state) => state.info);

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [subCatsData, setSubCatsData] = useState([]);

  const onChangeFor = useCallback(
    (key) => (vals) => setFilters((prev) => ({ ...prev, [key]: vals })),
    []
  );

  const clearAll = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, []);

  const payload = useMemo(() => {
    return {
      subcategories: filters.subcategory,
      sortby: filters.sortby,
    };
  }, [filters]);

  useEffect(() => {
    if (category) {
      setSubCatsData(
        subCats?.find((obj) => obj?.id == category)?.subCategories || []
      );
    } else {
      setSubCatsData(
        subCats?.find((obj) => obj?.id == user?.category?.id)
          ?.subCategories || []
      );
    }
  }, [subCats, user, category]);

  useEffect(() => {
    onFilter(payload);
  }, [payload]);

  useEffect(() => {
    if (clearFilters) clearAll();
  }, [clearFilters, clearAll]);

  return (
    <div
      className={`${styles.filterSide} ${
        isDrawer ? styles.drawerFilter : ""
      }`}
    >
      <div className={styles.header}>
        <h6>{t("title")}</h6>

        <p
          className={styles.clear}
          onClick={clearAll}
          role="button"
          tabIndex={0}
        >
          {t("reset")}
        </p>
      </div>

      <div className={styles.filterTypes}>
        {type !== "talents" && (
          <RadioList
            title={t("sortBy")}
            options={[
              { label: t("newest"), value: "date_desc" },
              { label: t("oldest"), value: "date_asc" },
            ]}
            defaultValue="option1"
            onChange={onChangeFor("sortby")}
            maxVisible={2}
          />
        )}

        <RadioList
          title={t("subTalent")}
          options={
            subCatsData?.length > 0
              ? subCatsData.map((subCat) => ({
                  label: subCat?.name,
                  value: subCat?.id,
                }))
              : []
          }
          value={filters.subcategory}
          defaultValue="option1"
          onChange={onChangeFor("subcategory")}
          maxVisible={2}
        />

        {/* <CheckboxList
          title={t("subTalent")}
          options={
            subCatsData?.length > 0
              ? subCatsData.map((subCat) => ({
                  label: subCat?.name,
                  value: subCat?.id,
                }))
              : []
          }
          value={filters.subcategory}
          onChange={onChangeFor("subcategory")}
        /> */}
      </div>
    </div>
  );
}