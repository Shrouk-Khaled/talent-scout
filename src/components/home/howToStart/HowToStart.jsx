import Image from "next/image";
import styles from "./HowToStart.module.scss";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function HowToStart({ isResearcher }) {
  const router = useRouter();
  const t = useTranslations("Home");
  
  return (
    <div className={`${isResearcher && styles.reverse} ${styles.section}`} id="4">
      <div className={styles.image}>
        <Image
          src={
            isResearcher
              ? "/images/home/section-avatar2.png"
              : "/images/home/section-avatar.png"
          }
          alt="how to start"
          width={500}
          height={600}
          loading="lazy"
        />
      </div>
      {isResearcher ? (
        <div className={styles.info}>
          <h6>{t("getStartedAsResearcher")}</h6>
          <h1>
            {t("getStartedAsResearcherDesc")}
          </h1>

          <div className={styles.steps}>
            <div className={styles.step}>
              <Image
                src={"/images/icons/star-thin.svg"}
                alt="star"
                width={40}
                height={40}
              />
              <div>
                <h6>{t("step1Researcher")}</h6>
                <p>{t("step1ResearcherDesc")}</p>
              </div>
            </div>

            <div className={styles.step}>
              <Image
                src={"/images/icons/star-thin.svg"}
                alt="star"
                width={40}
                height={40}
              />
              <div>
                <h6>{t("step2Researcher")}</h6>
                <p>{t("step2ResearcherDesc")}</p>
              </div>
            </div>

            <div className={styles.step}>
              <Image
                src={"/images/icons/star-thin.svg"}
                alt="star"
                width={40}
                height={40}
              />
              <div>
                <h6>{t("step3Researcher")}</h6>
                <p>{t("step3ResearcherDesc")}</p>
              </div>
            </div>
          </div>

          <Button isArrow onClick={() => {
                router.push('/auth/login');
            }}>{t("registerAsResearcher")}</Button>
        </div>
      ) : (
        <div className={styles.info}>
          <h6>{t("getStartedAsTalent")}</h6>
          <h1>
            {t("getStartedAsTalentDesc")}
          </h1>

          <div className={styles.steps}>
            <div className={styles.step}>
              <Image
                src={"/images/icons/star-thin.svg"}
                alt="star"
                width={40}
                height={40}
              />
              <div>
                <h6>{t("step1")}</h6>
                <p>{t("step1Desc")}</p>
              </div>
            </div>

            <div className={styles.step}>
              <Image
                src={"/images/icons/star-thin.svg"}
                alt="star"
                width={40}
                height={40}
              />
              <div>
                <h6>{t("step2")}</h6>
                <p>{t("step2Desc")}</p>
              </div>
            </div>

            <div className={styles.step}>
              <Image
                src={"/images/icons/star-thin.svg"}
                alt="star"
                width={40}
                height={40}
              />
              <div>
                <h6>{t("step3")}</h6>
                <p>{t("step3Desc")}</p>
              </div>
            </div>
          </div>

          <Button isArrow onClick={() => {
                router.push('/auth/login');
            }}>{t("registerAsTalent")}</Button>
        </div>
      )}
    </div>
  );
}
