import { useState } from 'react';
import styles from './SurveyOverlay.module.css';
import { soundManager } from '@/app/SoundManager';

export default function OpenEndedQuestions({ questions, onComplete }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState('');

    const handleNext = async () => {
        if (currentAnswer.trim()) {
            try {
                // PONG 사운드 재생
                await soundManager.playSound('PONG');
                
                const newAnswers = [...answers, currentAnswer];
                setAnswers(newAnswers);
                
                if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(prev => prev + 1);
                    setCurrentAnswer('');
                } else {
                    const formattedResponses = {
                        text: newAnswers
                    };
                    onComplete(formattedResponses);
                }
            } catch (error) {
                console.error('Error playing sound:', error);
            }
        }
    };

    return (
        <div className={styles.questionContainer}>
            <h1 className={styles.question}>{questions[currentQuestion]}</h1>
            <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                className={styles.textArea}
            />
            <button 
                onClick={handleNext}
                className={styles.nextButton}
            >
                {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
            </button>
        </div>
    );
}