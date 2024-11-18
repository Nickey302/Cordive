'use client'

import React, { useMemo } from 'react';

const ObjectsOverlay = ({ activeObject, setActiveObject, customObjects }) => {
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

    return (
        <div style={{
            position: 'fixed',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            display: 'flex',
            gap: '20px'
        }}>
            {/* 커스텀 오브젝트 파일 리스트 (왼쪽) */}
            {otherCustomObjects?.length > 0 && (
                <div style={{
                    background: 'rgba(0, 0, 0, 0.7)',
                    padding: '15px',
                    borderRadius: '5px',
                    maxHeight: '70vh',
                    overflowY: 'auto'
                }}>
                    <div style={{
                        color: 'white',
                        fontFamily: "Neocode",
                        fontSize: '14px',
                        marginBottom: '10px',
                        opacity: 0.7
                    }}>
                        ARCHIVE
                    </div>
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
                                marginBottom: '5px'
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
                            <span style={{ 
                                fontSize: '18px', 
                                color: obj.color 
                            }}>📄</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ 
                                    fontSize: '12px',
                                    color: 'white' 
                                }}>{obj.label || '무제'}</div>
                                <div style={{ 
                                    fontSize: '10px',
                                    color: 'rgba(255, 255, 255, 0.5)' 
                                }}>{new Date(obj.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 메인 네비게이션 (오른쪽) */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '20px',
                background: 'rgba(0, 0, 0, 0.7)',
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

                {/* 구분선 */}
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
                            <span style={{ 
                                fontSize: '18px', 
                                color: myLatestObject.color 
                            }}>📄</span>
                            <div>
                                <div style={{ fontSize: '12px' }}>{myLatestObject.label || '무제'}</div>
                                <div style={{ 
                                    fontSize: '10px',
                                    opacity: 0.7 
                                }}>{myLatestObject.geometry}</div>
                            </div>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ObjectsOverlay; 