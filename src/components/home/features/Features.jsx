import Button from "@/components/ui/button/Button";
import styles from "./Features.module.scss";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function Features() {
  const router = useRouter();
  const t = useTranslations("Home");
  const steps = t.raw("steps");

  return (
    <div className={`${styles.features} app-container`}>
      <p className={styles.title}>{t("smallSteps")}</p>
      <h1 className={styles.desc}>
         {t("smallStepsDesc")} <span>{t("smallStepsDescSpan")}</span>
      </h1>

      <div className={styles.steps}>
        {steps.map((step, index) => (
          <div key={index} className={styles.step}>
            <h2>
              <span>{step.number}</span> {step.title}
            </h2>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>

      <Button isArrow onClick={() => {
                router.push('/auth/login');
            }}>
        {t("joinPlatform")}
      </Button>
    </div>
  );
}
