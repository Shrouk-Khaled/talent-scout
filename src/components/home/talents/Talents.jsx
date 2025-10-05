import styles from "./Talents.module.scss";

export default function Talents() {
  return <div className={styles.section}>
      <p className={styles.title}>خطوات بسيطة نحو مستقبلك</p>
      <h1 className={styles.desc}>
      تعرّف على مجموعة متنوعة من <span>المواهب</span>
      </h1>

      <div className={`${styles.talents} app-container`}>
        <div className={styles.talent} style={{backgroundImage: 'url("/images/home/talent.png")'}}>
            <h1 className={styles.title}>الكتابة والترجمة</h1>
        </div>
        <div className={styles.talent} style={{backgroundImage: 'url("/images/home/talent2.png")'}}>
            <h1 className={styles.title}>اللياقة و الصحة</h1>
        </div>
        <div className={styles.talent} style={{backgroundImage: 'url("/images/home/talent3.png")'}}>
            <h1 className={styles.title}>رياده الأعمال التسويق</h1>
        </div>
        <div className={styles.talent} style={{backgroundImage: 'url("/images/home/talent.png")'}}>
            <h1 className={styles.title}>الفن  و التصميم</h1>
        </div>
        <div className={styles.talent} style={{backgroundImage: 'url("/images/home/talent4.png")'}}>
            <h1 className={styles.title}>التمثيل و الفنون الأدائية</h1>
        </div>
        <div className={styles.talent} style={{backgroundImage: 'url("/images/home/talent5.png")'}}>
            <h1 className={styles.title}>التكنولوجيا و البرمجة</h1>
        </div>
        <div className={styles.talent} style={{backgroundImage: 'url("/images/home/talent6.png")'}}>
            <h1 className={styles.title}>الإستشارات و التدريب</h1>
        </div>
        <div className={styles.talent} style={{backgroundImage: 'url("/images/home/talent7.png")'}}>
            <h1 className={styles.title}>الصوت و الفيديو</h1>
        </div>
      </div>
  </div>;
}