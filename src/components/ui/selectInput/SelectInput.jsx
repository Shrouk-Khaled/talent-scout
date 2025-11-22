import { Select } from "antd";
import styles from "./SelectInput.module.scss";

export default function SelectInput({
  options,
  label,
  value,
  onChange,
  onSearch,
  placeholder,
  multiple = false
}) {
  return (
    <div className={styles.select}>
      {label && <label>{label}</label>}
      <Select
        showSearch
        value={value}
        onChange={onChange}
        onSearch={onSearch}
        placeholder={placeholder}
        optionFilterProp="label"
        className={styles.customSelect}
        options={options}
        getPopupContainer={(trigger) => trigger.parentElement}
        mode={multiple && "multiple"}
      />
    </div>
  );
}
