"use client"
import Link from "next/link";
import styles from "./TalentsLine.module.scss";
import { useEffect, useState } from "react";
import { getAllCategories } from "@/services/api";
import Slider from "@/components/ui/slider/Slider";
import { useHomeStore } from "@/store/useHome";

export const TalentsLine = () => {
  const [data, setData] = useState([]);
  const saveCategories = useHomeStore((state) => state.setHomeData);
  const categories = useHomeStore((state) => state.categories);

  useEffect(() => {
    if(categories?.length == 0) {
      getAllCategories().then((res) => {
        setData(res);
        saveCategories({
          categories: res
        })
      });
    } else {
      setData(categories);
    }
  }, []);

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
              // href={`/posts?category=${obj?.id}`}
              href={"#"}
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
