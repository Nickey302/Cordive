import { useState } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import GlassmorphismOverlay from '../components/About/GlassmorphismOverlay';
import Image from 'next/image';

export default function Header()
{
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isCreditOpen, setIsCreditOpen] = useState(false);

  const dummyCards = [
    { title: "Card 1", content: "This is the content of card 1", image: "/assets/images/image111.png" },
    { title: "Card 2", content: "This is the content of card 2", image: "/assets/images/image222.png" },
    { title: "Card 3", content: "This is the content of card 3", image: "/assets/images/image333.png" },
  ];

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>CORDIVE</div>
        <nav className={styles.navLinks}>
          <Link href="/">Home</Link>
          <Link href="/Dystopia">Dystopia</Link>
          <Link href="/Heterotopia">Heterotopia</Link>
          <Link href="/Utopia">Utopia</Link>
          <a onClick={() => setIsAboutOpen(true)}>About</a>
          <a onClick={() => setIsCreditOpen(true)}>Credit</a>
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

      <GlassmorphismOverlay isOpen={isCreditOpen} onClose={() => setIsCreditOpen(false)}>
        <div className={styles.scrollContent}>
          <h1>Credit</h1>
          <h2>CORDIVE</h2>
          <h3>Team Compassion+</h3>
          <div className={styles.cardContainer}>
            {['Yeeun Lee', 'Chanyeop Jang', 'Yunji Han', 'Minkyun Kim'].map((name, index) => (
              <div key={index} className={styles.card}>
                {/* <Image src={`/path/to/${name.split(' ')[0].toLowerCase()}.jpg`} alt={name} width={150} height={150} /> */}
                <h3>{name}</h3>
                <p>Role description goes here</p>
              </div>
            ))}
          </div>
          <h3>Thank You</h3>
          {Array(10).fill().map((_, i) => (
            <p key={i}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          ))}
        </div>
      </GlassmorphismOverlay>
    </>
  );
}
