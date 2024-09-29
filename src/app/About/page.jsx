'use client'

import Header from '../Header.jsx'
import styles from './page.module.css'
//
//
//
export default function About() {
    return (
        <div className={styles.about}>
            <Header />
            <h1 className={styles.title}>ABOUT</h1>
            <p>This page will be About page</p>
        </div>
    )
}