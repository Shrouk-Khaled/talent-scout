import styles from "./SelectBox.module.scss";

export default function SelectBox({ types, selectedType, onSelectType, boxStyle }) {
  return (
    <div className={styles.types}>
      {types.map((type, i) => (
        <span
          key={i}
          className={selectedType === type.id ? styles.active : ""}
          onClick={() => onSelectType(type.id)}
          style={boxStyle}
        >
          {type.label}
        </span>
      ))}
    </div>
  );
}
