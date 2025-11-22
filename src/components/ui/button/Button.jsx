import { useLocale } from "next-intl";
import styles from "./Button.module.scss";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Button = ({
  children,
  onClick,
  type = "button",
  outline = false,
  style,
  icon,
  isArrow = false,
  disabled = false,
  loading = false,
}) => {
  const locale = useLocale();
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${styles.btn} ${outline && styles.outline} ${loading && styles.loadingBtn}`}
      style={style}
    >
      {loading ? (
        <span className={styles.loader}>
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 26 }} spin className={styles.loading} />}
            size="large"
          />
        </span>
      ) : (
        <>
          {children}
          {icon && <span className={styles.icon}>{icon}</span>}
          {isArrow && (
            <span className={styles.icon}>
              {locale == "ar" ? <BsArrowLeft /> : <BsArrowRight />}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
