"use client";
import Image from "next/image";
import styles from "./SideBar.module.scss";
import Link from "next/link";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export const SideBar = () => {
  const pathname = usePathname();
  const userInfo = useUserStore((state) => state.info);
  const data = useUserStore((state) => state.userData);

  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <Image
          src={"/images/user.png"}
          width={85}
          height={85}
          alt="profile pic"
          priority
        />
        <h1>
          مرحبا, {userInfo?.user?.first_name} {userInfo?.user?.last_name} 👋
        </h1>
        <p>{userInfo?.user?.short_bio}</p>
        <Link href={"/profile/edit"} className={styles.editBtn}>
          تعديل الحساب
        </Link>
      </div>
      <div className={styles.details}>
        <div>
          <p>المتابعون</p>
          <p>{userInfo?.user?.following}</p>
        </div>
        <div>
          <p>المتابعين</p>
          <p>{userInfo?.user?.followers}</p>
        </div>
        <div>
          <p>المنشورات</p>
          <p>0</p>
        </div>
      </div>

      {data?.token_type == "LIMITED_ACCESS" && (
        <div className={styles.pendingAcc}>
          <Image
            src={"/images/pending-acc.png"}
            width={90}
            height={90}
            alt="pic"
          />
          <div className={styles.info}>
            <h1>حسابك قيد المراجعة ⏳</h1>
            <p>نقوم بمراجعة بياناتك حاليا و سيتم ارسال اشعار فور الانتهاء</p>
          </div>
        </div>
      )}

      <div className={styles.pages}>
        {[
          {
            name: "منشوراتي",
            icon: "/images/icons/user.svg",
            path: "/profile/posts",
            unique: "posts",
          },
          {
            name: "العناصر المحفوظة",
            icon: "/images/icons/saves.svg",
            path: "/profile/saved?type=posts",
            unique: "saved",
          },
          {
            name: "الطلبات",
            icon: "/images/icons/contracts.svg",
            path: "/profile/contracts",
            unique: "contracts",
          },
          {
            name: "إعدادات الحساب",
            icon: "/images/icons/sittings.svg",
            path: "/profile/sittings",
            unique: "sittings",
          },
        ].map((page) => {
          if (userInfo?.user?.user_role != 1 && page.path == "/profile/posts") {
            return null; // Skip rendering this page for user_role 1
          }
          if (
            userInfo?.user?.user_role == 1 &&
            page.path == "/profile/contracts"
          ) {
            return null; // Skip rendering this page for user_role not 1
          }
          return (
            <Link
              key={page.name}
              className={`${styles.pageDetails} ${
                pathname?.includes(page.unique) && styles.active
              }`}
              href={page.path}
            >
              <div className={styles.pageTitle}>
                <div className={styles.iconBox}>
                  <Image
                    src={page.icon}
                    width={20}
                    height={20}
                    alt={`${page.name} icon`}
                    priority
                  />
                </div>
                <p>{page.name}</p>
              </div>
              <MdOutlineArrowBackIos />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
