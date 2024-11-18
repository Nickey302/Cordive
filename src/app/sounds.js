export const SCENE_SOUNDS = {
    MAIN: {
        BGM: {
            url: '/assets/audio/main/main.wav',
            options: {
                volume: -10,
                loop: true,
                type: 'bgm',
                scene: 'MAIN'
            }
        },
        HOLD: {
            url: '/assets/audio/main/hold.wav',
            options: {
                volume: -12,
                type: 'sfx',
                scene: 'MAIN'
            }
        }
    },
    DYSTOPIA: {
        BGM: {
            url: '/assets/audio/dystopia/Underwater.wav',
            options: {
                volume: -10,
                loop: true,
                type: 'bgm',
                scene: 'DYSTOPIA'
            }
        }
    },
    HETEROTOPIA: {
        BGM: {
            url: '/assets/audio/main/Heterotopia.wav',  // 경로 수정
            options: {
                volume: -15,
                loop: true,
                type: 'bgm',
                scene: 'HETEROTOPIA'
            }
        },
        CLICK: {
            url: '/assets/audio/main/Hetero_click.wav',  // 경로 수정
            options: {
                volume: -10,
                type: 'sfx',
                scene: 'HETEROTOPIA'
            }
        },
        PONG: {
            url: '/assets/audio/main/pong.wav',  // 경로 수정
            options: {
                volume: -10,
                type: 'sfx',
                scene: 'HETEROTOPIA'
            }
        }
    },
    UTOPIA: {
        BGM: {
            url: '/assets/audio/main/utopia.wav',  // 파일경로 수정
            options: {
                volume: -15,
                loop: true,
                type: 'bgm',
                scene: 'UTOPIA'
            }
        },
        LANDMARK: {
            url: '/assets/audio/main/landmark.wav',  // 파일경로 수정
            options: {
                volume: -10,
                loop: true,
                type: 'ambient',
                scene: 'UTOPIA'
            }
        },
        LOVE: { 
            url: '/assets/audio/main/love.wav',  // 파일경로 수정
            options: { 
                volume: -10, 
                loop: true,
                type: 'ambient',
                scene: 'UTOPIA' 
            }
        },
        AVERSION: { 
            url: '/assets/audio/main/aversion.wav',  // 파일경로 수정
            options: { 
                volume: -10, 
                loop: true,
                type: 'ambient',
                scene: 'UTOPIA' 
            }
        },
        ADJUST: { 
            url: '/assets/audio/main/adjust.wav',  // 파일경로 수정
            options: { 
                volume: -10, 
                loop: true,
                type: 'ambient',
                scene: 'UTOPIA' 
            }
        },
        RESIST: { 
            url: '/assets/audio/main/resist.wav',  // 파일경로 수정
            options: { 
                volume: -10, 
                loop: false,
                type: 'ambient',
                scene: 'UTOPIA' 
            }
        },
        ISOLATION: { 
            url: '/assets/audio/main/isolation.wav',  // 파일경로 수정
            options: { 
                volume: -10, 
                loop: true,
                type: 'ambient',
                scene: 'UTOPIA' 
            }
        },
        LIBERATION: { 
            url: '/assets/audio/main/liberation.wav',  // 파일경로 수정
            options: { 
                volume: -10, 
                loop: true,
                type: 'ambient',
                scene: 'UTOPIA' 
            }
        }
    }
};