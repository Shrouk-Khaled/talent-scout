"use client"
import Link from "next/link";
import styles from "./TalentsLine.module.scss";
import { useEffect, useState } from "react";
import { getAllCategories } from "@/services/api";
import Slider from "@/components/ui/slider/Slider";
import { useHomeStore } from "@/store/useHome";
import { useUserStore } from "@/store/useUserStore";

export const TalentsLine = () => {
  const [data, setData] = useState([]);
  const saveCategories = useHomeStore((state) => state.setHomeData);
  const categories = useHomeStore((state) => state.categories);
  const user = useUserStore((state) => state.info);

  useEffect(() => {
    if(categories?.length == 0 && user?.talent_type?.id) {
      getAllCategories().then((res) => {
        setData(res);
        saveCategories({
          categories: res?.filter((obj) => obj?.participationTypeId == user?.talent_type?.id) || []
        })
      });
    } else {
      setData(categories);
    }
  }, [user]);

  return (
    <div className={styles.talents}>
      <div className="app-container">
        <Slider
          title=""
          variant="default"
          showArrows={false}
          rtl={true}
          gap={5}
          autoplay
          slidesPerView={6}
          onViewAllClick={() => console.log("View all clicked")}
        >
          {data?.map((obj, i) => (
            <Link
              key={i}
              href={`/search?type=posts&category=${obj?.id}`}
              className={styles.talentLink}
            >
              {obj?.name}
            </Link>
          ))}
        </Slider>
      </div>
    </div>
  );
};
