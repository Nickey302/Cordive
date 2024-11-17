import styles from './LoadingOverlay.module.css';
//
//
//
export default function LoadingOverlay() {
    return (
        <div className={styles.loadingOverlay}>
            <div className={styles.content}>
                <div className={styles.spinner}></div>
                <p className={styles.text}>Transferring to Utopia...</p>
            </div>
        </div>
    );
} 