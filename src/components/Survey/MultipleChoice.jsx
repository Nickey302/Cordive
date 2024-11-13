import React from 'react';
import styles from './SurveyOverlay.module.css';

export default function MultipleChoice({ question, options, onSelect }) {
    return (
        <div className={styles.questionContainer}>
            <h2>{question}</h2>
            <div className={styles.optionsGrid}>
                {options.map((option, index) => (
                    <button
                        key={index}
                        className={styles.optionButton}
                        onClick={() => onSelect(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
} 