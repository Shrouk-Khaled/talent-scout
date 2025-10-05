"use client"
import Info from "@/components/feed/info/Info";
import styles from "./page.module.scss";
import Post from "@/components/feed/post/Post";
import Filter from "@/components/feed/filter/Filter";
import Input from "@/components/ui/input/Input";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import { FaFilter } from "react-icons/fa";
import { useState } from "react";
import { Drawer } from "antd";
import { useLocale } from "next-intl";

export default function Feed() {
    const isTalent = true;
    const locale = useLocale();
    const isRTL = locale == "ar";
    const [openFilter, setOpenFilter] = useState(false);
    
    return <div className={`${styles.container} app-container`}>
        <div className={styles.search}>
            <Input 
                placeholder="ابحث عن موهبة، براءة إختراع، فكرة مشروع ..."
                className={styles.input}
                suffix={<FiSearch />}
            />
            <span className={styles.filterIcon} onClick={() => setOpenFilter(true)}><FaFilter className={styles.icon}/></span>
        </div>
        <div className={styles.info}>
            <Info/>
        </div>
        <div className={styles.mid}>
            {
                isTalent &&
                <div className={styles.createPost}>
                <div className={styles.post}>
                    <textarea placeholder="قم بالنشر ....." rows={1} className={styles.textArea}></textarea>
                    <Image src="/images/user.png" alt="User Avatar" width={50} height={50} className={styles.avatar}/>
                </div>
                <div className={styles.uploads}>
                    <div>
                        <Image src="/images/icons/file.svg" alt="upload image" width={20} height={20}/>
                        <span>ملف</span>
                    </div>
                    <div>
                        <Image src="/images/icons/photo.svg" alt="upload image" width={20} height={20}/>
                        <span>صورة</span>
                    </div>
                    <div>
                        <Image src="/images/icons/video.svg" alt="upload image" width={20} height={20}/>
                        <span> مقطع فيديو</span>
                    </div>
                </div>
            </div>
            }
            <div className={styles.posts}>
                {[1, 2, 3].map((_, i) => (
                    <Post key={i} isTalent={isTalent}/>
                ))}
            </div>
        </div>
        <div className={styles.filter}>
            <Filter/>
        </div>

        <Drawer
        placement={isRTL ? "right" : "left"}
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        closable={false}
        width={340} // <— tweak to your design
        styles={{
          header: { display: 'none' },               
          body:   { padding: 0, fontFamily: 'MadaniArabic' },
        }}
        className={styles.drawer} // panel
        rootClassName={styles.drawerRoot} // wrapper
      >
        <Filter/>
        </Drawer>
    </div>
}