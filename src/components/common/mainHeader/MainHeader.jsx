"use client";
import Image from "next/image";
import styles from "./MainHeader.module.scss";
import { useLocale, useTranslations } from "next-intl";
import Language from "../language/Language";
import Button from "@/components/ui/button/Button";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Input from "@/components/ui/input/Input";
import { FiPlus, FiSearch } from "react-icons/fi";
import { TbMail } from "react-icons/tb";
import { RiNotification3Line } from "react-icons/ri";
import UserDropdown from "../userDropdown/UserDropdown";
import { SearchInput } from "../searchInput/SearchInput";
import { useUserStore } from "@/store/useUserStore";
import { Divider } from "antd";

export default function MainHeader() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Header");
  //store
  const userInfo = useUserStore((state) => state.info);
  //states
  const [scrolling, setScrolling] = useState(false);

  // Detect scroll to change background color of the header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        // Adjust scroll threshold if needed
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`${styles.header} ${scrolling ? styles.scrolled : ""}  ${
        styles.notHome
      }`}
    >
      <div className={`${styles.mainInfo} app-container`}>
        <div className={styles.searchBox}>
        <div className={styles.logoBox}>
          <Image
            src={"/images/logo.png"}
            alt="Logo"
            width={70}
            height={60}
            className={styles.logo}
            priority
            onClick={() => router.push(`/${locale}/feed`)}
          />
        </div>
       <SearchInput/>
        </div>

          <div className={styles.actions} style={{width: userInfo?.user?.user_role != 1 ? "25%" : "40%"}}>
            <Language />
            {
              userInfo?.user?.user_role == 1 ? (
                <Button
                  onClick={() => {
                    router.push("/posts/create");
                  }}
                  icon={<FiPlus/>}
                >
                    اضافة منشور
                </Button>
              ) : null
            }
            <Divider type="vertical" style={{ height: 28, margin: "0 8px" }} />
            <Image src={"/images/icons/sms.svg"} width={24} height={24} alt="sms icon"/>
            <Image src={"/images/icons/notification.svg"} width={24} height={24} alt="notification icon"/>

            {/* <TbMail  className={styles.icon}/> */}
            {/* <RiNotification3Line  className={styles.icon}/> */}
            <UserDropdown/>
          </div>
      </div>
    </header>
  );
}
