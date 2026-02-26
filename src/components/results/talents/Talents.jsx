import styles from "./Talents.module.scss";
import Filter from "@/components/feed/filter/Filter";
import Button from "@/components/ui/button/Button";
import Image from "next/image";

export const Talents = ({data}) => {
  // const [data, setData] = useState([]);

  // useEffect(() => {
  //     getPosts().then((res) => {
  //         setData(res)
  //     })
  // },[])

  return (
    <div className={styles.section}>
      <div className={styles.main}>
        {data?.map((talent, i) => (
          <div className={styles.talentBox} key={i}>
            <Image
              src={talent?.user?.image_url || "/images/logo.png"}
              width={100}
              height={100}
              alt="user"
              priority
            />
            <h2>{talent?.user?.first_name} {talent?.user?.last_name}</h2>
            <p>{talent?.subcategory?.name}</p>
            <Button onClick={() => console.log("View profile clicked")}>
              تفاصيل العقد
            </Button>
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
