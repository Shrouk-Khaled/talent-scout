import Button from "@/components/ui/button/Button";
import styles from "./Packages.module.scss";
import { FaCheck } from "react-icons/fa";

export default function Packages() {
  return (
    <div className={styles.section}>
      <p className={styles.title}>الباقات و الأسعار</p>
      <h1 className={styles.desc}>
        استمتع بمزايا الباقة الإحترافيه <span>مجانا</span> لمده سنة
      </h1>

      <div className={styles.packages}>
        <div className={`${styles.package} ${styles.normal}`}>
            <h1>الباقة المميزة</h1>
            <h3><span>مجانية</span> لمدة سنة</h3>

            <Button outline>إبدأ الان مجانا</Button>

            <h4>تحتوى علي:</h4>

            <div className={styles.list}>
                 <p><FaCheck />ظهور محلي + إقليمي + دولي</p> 
                 <p><FaCheck />إبراز الملف في البحث</p> 
                 <p><FaCheck />تواصل غير محدود مع الباحثين</p> 
            </div>
            
        </div>

        <div className={`${styles.package} ${styles.normal}`}>
            <h1>الباقة المميزة</h1>
            <h3><span>مجانية</span> لمدة سنة</h3>

            <Button outline>إبدأ الان مجانا</Button>

            <h4>تحتوى علي:</h4>

            <div className={styles.list}>
                 <p><FaCheck />ظهور محلي + إقليمي + دولي</p> 
                 <p><FaCheck />إبراز الملف في البحث</p> 
                 <p><FaCheck />تواصل غير محدود مع الباحثين</p> 
            </div>
            
        </div>

        <div className={styles.package}>
            <h1>الباقة المميزة</h1>
            <h3><span>مجانية</span> لمدة سنة</h3>

            <Button>إبدأ الان مجانا</Button>

            <h4>تحتوى علي:</h4>

            <div className={styles.list}>
                 <p><FaCheck />ظهور محلي + إقليمي + دولي</p> 
                 <p><FaCheck />إبراز الملف في البحث</p> 
                 <p><FaCheck />تواصل غير محدود مع الباحثين</p> 
            </div>
            
        </div>
      </div>
    </div>
  );
}
