import Image from "next/image";
import styles from "./Questions.module.scss";
import { IoIosStar } from "react-icons/io";
import Accordion from "@/components/ui/accordion/Accordion";
import { useTranslations } from "next-intl";

export default function Questions() {
  const t = useTranslations("Home");
  const questions = t.raw("questions");

    return(
        <div className={styles.section}>
            <div className={styles.info}>
                <p>
                    <Image src={"/images/icons/blue-star.svg"} alt={"idea"} width={24} height={24} className={styles.ideaIcon} priority/>
                    {t("futureSteps")}</p>
          <h1>{t("futureStepsDesc")}</h1>
            </div>
            <div className={styles.questions}>
                 <Accordion items={questions} defaultOpen={0} />
            </div>
        </div>
    )
}