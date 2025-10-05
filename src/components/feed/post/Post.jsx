import Image from "next/image";
import styles from "./Post.module.scss";
import Button from "@/components/ui/button/Button";

export default function Post({isTalent}) {
  return (
    <div className={styles.post}>
      <div className={styles.talentData}>
        <div className={styles.info}>
          <Image
            src="/images/avatar.png"
            alt="User Avatar"
            width={50}
            height={50}
            className={styles.avatar}
          />
          <div>
            <h6>مجهول 212</h6>
            <p>منذ 3 ساعات</p>
          </div>
        </div>
        <div className={styles.personalTalent}>
          <p>موهبة شخصية</p>
        </div>
      </div>

      <div className={styles.content}>
        <h5>لاعب كره قدم</h5>
        <div>
            <p>
            من وأنا صغير وكُرة القدم جزء من حياتي، لعبت في أكتر من نادي في منطقتي وعمري ما فقدت الشغف للملاعب بحلم إن حد يكتشف موهبتي وأوصل لليوم اللي أحقق فيه حلمي. 
            <span>قراءة المزيد</span>
            </p>
        </div>
        <Image
            src="/images/home/event.png"
            alt="Post Image"
            width={600}
            height={280}
            className={styles.postImage}
        />
      </div>

      <div className={styles.postFooter}>
            <div className={styles.reactions}>
                <div className={styles.reaction}>
                    <Image
                        src="/images/icons/fav.svg"
                        alt="Like Icon"
                        width={20}
                        height={20}
                        className={styles.icon}
                    />
                    <span>24</span>
                </div>
                <div className={styles.reaction}>
                    <Image
                        src="/images/icons/save.svg"
                        alt="Like Icon"
                        width={20}
                        height={20}
                        className={styles.icon}
                    />
                </div>
            </div>
            <div className={styles.sendContract}>
              {
                !isTalent && 
                  <Button>أرسل عقد</Button>
              }
            </div>
      </div>
    </div>
  );
}
