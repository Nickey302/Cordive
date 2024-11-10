'use client'

const ObjectsOverlay = ({ activeObject, setActiveObject }) => {
    const objects = [
        'Love',
        'Aversion',
        'Adjust',
        'Resist',
        'Isolation',
        'Liberation',
        'Landmark'
    ]

    return (
        <div style={{
            position: 'fixed',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        }}>
            {objects.map((obj) => (
                <button
                    key={obj}
                    onClick={() => setActiveObject(obj)}
                    style={{
                        padding: '10px 20px',
                        background: activeObject === obj ? '#dcb8d3' : 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        borderRadius: '5px',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '14px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = activeObject === obj ? '#dcb8d3' : 'rgba(255, 255, 255, 0.2)'
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = activeObject === obj ? '#dcb8d3' : 'rgba(255, 255, 255, 0.1)'
                    }}
                >
                    {obj}
                </button>
            ))}
        </div>
    )
}

export default ObjectsOverlay 