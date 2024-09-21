import { useState } from 'react';
import styles from '../styles/Header.module.css';
import Link from 'next/link';

const Header = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header
      className={`${styles.header} ${isHovered ? styles.expanded : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.logo}>CORDIVE</div>
      <nav className={styles.navLinks}>
        <Link href="/">Dystopia</Link>
        <Link href="/Heterotopia">Heterotopia</Link>
        <Link href="/Utopia">Utopia</Link>
        <Link href="/About">About</Link>
        <Link href="/Credit">Credit</Link>
      </nav>
    </header>
  );
};

export default Header;
