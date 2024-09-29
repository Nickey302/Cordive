'use client';

import Head from 'next/head';
import styles from './page.module.css';
import Header from '../Header.jsx';
//
//
//
const Credit = () => {
  return (
    <div className={styles.credit}>
      <Header />
      <Head>
        <title>Credit</title>
      </Head>
      <div className={styles.creditContainer}>
        <div className={styles.creditScroll}>
          <h1>CREDIT</h1>
          <h2>CORDIVE</h2>
          <h3>Team Compassion+</h3>
          <p>Yeeun Lee</p>
          <p>Chanyeop Jang</p>
          <p>Yunji Han</p>
          <p>Minkyun Kim</p>
          <h3>Thank You</h3>
        </div>
      </div>
    </div>
  );
};

export default Credit;