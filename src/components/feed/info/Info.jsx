import Image from "next/image";
import styles from "./info.module.scss";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { HiOutlineLocationMarker } from "react-icons/hi";

export default function Info() {
  return (
    <div className={styles.details}>
      <div className={styles.user}>
        <Image
          src="/images/user.png"
          alt="User Avatar"
          width={90}
          height={90}
          className={styles.avatar}
        />
        <h4>محمد خالد</h4>
        <div className={styles.nameBox}>
          <Image
            src="/images/icons/diamond.svg"
            alt="diamond"
            width={20}
            height={20}
            className={styles.verified}
          />
          <p className={styles.name}>الباقة المميزة</p>
        </div>
      </div>

      <div className={styles.card}>
        <h6>إقتراحات موهوبين لك</h6>
        <div className={styles.suggetions}>
          {[1, 2].map((item) => (
            <div className={styles.suggetion} key={item}>
              <div className={styles.talent}>
                <Image
                  src="/images/avatar.png"
                  alt="User Avatar"
                  width={50}
                  height={50}
                  className={styles.avatar}
                />
                <div className={styles.info}>
                  <h5>أحمد محمد</h5>
                  <p>مصمم جرافيك</p>
                </div>
              </div>
              <Button className={styles.follow}>متابعة</Button>
            </div>
          ))}
        </div>
        <Link href={"/"} className={styles.showMore}>
          رؤية المزيد
        </Link>
      </div>

      <div className={styles.card}>
        <h6>المناسبات القادمة</h6>
        <div className={styles.events}>
          {[1, 2].map((item) => (
            <div className={styles.event} key={item}>
              <Image
                src="/images/home/event.png"
                alt="Event Avatar"
                width={232}
                height={146}
                className={styles.eventImage}
              />
              <div>
                <h5>أهمية البرمجة في عصرنا الحالي 2025</h5>
                <p className={styles.location}>
                  <HiOutlineLocationMarker />
                  <span>السعودية, الرياض</span>
                </p>
                <div className={styles.date}>
                  <p>14 مارس 2024</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Link href={"/"} className={styles.showMore}>
          رؤية المزيد
        </Link>
      </div>

      <div className={styles.card}>
        <h6>أشهر المقالات</h6>
        <div className={styles.events}>
          {[1, 2].map((item) => (
            <div className={styles.event} key={item}>
              <Image
                src="/images/home/article.png"
                alt="Article Avatar"
                width={232}
                height={146}
                className={styles.eventImage}
              />
              <div>
                <h5>أهمية البرمجة في عصرنا الحالي 2025</h5>
                <p className={styles.location}>
                  <span>السعودية, الرياض</span>
                </p>
                <div className={styles.date}>
                  <p>14 مارس 2024</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Link href={"/"} className={styles.showMore}>
          رؤية المزيد
        </Link>
      </div>
    </div>
  );
}
