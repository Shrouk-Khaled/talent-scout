"use client"
import Image from "next/image";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { getContractById } from "@/services/api";
import { useParams } from "next/navigation";
import Loading from "@/app/[locale]/loading";

export default function Page() {
    const { id } = useParams();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getContractById(id).then((res) => {
            setLoading(false)
            setData(res)
        })
    },[])

    const getStatusClass = (status) => {
        switch (status) {
          case 1:
            return {
              class: styles.accepted,
              text: "مقبول",
              image: "/images/icons/contract5.svg"
            };
          case 2:
            return {
              class: styles.rejected,
              text: "مرفوض",
              image: "/images/icons/contract4.svg"
            };
          case 3:
            return {
              class: styles.pending,
              text: "قيد الانتظار",
              image: "/images/icons/contract6.svg"
            };
          case 4: 
            return {
              class: styles.rejected,
              text: "ملغي",
              image: "/images/icons/contract4.svg"
            }
          case 5: 
            return {
              class: styles.accepted,
              text: "مكتمل",
              image: "/images/icons/contract5.svg"
            }
          default:
            return "";
        }
      }

      const getTypeText = (type) => {
        switch (type) {
            case 1:
                return "دوام كلي";
            case 3:
                return "دوام جزئى";
            case 4:
                return "شراكة";
            case 2:
                return "عمل حر";
            case 5:
                return "أخرى";
            default:
                return "";
        }
      }
    

    return (
        <div className={`${styles.container} app-container`}>
            <h1>تفاصيل الطلب</h1>

            {
                loading && <Loading/>
            }
            
            <div className={styles.details}>
                <div className={styles.info}>
                    <div>
                        <h3>وصف العمل</h3>
                        <p>{data?.description}</p>
                    </div>

                    <div className={styles.contractDetails}>
                        <h3>تفاصيل الطلب</h3>
                        <div className={styles.infoBox}>
                            <div className={styles.box}>
                                <Image src={"/images/icons/contract1.svg"} width={50} height={50} alt="pic"/>
                                <p>قيمة الطلب</p>
                                <h4>{data?.amount}</h4>
                            </div>

                            <div className={styles.box}>
                                <Image src={"/images/icons/contract2.svg"} width={50} height={50} alt="pic"/>
                                <p>مدة العمل</p>
                                <h4>{data?.period}</h4>
                            </div>

                            <div className={styles.box}>
                                <Image src={"/images/icons/contract3.svg"} width={50} height={50} alt="pic"/>
                                <p>نوع العمل</p>
                                <h4>{getTypeText(data?.type)}</h4>
                                </div>
                        </div>
                    </div>

                </div>

                <div className={styles.talentInfo}>
                    <div className={styles.talent}>
                        <p>تم ارسال الطلب ال:</p>
                        <div className={styles.talentData}>
                            <Image src={data?.receiver?.image_url || "/images/logo.png"} width={50} height={50} alt="pic"/>
                            <div>
                                <h3>{data?.receiver?.first_name} {data?.receiver?.last_name}</h3>
                                {/* <p>كرة قدم</p> */}
                            </div> 
                        </div>
                        <div className={styles.accountDetails}>
                            تفاصيل الحساب
                        </div>
                    </div>

                    <div className={`${styles.typeBox} ${getStatusClass(data?.status)?.class}`}>
                        <div>
                            <p>حالة الطلب:</p>
                            <h3>{getStatusClass(data?.status)?.text}</h3>
                        </div>
                        <Image src={getStatusClass(data?.status)?.image} width={20} height={20} alt="pic"/>
                    </div>
                </div>
            </div>
        </div>
    )
}