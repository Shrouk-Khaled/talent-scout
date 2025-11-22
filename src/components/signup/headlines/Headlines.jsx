import styles from './Headlines.module.scss';

export default function Headlines({line1, line2}) {
  return (
    <div className={styles.texts}>
        <h1>{line1}</h1>
        <p>{line2}</p>
    </div>
  );
}
