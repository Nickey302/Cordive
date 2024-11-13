import { useState } from 'react';
import styles from './SurveyOverlay.module.css';

export default function OpenEndedQuestions({ questions, onComplete }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState('');

    const handleNext = () => {
        if (currentAnswer.trim()) {
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
        }
    };

    return (
        <div className={styles.questionContainer}>
            <h2>{questions[currentQuestion]}</h2>
            <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                className={styles.textArea}
                placeholder="여기에 답변을 입력하세요..."
            />
            <button 
                onClick={handleNext}
                className={styles.nextButton}
            >
                {currentQuestion === questions.length - 1 ? '완료' : '다음'}
            </button>
        </div>
    );
} 