'use client';

// pages/credit.jsx
import Head from 'next/head';
import './credit.css'; // CSS 파일 가져오기

const Credit = () => {
  return (
    <>
      <Head>
        <title>Credit</title>
      </Head>
      <div className="credit-container">
        <div className="credit-scroll">
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
    </>
  );
};

export default Credit;