import styles from "./Talents.module.scss";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";

export const Talents = ({data}) => {
  const router = useRouter();

  return (
    <div className={styles.section}>
      <div className={styles.main}>
        {data?.map((talent, i) => (
          <div className={styles.talentBox} key={i} onClick={() => router.push(`/talents/${talent?.user?.id}`)}>
            <Image
              src={talent?.user?.image_url || "/images/logo.png"}
              width={100}
              height={100}
              alt="user"
              priority
            />
            <h2>{talent?.user?.first_name} {talent?.user?.last_name}</h2>
            <p>{talent?.subcategory?.name}</p>
            {/* <Button outline onClick={() => console.log("View profile clicked")}>
              تفاصيل العقد
            </Button> */}
          </div>
        ))}
      </div>
      {/* <div className={styles.filter}>
        <Filter
          onFilter={onFilter}
        />
      </div> */}
    </div>
  );
};
