import styles from "./PageHeader.module.scss";

export const PageHeader = ({title, desc}) => {
    return(
        <div className={styles.header}>
            <h1>{title}</h1>
            <p>{desc}</p>
        </div>
    )
}