"use client";
import { useMemo, useState, useCallback } from "react";
import CheckboxList from "@/components/ui/checkboxList/CheckboxList";
import styles from "./Filter.module.scss";

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
  category: [],
  subcategory: [],
  gender: [],
  age: [],
  country: [],
  skill: [],
};

export default function Filter() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  // Factory: returns onChange handler for a specific key
  const onChangeFor = useCallback(
    (key) => (vals) => setFilters((prev) => ({ ...prev, [key]: vals })),
    []
  );

  const clearAll = useCallback(() => setFilters(EMPTY_FILTERS), []);

  // Optional: a memoized payload for API/query params
  const payload = useMemo(() => {
    return {
      categories: filters.category,
      subcategories: filters.subcategory,
      gender: filters.gender,
      ages: filters.age,
      countries: filters.country,
      skills: filters.skill,
    };
  }, [filters]);

  return (
    <div className={styles.filterSide}>
      <div className={styles.header}>
        <h6>الفلاتر</h6>
        <p className={styles.clear} onClick={clearAll} role="button" tabIndex={0}>
          إعاده تعيين
        </p>
      </div>

      <div className={styles.filterTypes}>
        <CheckboxList
          title="الفئة"
          options={OPTIONS.category}
          value={filters.category}
          onChange={onChangeFor("category")}
        />

        <CheckboxList
          title="التصنيف الفرعي"
          options={OPTIONS.subcategory}
          value={filters.subcategory}
          onChange={onChangeFor("subcategory")}
        />

        <CheckboxList
          title="نوع الموهوب"
          options={OPTIONS.gender}
          value={filters.gender}
          onChange={onChangeFor("gender")}
        />

        <CheckboxList
          title="سن الموهوب"
          options={OPTIONS.age}
          value={filters.age}
          onChange={onChangeFor("age")}
        />

        <CheckboxList
          title="الدولة"
          options={OPTIONS.country}
          value={filters.country}
          onChange={onChangeFor("country")}
        />

        <CheckboxList
          title="مستوى المهارة"
          options={OPTIONS.skill}
          value={filters.skill}
          onChange={onChangeFor("skill")}
        />
      </div>

      {/* Debug view (remove in prod)
      <pre style={{direction:'ltr'}}>{JSON.stringify(payload, null, 2)}</pre>
      */}
    </div>
  );
}
