'use client';
import * as Tone from 'tone';

class SoundManager {
    constructor() {
        this.players = new Map();
        this.mainVolume = new Tone.Volume(0).toDestination();
        this.currentScene = null;
    }

    async init() {
        await Tone.start();
        await Tone.loaded();
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

export const soundManager = new SoundManager();