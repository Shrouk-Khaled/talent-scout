import Button from "@/components/ui/button/Button";
import styles from "./Packages.module.scss";
import { FaCheck } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function Packages() {
  const t = useTranslations("Home");

  return (
    <div className={styles.section}>
      <p className={styles.title}>{t("pricingTitle")}</p>
      <h1 className={styles.desc}>
        {t("pricingHeadline")}
      </h1>

      <div className={styles.packages}>
        <div className={`${styles.package} ${styles.normal}`}>
            <h1>{t("basicPlan")}</h1>
            <h3><span>0.00</span> {t("basicPrice")}</h3>

            <Button outline>{t("basicButton")}</Button>

            <h4>{t("basicIncludes")}</h4>

            <div className={styles.list}>
                 <p><FaCheck />{t("basicFeature1")}</p> 
                 <p><FaCheck />{t("basicFeature2")}</p> 
                 <p><FaCheck />{t("basicFeature3")} </p> 
            </div>
            
        </div>

        <div className={`${styles.package} ${styles.normal}`}>
            <h1>{t("advancedPlan")}</h1>
            <h3><span>400</span> {t("basicPrice")}</h3>

            <Button outline>{t("basicButton")}</Button>

            <h4>{t("basicIncludes")}</h4>

            <div className={styles.list}>
                 <p><FaCheck />{t("advancedFeature1")}</p> 
                 <p><FaCheck />{t("advancedFeature2")}</p> 
                 <p><FaCheck />{t("advancedFeature3")}</p> 
            </div>
            
        </div>

        <div className={styles.package}>
            <h1>{t("premiumPlan")}</h1>
            <h3><span>{t("free")}{" "}</span>{t("premiumPrice")}</h3>

            <Button>{t("premiumButton")}</Button>

            <h4>{t("basicIncludes")}</h4>

            <div className={styles.list}>
                 <p><FaCheck />{t("premiumFeature1")}</p> 
                 <p><FaCheck />{t("premiumFeature2")}</p> 
                 <p><FaCheck />{t("premiumFeature3")}</p> 
            </div>
            
        </div>
      </div>
    </div>
  );
}
