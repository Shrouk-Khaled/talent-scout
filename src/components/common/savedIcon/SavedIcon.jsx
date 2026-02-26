import { saveItem, unSavedItem } from "@/services/api";
import Image from "next/image";
import { useState } from "react";
import styles from "./SavedIcon.module.scss";

export const SavedIcon = ({ isSaved, itemType, itemId, bgColor,saveIcon }) => {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const handleSaved = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    if (saved) {
      unSavedItem({
        item_type: itemType,
        item_id: itemId,
      }).then(() => {
        setSaved(false);
        setLoading(false);
      });
    } else {
      saveItem({
        item_type: itemType,
        item_id: itemId,
      }).then(() => {
        setSaved(true);
        setLoading(false);
      });
    }
  };
  return (
    <div className={styles.container} style={{backgroundColor: bgColor}}>
      <Image
        src={saved ? "/images/icons/saved.svg" : saveIcon ? saveIcon : "/images/icons/outline-save.svg"}
        style={{
          filter: loading ? "grayscale(100%)" : "none",
          cursor: loading ? "not-allowed" : "pointer",
        }}
        alt="Like Icon"
        width={18}
        height={18}
        onClick={(e) => handleSaved(e)}
      />
    </div>
  );
};
