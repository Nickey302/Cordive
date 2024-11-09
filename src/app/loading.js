'use client';

import { motion } from 'framer-motion';
import styles from './loading.module.css';
//
//
//
export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          CORDIVE
        </motion.h1>
        
        <div className={styles.dotsContainer}>
          <motion.div
            className={styles.dot}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: 0,
            }}
          />
          <motion.div
            className={styles.dot}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: 0.2,
            }}
          />
          <motion.div
            className={styles.dot}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: 0.4,
            }}
          />
        </div>
      </div>
    </div>
  );
}