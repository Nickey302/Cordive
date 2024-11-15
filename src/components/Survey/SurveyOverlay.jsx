'use client';

import { useState } from 'react';
import { supabase } from '../../utils/supabase';
import MultipleChoice from './MultipleChoice';
import OpenEndedQuestions from './OpenEndedQuestions';
import styles from './SurveyOverlay.module.css';

export default function SurveyOverlay({ onComplete, onSurveyComplete }) {
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState({
        geometry: null,
        material: null,
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
            if (!answers.geometry || !answers.material) {
                throw new Error('필수 정보가 누락되었습니다.');
            }

            const result = await fetch('http://localhost:8080/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(responses)
            });
            
            const data = await result.json();
            const { position, keyword } = data.data;
            
            const objectData = {
                geometry: answers.geometry,
                material: answers.material,
                position: [position.x * 300, position.y * 300, position.z * 300],
                label: keyword,
                color: `rgb(${position.x * 255}, ${position.y * 255}, ${position.z * 255})`,
                responses: responses.text,
                created_at: new Date().toISOString()
            };

            const { data: savedData, error } = await supabase
                .from('custom_objects')
                .insert([objectData])
                .select()
                .single();

            if (error) throw error;

            onComplete(objectData);
            onSurveyComplete();

        } catch (error) {
            console.error('Error:', error);
            onSurveyComplete();
        }
    };

    return (
        <div className={styles.overlay}>
            {step === 1 && (
                <MultipleChoice
                    type="geometry"
                    question="당신의 이야기를 담을 형태를 선택해주세요"
                    options={[
                        "Cube", "Sphere", "Cone", "Cylinder", "Torus", "Tetrahedron"
                    ]}
                    onSelect={(answer) => handleMultipleChoiceComplete('geometry', answer)}
                />
            )}
            {step === 2 && (
                <MultipleChoice
                    type="material"
                    question="당신의 이야기에 어울리는 재질을 선택해주세요"
                    options={[
                        "Holographic",
                        "Crystal",
                        "Neon",
                        "Mirror",
                        "Glitch",
                        "Plasma"
                    ]}
                    onSelect={(answer) => handleMultipleChoiceComplete('material', answer)}
                />
            )}
            {step === 3 && (
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