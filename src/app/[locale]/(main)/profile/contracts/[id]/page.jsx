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
                                <h4>{data?.type == 1 ? "دوام كلي" : data?.type == 3 ? "دوام جزئى" : data?.type == 2 ? "عمل حر" : "اخري"}</h4>
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

                    <div className={`${styles.typeBox} ${styles.pending}`}>
                        <div>
                            <p>حالة الطلب:</p>
                            <h3>{data?.status}</h3>
                        </div>
                        <Image src={"/images/icons/contract6.svg"} width={20} height={20} alt="pic"/>
                    </div>
                </div>
            </div>
        </div>
    )
}