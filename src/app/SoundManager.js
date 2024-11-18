'use client'

import * as Tone from 'tone';
//
//
//
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
                // Tone.js 컨텍스트 초기화만 수행
                await Tone.loaded();
                
                // 자동 재생 정책을 우회하기 위한 추가 설정
                document.addEventListener('click', async () => {
                    if (Tone.context.state !== 'running') {
                        await Tone.context.resume();
                    }
                });
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
        console.log(`Changing scene from ${this.currentScene} to ${sceneName}`);
        
        // 이전 씬의 모든 사운드를 강제로 중지
        this.players.forEach((data, name) => {
            try {
                // 재생 중인 모든 사운드를 즉시 중지
                if (data.player) {
                    data.player.stop();
                    data.player.volume.value = -Infinity;
                    console.log(`Stopped sound: ${name} from scene: ${data.scene}`);
                }
            } catch (error) {
                console.error(`Error stopping sound ${name}:`, error);
            }
        });

        // 모든 플레이어 초기화
        this.players.clear();
        
        this.currentScene = sceneName;
        console.log(`Scene changed to: ${sceneName}`);
    }

    async playSound(name, options = {}) {
        const sound = this.players.get(name);
        if (!sound) {
            console.warn(`Sound ${name} not found`);
            return;
        }

        try {
            if (Tone.context.state !== 'running') {
                await Tone.context.resume();
            }

            const { volume = 0, loop = false, fadeIn = 0 } = options;
            
            // 기존 재생 중지
            if (sound.player.playing) {
                sound.player.stop();
            }

            // 볼륨 설정 (dB 단위)
            const volumeInDB = Math.max(-100, Math.min(0, volume)); // 볼륨 범위 제한
            sound.player.volume.value = volumeInDB;
            
            // 루프 설정
            sound.player.loop = loop;

            // 새로운 재생 시작
            await sound.player.start();

            // 디버깅
            console.log(`Playing ${name} with volume:`, volumeInDB);
            console.log(`Actual volume:`, sound.player.volume.value);

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

    stopAllSounds() {
        console.log('Stopping all sounds...');
        this.players.forEach((data, name) => {
            try {
                if (data.player) {
                    data.player.stop();
                    data.player.volume.value = -Infinity;
                    console.log(`Stopped sound: ${name}`);
                }
            } catch (error) {
                console.error(`Error stopping sound ${name}:`, error);
            }
        });
        // 모든 플레이어 초기화
        this.players.clear();
    }

    dispose() {
        console.log('Disposing sound manager...');
        this.stopAllSounds();
        if (this.mainVolume) {
            this.mainVolume.dispose();
        }
    }
}

export const soundManager = typeof window !== 'undefined' ? new SoundManager() : null;