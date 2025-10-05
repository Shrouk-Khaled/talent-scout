import { useLocale } from "next-intl";
import styles from "./Button.module.scss";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

const Button = ({ children, onClick, type = 'button', outline = false, style, icon, isArrow = false }) => {
    const locale = useLocale();
    return (
        <button type={type} onClick={onClick} className={`${styles.btn} ${outline && styles.outline}`} style={style}>
            {children}
            {icon && <span className={styles.icon}>{icon}</span>}
            {isArrow && <span className={styles.icon}>
            {locale == "ar" ? <BsArrowLeft/> : <BsArrowRight/>}</span>}
        </button>
    );
}

export default Button;