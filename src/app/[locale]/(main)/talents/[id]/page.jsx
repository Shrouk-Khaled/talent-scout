"use client"
import Image from "next/image";
import styles from "./page.module.scss";
import Button from "@/components/ui/button/Button";
import Post from "@/components/feed/post/Post";
import { useRouter } from "next/navigation";

export default function TalentDetailsPage({params}) {
    const {id} = params;
    const router = useRouter();
    
    return (
        <div className={`${styles.container} app-container`}>
            <div className={styles.talentBox}>
                <Image src={"/images/talent-cover.png"} className={styles.talentImage} width={1000} height={221} alt="pic"/>

                <div className={styles.talentInfo}>
                    <div className={styles.left}>
                        <Image src={"/images/logo.png"} width={100} height={100} alt="pic"/>
                       <div>
                       <h2>محمد أحمد</h2>
                       <p>مصمم جرافيك</p>
                       </div>
                    </div>
                    <div className={styles.right}>
                        <Button onClick={() => {router.push(`/talents/contract/${id}`)}} icon={<Image src={"/images/icons/connect.svg"} width={15} height={15} alt="pic"/>}>
                            تواصل
                        </Button>
                        <Button outline>
                            متابعة
                        </Button>
                    </div>
                </div>

                <div className={styles.followers}>
                    <div className={styles.info}>
                        <h3>المتابعون</h3>
                        <div>
                            <Image  src={"/images/icons/following.svg"} width={20} height={20} alt="pic"/>
                            <span>1200</span>
                        </div>
                    </div>
                    <div className={styles.info}>
                        <h3>المتابعين</h3>
                        <div>
                            <Image  src={"/images/icons/followers.svg"} width={20} height={20} alt="pic"/>
                            <span>1200</span>
                        </div>
                    </div>
                    <div className={styles.info}>
                        <h3>المنشورات</h3>
                        <div>
                            <Image  src={"/images/icons/posts.svg"} width={20} height={20} alt="pic"/>
                            <span>1200</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={styles.posts}>
                {
                    [1,2,3,4].map((post, i) => (
                        <Post key={i} showFooter/>
                    ))
                }
            </div>
        </div>
    );
    }