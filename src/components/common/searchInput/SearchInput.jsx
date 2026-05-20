import { FiSearch } from "react-icons/fi";
import styles from "./SearchInput.module.scss";
import Input from "@/components/ui/input/Input";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export const SearchInput = ({w}) => {
    const router = useRouter()
    const t = useTranslations("feed")
  const [openResults, setOpenResults] = useState(false);
  const [search, setSearch] = useState("")

//   const handleOpenResults = () => {
//     setOpenResults(!openResults);
//   };

  const handleGoIntoResultsPage = () =>{
    router.push(`/search?q=${encodeURIComponent(search)}&type=all&page=1`)
  }

  return (
    <div className={styles.searchBox}>
      <Input
        type="search"
        placeholder={t("searchHere")}
        clearable
        size="lg"
        suffix={<FiSearch />}
        BoxStyle={{
          backgroundColor: "#F3F3F3",
          border: "1px solid var(--border-color)",
          width: w,
        }}
        onEnter={handleGoIntoResultsPage}
        onChange={(e) => setSearch(e.target.value)}
        // onFocus={handleOpenResults}
        // onBlur={handleOpenResults}
      />
      {openResults && (
        <div className={styles.options}>
          <div className={styles.lastResults}>
            <h1>عمليات البحث الأخيرة</h1>
            <div className={styles.news}>
              <div>
                <Image
                  src={"/images/icons/refresh.svg"}
                  alt="refresh"
                  width={14}
                  height={14}
                  priority
                />
                <p>الموهوبين</p>
              </div>
            </div>
          </div>
          <div className={styles.results}>
            <div className={styles.result}>
              <Image
                src={"/images/icons/search-box.svg"}
                alt="Logo"
                width={30}
                height={30}
                className={styles.logo}
                priority
              />
              <p>موهوب رياضة محترف</p>
            </div>
            <div className={styles.result}>
              <Image
                src={"/images/icons/search-box.svg"}
                alt="Logo"
                width={30}
                height={30}
                className={styles.logo}
                priority
              />
              <p>موهوب رياضة محترف</p>
            </div>
            <div className={styles.result}>
              <Image
                src={"/images/icons/search-box.svg"}
                alt="Logo"
                width={30}
                height={30}
                className={styles.logo}
                priority
              />
              <p>موهوب رياضة محترف</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
