import Image from "next/image";
import styles from "./HowToStart.module.scss";
import Button from "@/components/ui/button/Button";

export default function HowToStart({ isResearcher }) {
  return (
    <div className={`${isResearcher && styles.reverse} ${styles.section}`}>
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
          priority
        />
      </div>
      {isResearcher ? (
        <div className={styles.info}>
          <h6>خطوات البدء كباحث</h6>
          <h1>
            وفرنا لك خطوات سهلة وبسيطة تمكّنك من <span>استكشاف</span> المواهب
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
                <h6>سجل كباحث</h6>
                <p>أنشئ حسابك وحدد اهتماماتك ومجالك.</p>
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
                <h6>اكتشف المواهب</h6>
                <p>ابحث في الخلاصة، تصفح المشاريع، واحفظ المميز منها.</p>
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
                <h6>ابدأ التعاون</h6>
                <p>تواصل مع الموهبة، أرسل عقد، وادعم الابتكار.</p>
              </div>
            </div>
          </div>

          <Button isArrow>سجل كباحث الان</Button>
        </div>
      ) : (
        <div className={styles.info}>
          <h6>خطوات البدء كموهوب</h6>
          <h1>
            وفرنا لك خطوات سهلة لتسجّل <span>موهبتك</span> وتنطلق بثقة
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
                <h6>أنشئ حسابك</h6>
                <p>سجل بياناتك واملأ ملفك الشخصي.</p>
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
                <h6>اعرض موهبتك</h6>
                <p>شارك مشاريعك، أفكارك، وصوّر ريلز قصيرة تعبر عنك.</p>
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
                <h6>اتصل بالباحثين</h6>
                <p>استقبل العروض، وقع العقود، وطور فرصك.</p>
              </div>
            </div>
          </div>

          <Button isArrow>سجل كموهوب الان</Button>
        </div>
      )}
    </div>
  );
}
