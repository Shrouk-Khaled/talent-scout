import Image from "next/image";
import styles from "./OfferLine.module.scss";

export default function OfferLine() {
    return(
        <div className={styles.offer}>
            <Image src={"/images/icons/rocket.svg"} alt={"offer"} width={30} height={60} priority/>
            <span>العرض الافتتاحي: سنة كاملة مجاناً مع الخطة الماسية لجميع الأعضاء الجدد</span>
        </div>
    )
}