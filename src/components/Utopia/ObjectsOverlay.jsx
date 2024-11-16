'use client'

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
        position: 'relative',
        overflow: 'hidden'
    });

    return (
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
            borderRadius: '10px'
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
            {customObjects?.length > 0 && (
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
                        fontSize: '16px',
                        marginBottom: '10px',
                        textAlign: 'center'
                    }}>
                        Custom Objects
                    </div>
                </>
            )}

            {/* 커스텀 오브젝트 버튼들 */}
            {customObjects?.map((obj) => (
                <button
                    key={obj.id}
                    onClick={() => setActiveObject({ type: 'custom', id: obj.id })}
                    style={{
                        ...buttonStyle(activeObject?.type === 'custom' && activeObject?.id === obj.id),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 
                            (activeObject?.type === 'custom' && activeObject?.id === obj.id) 
                            ? '#b8cfd8' 
                            : 'rgba(255, 255, 255, 0.1)';
                        e.target.setAttribute('title', `위치: ${obj.position.join(', ')}`);
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 
                            (activeObject?.type === 'custom' && activeObject?.id === obj.id) 
                            ? '#b8cfd8' 
                            : 'rgba(255, 255, 255, 0.0)'
                    }}
                >
                    <span
                        style={{
                            fontSize: '12px',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                        }}
                    >{obj.label || '무제'}</span>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                    }}>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: obj.color,
                        }} />
                        <span style={{
                            fontSize: '12px',
                            opacity: 0.7
                        }}>
                            {obj.geometry}
                        </span>
                    </div>
                </button>
            ))}
        </div>
    )
}

export default ObjectsOverlay 