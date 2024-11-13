'use client';

import { useState } from 'react';
import MultipleChoice from './MultipleChoice';
import OpenEndedQuestions from './OpenEndedQuestions';
import styles from './SurveyOverlay.module.css';

export default function SurveyOverlay({ onComplete }) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({
        geometry: null,
        matcap: null,
        openEnded: []
    });

    const handleMultipleChoiceComplete = (type, answer) => {
        setAnswers(prev => ({
            ...prev,
            [type]: answer
        }));
        setStep(prev => prev + 1);
    };

    const handleOpenEndedComplete = async (responses) => {
        try {
            console.log('서버로 전송되는 데이터:', responses);
            
            const result = await fetch('http://localhost:8080/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(responses)
            });
            
            const data = await result.json();
            console.log('서버로부터 받은 응답:', data);
            
            const { position, keyword } = data.data;
            console.log('추출된 위치 데이터:', position);
            console.log('추출된 키워드:', keyword);
            
            const finalData = {
                ...answers,
                position: [position.x * 300, position.y * 300, position.z * 300],
                label: keyword,
                color: `rgb(${position.x * 255}, ${position.y * 255}, ${position.z * 255})`
            };
            console.log('최종 오브젝트 데이터:', finalData);
            
            onComplete(finalData);
        } catch (error) {
            console.error('에러 상세 정보:', error);
            // 에러 발생 시 임의의 기본값 설정
            const fallbackVector = [Math.random(), Math.random(), Math.random()];
            
            const fallbackData = {
                ...answers,
                position: fallbackVector.map(v => v * 50),
                label: "알 수 없음",
                color: `rgb(${fallbackVector[0] * 255}, ${fallbackVector[1] * 255}, ${fallbackVector[2] * 255})`
            };
            console.log('에러로 인한 폴백 데이터:', fallbackData);
            
            onComplete(fallbackData);
        }
    };

    return (
        <div className={styles.overlay}>
            {step === 0 && (
                <MultipleChoice
                    type="geometry"
                    question="Select Shape"
                    options={[
                        "Cube", "Sphere", "Cone", "Cylinder", "Torus", "Tetrahedron"
                    ]}
                    onSelect={(answer) => handleMultipleChoiceComplete('geometry', answer)}
                />
            )}
            {step === 1 && (
                <MultipleChoice
                    type="matcap"
                    question="Select Texture"
                    options={[
                        "Metal", "Glass", "Rubber", "Wood", "Canvas", "Plastic"
                    ]}
                    onSelect={(answer) => handleMultipleChoiceComplete('matcap', answer)}
                />
            )}
            {step === 2 && (
                <OpenEndedQuestions
                    questions={[
                        "살아가면서 소용돌이에 빠진 것만 같다고 느꼈던 때가 있다면 그 이야기를 자유롭게 해주세요",
                        "그때의 소용돌이를 벗어나고자 당신이 쳤던 발버둥이 있다면 무엇인가요",
                        "그때의 당신에게 또는 그때의 당신과 비슷한 상황을 겪는 사람에게 해주고 싶은 말이 있다면 무엇인가요"
                    ]}
                    onComplete={handleOpenEndedComplete}
                />
            )}
        </div>
    );
} 