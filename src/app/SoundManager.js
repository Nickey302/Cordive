'use client'

import * as Tone from 'tone';

class SoundManager {
    constructor() {
        if (typeof window !== 'undefined') {
            this.players = new Map();
            this.mainVolume = new Tone.Volume(0).toDestination();
            this.currentScene = null;
        }
    }

    async init() {
        if (typeof window !== 'undefined') {
            try {
                // 사용자 상호작용 없이도 오디오를 재생할 수 있도록 시도
                await Tone.start();
                await Tone.loaded();
                
                // 자동 재생 정책을 우회하기 위한 추가 설정
                document.addEventListener('click', async () => {
                    if (Tone.context.state !== 'running') {
                        await Tone.context.resume();
                    }
                });

                // 페이지 로드 시 자동으로 컨텍스트 시작 시도
                if (Tone.context.state !== 'running') {
                    await Tone.context.resume();
                }
            } catch (error) {
                console.error('오디오 초기화 에러:', error);
            }
        }
    }

    async loadSound(name, url, options = {}) {
        return new Promise((resolve, reject) => {
            const player = new Tone.Player({
                url,
                volume: options.volume || 0,
                loop: options.loop || false,
                onload: () => {
                    console.log(`Loaded: ${name}`);
                    this.players.set(name, {
                        player,
                        scene: options.scene,
                        type: options.type || 'sfx'
                    });
                    resolve(player);
                },
                onerror: (error) => {
                    console.error(`Error loading sound ${name}:`, error);
                    reject(error);
                }
            }).connect(this.mainVolume);
        });
    }

    setScene(sceneName) {
        if (this.currentScene) {
            this.players.forEach((data, name) => {
                if (data.scene === this.currentScene) {
                    this.stopSound(name);
                }
            });
        }
        this.currentScene = sceneName;
    }

    async playSound(name, options = {}) {
        const sound = this.players.get(name);
        if (!sound) {
            console.warn(`Sound ${name} not found`);
            return;
        }

        try {
            // 사운드 재생 전에 컨텍스트 상태 확인 및 재시작
            if (Tone.context.state !== 'running') {
                await Tone.context.resume();
            }

            const { volume = 0, loop = false, fadeIn = 0 } = options;
            sound.player.loop = loop;
            
            if (!sound.player.playing) {
                sound.player.volume.value = fadeIn > 0 ? -100 : volume;
                await sound.player.start();
                if (fadeIn > 0) {
                    sound.player.volume.rampTo(volume, fadeIn);
                }
            } else {
                sound.player.volume.rampTo(volume, 0.1);
            }
        } catch (error) {
            console.error(`Error playing sound ${name}:`, error);
        }
    }

    updateVolume(name, volume, rampTime = 0.1) {
        const sound = this.players.get(name);
        if (sound && sound.player) {
            sound.player.volume.rampTo(volume, rampTime);
        }
    }

    stopSound(name, fadeOut = 0) {
        const sound = this.players.get(name);
        if (sound && sound.player) {
            try {
                if (fadeOut > 0) {
                    sound.player.volume.rampTo(-100, fadeOut);
                    setTimeout(() => {
                        if (sound.player.playing) {
                            sound.player.stop();
                        }
                    }, fadeOut * 1000);
                } else {
                    sound.player.stop();
                }
            } catch (error) {
                console.error(`Error stopping sound ${name}:`, error);
            }
        }
    }

    stopAllSounds(fadeOut = 0) {
        this.players.forEach((data, name) => {
            this.stopSound(name, fadeOut);
        });
    }

    dispose() {
        this.stopAllSounds();
        this.players.forEach((data) => {
            try {
                if (data.player) {
                    data.player.dispose();
                }
            } catch (error) {
                console.error('Error disposing sound:', error);
            }
        });
        this.players.clear();
        if (this.mainVolume) {
            this.mainVolume.dispose();
        }
    }
}

export const soundManager = typeof window !== 'undefined' ? new SoundManager() : null;