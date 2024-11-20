'use client'

import { useState } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import GlassmorphismOverlay from '../components/About/GlassmorphismOverlay';
import Image from 'next/image';
//
//
//
export default function Header()
{
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const dummyCards = [
    { title: "Card 1", content: "This is the content of card 1", image: "/assets/images/image111.png" },
    { title: "Card 2", content: "This is the content of card 2", image: "/assets/images/image222.png" },
    { title: "Card 3", content: "This is the content of card 3", image: "/assets/images/image333.png" },
  ];

  return (
    <>
      <header 
        className={`${styles.header} ${isExpanded ? styles.expanded : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles.logo}>
          <Image src="/assets/icons/logowhite.png" priority alt="Logo" width={60} height={60} />
        </div>
        <nav className={styles.navLinks}>
          <Link href="/">CORDIVE</Link>
          <Link href="/Dystopia">Dystopia</Link>
          <Link href="/Heterotopia">Heterotopia</Link>
          <Link href="/Utopia">Utopia</Link>
          {/* <a onClick={(e) => {
            e.stopPropagation();
            setIsAboutOpen(true);
          }}>About</a> */}
        </nav>
      </header>

      <GlassmorphismOverlay isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)}>
        <div className={styles.scrollContent}>
          <h1>About</h1>
          <p>This is the About content.</p>
          <div className={styles.cardContainer}>
            {dummyCards.map((card, index) => (
              <div key={index} className={styles.card}>
                <Image src={card.image} alt={card.title} width={200} height={150} />
                <h3>{card.title}</h3>
                <p>{card.content}</p>
              </div>
            ))}
          </div>
          {Array(10).fill().map((_, i) => (
            <p key={i}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          ))}
        </div>
      </GlassmorphismOverlay>
    </>
  );
}
