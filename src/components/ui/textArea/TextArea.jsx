import styles from "./TextArea.module.scss";

export default function TextArea({
  placeholder,
  rows = 4,
  maxLength,
  haveLengthLine,
  value,
  ...props
}) {
  return (
    <div className={styles.textBox}>
      <textarea
        placeholder={placeholder}
        className={styles.textArea}
        rows={rows}
        maxLength={maxLength}
        value={value}
        {...props}
      />
      {haveLengthLine && (
        <div className={styles.textLength}>
          <p>
            {maxLength}
            <span> / {value?.length || 0}</span>
          </p>
        </div>
      )}
    </div>
  );
}
