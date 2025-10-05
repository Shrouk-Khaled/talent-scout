"use client"

import Image from "next/image";
import styles from "./Hero.module.scss";
import Button from "@/components/ui/button/Button";
import { IoIosStar } from "react-icons/io";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const Hero = () => {
    const t = useTranslations('Home');

    const [show, setShow] = useState(false);

    useEffect(() => {
      setShow(true);
    }, []);

    return (
    <div className={`${styles.hero} ${show ? styles.show : ""}`}>
      <div className={`${styles.main} app-container`}>
        <div className={styles.right}>
          <h4>
            <IoIosStar /> {t("heroText")}
          </h4>
          <h1>
            {t("description")}
            <Image
              src={"/images/icons/idea.png"}
              alt={"idea"}
              width={40}
              height={50}
              className={styles.ideaIcon}
              loading="lazy"
            />
          </h1>
          <p>{t("heroText2")}</p>
          <div className={styles.btns}>
            <Button icon={<Image src={"/images/icons/idea2.png"} width={20} height={20} alt="idea"/>}>{t("shareYourTalent")}</Button>
            <Button outline isArrow>{t("discoverTalents")}</Button>
          </div>
        </div>
        <div className={styles.left}>
          <Image
            src={"/images/home/hero.png"}
            alt={"hero"}
            width={470}
            height={500}
            className={styles.img}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
