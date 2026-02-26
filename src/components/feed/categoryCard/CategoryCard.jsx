import styles from './CategoryCard.module.scss';

const CategoryCard = ({ image, title, onClick, className = '' }) => {
  return (
    <div className={`${styles.categoryCard} ${className}`} onClick={onClick}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={styles.image} />
        <div className={styles.overlay} />
      </div>
      <h3 className={styles.title}>{title}</h3>
    </div>
  );
};

export default CategoryCard;