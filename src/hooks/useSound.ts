import { useCallback, useRef } from 'react';
import { getSettings } from '@/utils/storage';

const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

export function useSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioCtx();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback((freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) => {
    const settings = getSettings();
    if (!settings.soundEnabled) return;

    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignore audio errors
    }
  }, [getCtx]);

  const playClick = useCallback(() => {
    playTone(800, 0.08, 'sine', 0.15);
  }, [playTone]);

  const playSuccess = useCallback((accuracy: number) => {
    if (accuracy >= 99) {
      playTone(523, 0.15, 'sine', 0.3);
      setTimeout(() => playTone(659, 0.15, 'sine', 0.3), 120);
      setTimeout(() => playTone(784, 0.2, 'sine', 0.3), 240);
      setTimeout(() => playTone(1047, 0.4, 'sine', 0.25), 400);
    } else if (accuracy >= 80) {
      playTone(523, 0.15, 'sine', 0.25);
      setTimeout(() => playTone(659, 0.2, 'sine', 0.25), 150);
    } else if (accuracy >= 50) {
      playTone(440, 0.2, 'sine', 0.2);
    } else {
      playTone(300, 0.3, 'triangle', 0.15);
    }
  }, [playTone]);

  const playStreak = useCallback(() => {
    playTone(523, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(587, 0.1, 'sine', 0.2), 80);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.2), 160);
    setTimeout(() => playTone(784, 0.15, 'sine', 0.25), 240);
  }, [playTone]);

  const playGameOver = useCallback(() => {
    playTone(400, 0.2, 'sine', 0.2);
    setTimeout(() => playTone(350, 0.2, 'sine', 0.2), 200);
    setTimeout(() => playTone(300, 0.4, 'sine', 0.2), 400);
  }, [playTone]);

  const playTick = useCallback(() => {
    playTone(1000, 0.05, 'sine', 0.08);
  }, [playTone]);

  return { playClick, playSuccess, playStreak, playGameOver, playTick };
}
