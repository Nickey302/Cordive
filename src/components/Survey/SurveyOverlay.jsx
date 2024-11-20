'use client';

import { useState } from 'react';
import { supabase } from '../../utils/supabase';
import OpenEndedQuestions from './OpenEndedQuestions';
import LoadingOverlay from './LoadingOverlay';
import styles from './SurveyOverlay.module.css';
import { soundManager } from '@/app/SoundManager';

export default function SurveyOverlay({ onComplete, onSurveyComplete, initialData, initialStep = 'material' }) {
    const [step, setStep] = useState(initialStep);
    const [answers, setAnswers] = useState({
        geometry: initialData.geometry,
        material: initialData.material,
        openEnded: []
    });
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const handleNext = async () => {
        try {
            // PONG 사운드 재생
            await soundManager.playSound('PONG');
            
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setStep('prompt');
            }
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };

    const handleSurveyComplete = async (results) => {
        try {
            if (!answers.geometry || !answers.material) {
                throw new Error('필수 정보가 누락되었습니다.');
            }

            setStep('loading');
            
            let position, keyword;
            
            try {
                const result = await fetch(process.env.NEXT_PUBLIC_NLP_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    mode: 'cors',
                    body: JSON.stringify(results)
                });
                
                const data = await result.json();
                position = data.data.position;
                keyword = data.data.keyword;
            } catch (error) {
                console.error('API 요청 실패:', error);
                // API 실패시 랜덤 값으로 대체
                position = {
                    x: Math.random() * 2 - 1,  // -1 ~ 1 사이 랜덤값
                    y: Math.random() * 2 - 1,
                    z: Math.random() * 2 - 1
                };
                keyword = '무제';  // 또는 다른 기본값
            }
            
            const objectData = {
                geometry: answers.geometry,
                material: answers.material,
                position: [position.x * 250, position.y * 250, position.z * 250],
                label: keyword,
                color: `rgb(
                    ${Math.min(255, Math.max(180, Math.floor(Math.abs(position.x * 255))))},
                    ${Math.min(255, Math.max(180, Math.floor(Math.abs(position.y * 255))))},
                    ${Math.min(255, Math.max(180, Math.floor(Math.abs(position.z * 255))))}
                )`,
                responses: results.text,
                username: initialData?.username || 'Anonymous',
                created_at: new Date().toISOString()
            };

            const { data: savedData, error } = await supabase
                .from('custom_objects')
                .insert([objectData])
                .select()
                .single();

            if (error) throw error;

            onComplete(savedData);
            
            setTimeout(() => {
                onSurveyComplete();
            }, 2000);

        } catch (error) {
            console.error('Error:', error);
            onSurveyComplete();
        }
    };

    const renderContent = () => {
        if (step === 'loading') {
            return <LoadingOverlay />;
        }
        
        if (step === 'questions') {
            return (
                <OpenEndedQuestions
                    questions={[
                        "살아가면서 소용돌이에 빠진 것만 같다고 느꼈던 때가 있다면 그 이야기를 자유롭게 해주세요",
                        "그때의 소용돌이를 벗어나고자 당신이 쳤던 발버둥이 있다면 무엇인가요",
                        "그때의 당신에게 또는 그때의 당신과 비슷한 상황을 겪는 사람에게 해주고 싶은 말이 있다면 무엇인가요"
                    ]}
                    onComplete={handleSurveyComplete}
                    onNext={handleNext}  // Next 버튼 클릭 핸들러 추가
                />
            );
        }
    };

    return (
        <div className={styles.overlay}>
            {renderContent()}
        </div>
    );
}