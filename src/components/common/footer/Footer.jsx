import Image from "next/image";
import DownloadAppBox from "./DownloadApp";
import styles from "./Footer.module.scss";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { RiTwitterXLine } from "react-icons/ri";
import { FaFacebookF } from "react-icons/fa";
import Link from "next/link";
import { IoIosStar } from "react-icons/io";
import { LuMail } from "react-icons/lu";
import { LuPhone } from "react-icons/lu";
import { HiOutlineLocationMarker } from "react-icons/hi";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={`${styles.main} app-container`}>
        <DownloadAppBox />

        <div className={styles.info}>
          <div className={styles.right}>
            <Image
              src={"/images/logo2.png"}
              alt={"Talent Scout"}
              width={80}
              height={60}
              className={styles.logo}
              priority
            />
            <p className={styles.desc}>
              منصتنا تجمع الموهوبين والباحثين عن الإبداع في بيئة آمنة وموثوقة،
              نؤمن أن لكل إنسان موهبة تستحق أن تُكتشف، ونفتح لك الأبواب لتكون
              جزءًا من مستقبل ملهم.
            </p>
            <div className={styles.social}>
              <a
                href="https://www.youtube.com/@talentscout9671"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.icon}
              >
                <FaYoutube />
              </a>

              <a
                href="https://www.youtube.com/@talentscout9671"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.icon}
              >
                <FaLinkedinIn />
              </a>

              <a
                href="https://www.youtube.com/@talentscout9671"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.icon}
              >
                <RiInstagramFill />
              </a>

              <a
                href="https://www.youtube.com/@talentscout9671"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.icon}
              >
                <RiTwitterXLine />
              </a>

              <a
                href="https://www.youtube.com/@talentscout9671"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.icon}
              >
                <FaFacebookF />
              </a>
            </div>
          </div>
          <div className={styles.mid}>
            <h3>روابط مهمة</h3>
            <div className={styles.links}>
              <div className={styles.link}>
                <IoIosStar />
                <Link href="/">الرئيسية</Link>
              </div>
              <div className={styles.link}>
                <IoIosStar />
                <Link href="/">المواهب</Link>
              </div>
              <div className={styles.link}>
                <IoIosStar />
                <Link href="/">من نحن</Link>
              </div>
              <div className={styles.link}>
                <IoIosStar />
                <Link href="/">المقالات</Link>
              </div>
              <div className={styles.link}>
                <IoIosStar />
                <Link href="/">المناسبات</Link>
              </div>
            </div>
          </div>
          <div className={styles.left}>
            <div className={styles.contacts}>
              <h3>تواصل معنا</h3>

              <div className={styles.contact}>
                <LuMail />
                <a
                  href="mailto:contact@company.com"
                  className={styles.contactLink}
                >
                  contact@company.com
                </a>
              </div>
              <div className={styles.contact}>
                <LuPhone />
                <a href="tel:+14146875892" className={styles.contactLink}>
                  687 - 5892 (414)
                </a>
              </div>
              <div className={styles.contact}>
                <HiOutlineLocationMarker />
                <a
                  href="https://www.google.com/maps?q=24.7136,46.6753" // Replace with actual coordinates or address
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactLink}
                >
                  السعودية الرياض
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.shortDesc}>
            <p>جميع الحقوق محفوظة تالنت سكوت</p>
        </div>
      </div>
    </div>
  );
}
