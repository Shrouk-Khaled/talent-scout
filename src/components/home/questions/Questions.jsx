import Image from "next/image";
import styles from "./Questions.module.scss";
import { IoIosStar } from "react-icons/io";
import Accordion from "@/components/ui/accordion/Accordion";

export default function Questions() {
    const items = [
        {
          title: "ما هو Talent Scout وكيف يعمل؟",
          subtitle: "",
          content: "كل طلب عقد تتم مراجعته عبر بوابة الإدارة قبل وصوله إلى الموهبة لضمان الشفافية والموثوقية."
        },
        {
          title: "كيف أحصل على عمل من خلاله؟",
          subtitle: "",
          content:
            "تسجيل حساب، تعبئة ملف التعريف، التقديم على العروض المناسبة وانتظار الموافقة."
        },
        {
          title: "كيف سأحصل على مستحقاتي؟",
          subtitle: "",
          content:
            "المستحقات تُدفع عبر الحساب البنكي المسجل خلال 30 يوم عمل من نهاية المشروع."
        },
        {
          title: "ما نوع الدعم الذي تقدمه؟",
          subtitle: "",
          content:
            "ندعم التوظيف المؤقت، الدعم الفني للمواهب، ومتابعة العقود."
        }
      ];

    return(
        <div className={styles.section}>
            <div className={styles.info}>
                <p>
                    <Image src={"/images/icons/blue-star.svg"} alt={"idea"} width={24} height={24} className={styles.ideaIcon} priority/>
                    خطوات بسيطة نحو مستقبلك</p>
                <h1>ما زلت متردداً؟ إليك ما <span>تحتاج</span> إلى معرفته</h1>
            </div>
            <div className={styles.questions}>
                 <Accordion items={items} defaultOpen={0} />
            </div>
        </div>
    )
}