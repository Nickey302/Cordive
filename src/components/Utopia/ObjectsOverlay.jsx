'use client'

import React, { useMemo, useState } from 'react';

const MODEL_IMAGES = {
    'Love': '/assets/images/Love.png',     
    'Liberation': '/assets/images/Liberation.png',
    'Adjust': '/assets/images/Adjust.png',
    'Isolation': '/assets/images/Isolation.png',
    'Resist': '/assets/images/Resist.png',
    'Aversion': '/assets/images/Aversion.png'
};

const ObjectsOverlay = ({ activeObject, setActiveObject, customObjects }) => {
    const [isArchiveOpen, setIsArchiveOpen] = useState(true);

    const defaultObjects = [
        'Love',
        'Aversion',
        'Adjust',
        'Resist',
        'Isolation',
        'Liberation',
        'Landmark'
    ];

    // 가장 최근에 생성된 커스텀 오브젝트 찾기
    const myLatestObject = useMemo(() => {
        return customObjects?.slice().sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
        )[0];
    }, [customObjects]);

    // 나머지 커스텀 오브젝트들
    const otherCustomObjects = useMemo(() => {
        if (!myLatestObject) return customObjects;
        return customObjects?.filter(obj => obj.id !== myLatestObject.id);
    }, [customObjects, myLatestObject]);

    const buttonStyle = (isActive) => ({
        padding: '10px 20px',
        background: isActive ? '#b8cfd8' : 'rgba(255, 255, 255, 0.0)',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        borderRadius: '1px',
        transition: 'all 0.3s ease',
        fontFamily: "Neocode",
        fontSize: '14px',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        width: '100%',
        textAlign: 'left'
    });

    // 두 점 사이의 거리를 계산하는 함수
    const calculateDistance = (pos1, pos2) => {
        return Math.sqrt(
            Math.pow(pos1[0] - pos2[0], 2) + 
            Math.pow(pos1[1] - pos2[1], 2) + 
            Math.pow(pos1[2] - pos2[2], 2)
        );
    };

    // 가장 가까운 기본 모델을 찾는 함수
    const findNearestModel = (position) => {
        const modelPositions = {
            'Liberation': [150, 0, 0],      // 동
            'Isolation': [-125, 0, 0],      // 서
            'Adjust': [0, 0, 150],          // 남
            'Resist': [0, 0, -125],         // 북
            'Love': [0, 120, 0],            // 위
            'Aversion': [0, -120, 0]        // 아래
        };

        let nearestModel = 'Love';
        let minDistance = Infinity;

        Object.entries(modelPositions).forEach(([model, pos]) => {
            const distance = calculateDistance(position, pos);
            if (distance < minDistance) {
                minDistance = distance;
                nearestModel = model;
            }
        });

        return nearestModel;
    };

    return (
        <>
            {/* Archive 섹션 (왼쪽) */}
            {otherCustomObjects?.length > 0 && (
                <div style={{
                    position: 'fixed',
                    left: '20px',
                    top: '15%',
                    background: 'rgba(0, 0, 0, 0.0)',
                    padding: '15px',
                    borderRadius: '5px',
                    width: '250px',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div 
                        onClick={() => setIsArchiveOpen(!isArchiveOpen)}
                        style={{
                            color: 'white',
                            fontFamily: "Neocode",
                            fontSize: '14px',
                            marginBottom: '10px',
                            opacity: 0.7,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            userSelect: 'none'
                        }}
                    >
                        <span>ARCHIVE ({otherCustomObjects?.length || 0})</span>
                        <span style={{
                            transform: isArchiveOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease',
                            marginRight: 'auto',
                            marginLeft: '40px'
                        }}>
                            ▼
                        </span>
                    </div>
                    <div style={{
                        height: isArchiveOpen ? '60vh' : '0',
                        overflowY: 'auto',
                        transition: 'all 0.3s ease',
                        opacity: isArchiveOpen ? 1 : 0,
                        visibility: isArchiveOpen ? 'visible' : 'hidden',
                        paddingRight: '10px',
                        marginRight: '-10px',
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1)',
                        '&::WebkitScrollbar': {
                            width: '5px',
                        },
                        '&::WebkitScrollbarTrack': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '5px',
                        },
                        '&::WebkitScrollbarThumb': {
                            background: 'rgba(255, 255, 255, 0.3)',
                            borderRadius: '5px',
                        }
                    }}>
                        {otherCustomObjects.map((obj) => (
                            <div
                                key={obj.id}
                                onClick={() => setActiveObject({ type: 'custom', id: obj.id })}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px',
                                    cursor: 'pointer',
                                    background: activeObject?.id === obj.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                    borderRadius: '3px',
                                    marginBottom: '5px',
                                    transition: 'background 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    if (activeObject?.id !== obj.id) {
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                <img 
                                    src={MODEL_IMAGES[findNearestModel(obj.position)]}
                                    alt="model icon"
                                    style={{ 
                                        width: '24px',
                                        height: '24px',
                                        objectFit: 'cover',
                                        margin: '0 auto',
                                        padding: '0px',
                                        transform: 'scale(1.5)'
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ 
                                        fontSize: '12px',
                                        color: 'white' 
                                    }}>{obj.label || '무제'}</div>
                                    <div style={{ 
                                        fontSize: '10px',
                                        color: 'rgba(255, 255, 255, 0.5)' 
                                    }}>{obj.username || '익명'}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 기존 UI (오른쪽) */}
            <div style={{
                position: 'fixed',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '20px',
                background: 'rgba(0, 0, 0, 0.0)',
                borderRadius: '5px',
            }}>
                {/* 기본 오브젝트 버튼들 */}
                {defaultObjects.map((obj) => (
                    <button
                        key={obj}
                        onClick={() => setActiveObject({ type: 'default', name: obj })}
                        style={buttonStyle(activeObject?.type === 'default' && activeObject?.name === obj)}
                        onMouseEnter={(e) => {
                            e.target.style.background = 
                                (activeObject?.type === 'default' && activeObject?.name === obj) 
                                ? '#b8cfd8' 
                                : 'rgba(255, 255, 255, 0.1)'
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 
                                (activeObject?.type === 'default' && activeObject?.name === obj) 
                                ? '#b8cfd8' 
                                : 'rgba(255, 255, 255, 0.0)'
                        }}
                    >
                        {obj}
                    </button>
                ))}

                {/* 구분선과 My Model */}
                {myLatestObject && (
                    <>
                        <div style={{
                            width: '100%',
                            height: '1px',
                            background: 'rgba(255, 255, 255, 0.3)',
                            margin: '10px 0'
                        }} />
                        <div style={{
                            color: 'white',
                            fontFamily: "Neocode",
                            fontSize: '14px',
                            marginBottom: '5px',
                            opacity: 0.7
                        }}>
                            MY MODEL
                        </div>
                        <button
                            onClick={() => setActiveObject({ type: 'custom', id: myLatestObject.id })}
                            style={{
                                ...buttonStyle(activeObject?.type === 'custom' && activeObject?.id === myLatestObject.id),
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                background: activeObject?.id === myLatestObject.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                            }}
                        >
                            <img 
                                src={MODEL_IMAGES[findNearestModel(myLatestObject.position)]}
                                alt="model icon"
                                style={{ 
                                    width: '24px',
                                    height: '24px',
                                    objectFit: 'cover',
                                    margin: '0 auto',
                                    padding: '0px',
                                    transform: 'scale(1.5)'
                                }}
                            />
                            <div>
                                <div style={{ fontSize: '12px' }}>{myLatestObject.label || '무제'}</div>
                                <div style={{ 
                                    fontSize: '10px',
                                    opacity: 0.7 
                                }}>{myLatestObject.username || '익명'}</div>
                            </div>
                        </button>
                    </>
                )}
            </div>
        </>
    );
};

export default ObjectsOverlay; 