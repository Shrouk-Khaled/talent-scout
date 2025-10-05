import Button from "@/components/ui/button/Button";
import styles from "./Features.module.scss";
import { useTranslations } from "next-intl";

export default function Features() {
  const t = useTranslations("Home");
  const steps = t.raw("steps");

  return (
    <div className={`${styles.features} app-container`}>
      <p className={styles.title}>خطوات بسيطة نحو مستقبلك</p>
      <h1 className={styles.desc}>
        منصّة آمنة تمنحك الثقة و<span>الاطمئنان</span>
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

      <Button isArrow>
        انضم الي المنصة
      </Button>
    </div>
  );
}
