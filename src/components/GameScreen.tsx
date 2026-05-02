import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, Timer, Trophy, Flame, Target, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ColorPicker } from './ColorPicker';
import { GameResultOverlay } from './GameResultOverlay';
import { GameOverScreen } from './GameOverScreen';
import { PauseScreen } from './PauseScreen';
import { useGameState } from '@/hooks/useGameState';
import { useSound } from '@/hooks/useSound';
import { rgbToHex, getAccuracyBadge } from '@/utils/color';
import type { RGB, GameMode, Difficulty } from '@/types';

interface GameScreenProps {
  mode: GameMode;
  difficulty: Difficulty;
  username: string;
  players?: string[];
  onQuit: () => void;
  onPlayAgain: () => void;
}

export function GameScreen({ mode, difficulty, username, players = [], onQuit, onPlayAgain }: GameScreenProps) {
  const { playClick, playSuccess, playStreak, playTick } = useSound();
  const [selectedColor, setSelectedColor] = useState<RGB | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const prevTimeRef = useRef<number | undefined>(undefined);

  const {
    session,
    targetColor,
    showResult,
    gameOver,
    lastResult,
    isPaused,
    currentPlayer,
    playerStats,
    handleGuess,
    nextRound,
    togglePause,
  } = useGameState({
    mode,
    difficulty,
    username,
    maxRounds: mode === 'timed' ? 999 : 10,
    totalTime: mode === 'timed' ? 30 : undefined,
    players: mode === 'multiplayer' ? players : undefined,
  });

  // Timer tick sound
  useEffect(() => {
    if (mode === 'timed' && session.timeLeft !== undefined && session.timeLeft <= 5 && session.timeLeft > 0 && !showResult && !isPaused) {
      if (prevTimeRef.current !== session.timeLeft) {
        playTick();
        prevTimeRef.current = session.timeLeft;
      }
    }
  }, [session.timeLeft, mode, showResult, isPaused, playTick]);

  const handleColorSelect = useCallback((color: RGB) => {
    if (hasSubmitted || showResult || isPaused) return;
    setSelectedColor(color);
  }, [hasSubmitted, showResult, isPaused]);

  const handleSubmit = useCallback(() => {
    if (!selectedColor || hasSubmitted || showResult) return;
    setHasSubmitted(true);
    handleGuess(selectedColor);
    playClick();
  }, [selectedColor, hasSubmitted, showResult, handleGuess, playClick]);

  // Play sounds when result shows
  useEffect(() => {
    if (showResult && lastResult) {
      playSuccess(lastResult.accuracy);
      if (lastResult.streak > 1) {
        setTimeout(() => playStreak(), 300);
      }
      if (lastResult.accuracy >= 99) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
        });
      } else if (lastResult.accuracy >= 90) {
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#4ECDC4', '#45B7D1', '#96CEB4'],
        });
      }
    }
  }, [showResult, lastResult, playSuccess, playStreak]);

  const handleNext = useCallback(() => {
    setHasSubmitted(false);
    setSelectedColor(null);
    nextRound();
    playClick();
  }, [nextRound, playClick]);

  const targetHex = rgbToHex(targetColor);
  const badge = selectedColor ? getAccuracyBadge(calculateQuickSimilarity(targetColor, selectedColor)) : null;

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-5xl mx-auto mb-6"
      >
        <div className="glass-card p-4 md:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { togglePause(); playClick(); }}
              className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] transition-colors"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-lg font-bold gradient-text">ColorGuesser Pro</h1>
              <p className="text-xs text-white/50 capitalize">{mode} • {difficulty}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {mode === 'multiplayer' && (
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-violet-400" />
                <span className="text-white/70">{currentPlayer}</span>
              </div>
            )}

            {mode !== 'timed' && (
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-white/70">Round {session.round}/{session.maxRounds}</span>
              </div>
            )}

            {mode === 'timed' && session.timeLeft !== undefined && (
              <div className={`flex items-center gap-2 text-sm ${session.timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white/70'}`}>
                <Timer className="w-4 h-4" />
                <span className="font-mono font-bold">{session.timeLeft}s</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white">{session.score.toLocaleString()}</span>
            </div>

            {session.streak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 text-sm"
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="font-bold text-orange-400">{session.streak}</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Streak bar */}
        {session.streak > 1 && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="mt-2 h-1 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full origin-left"
            style={{ width: `${Math.min(session.streak * 10, 100)}%` }}
          />
        )}
      </motion.header>

      {/* Main Game Area */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Target Color */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="glass-card p-6 text-center">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Target Color</h2>
            <motion.div
              key={targetHex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-full aspect-square max-w-[240px] mx-auto rounded-2xl border-4 border-white/10 shadow-2xl"
              style={{ backgroundColor: targetHex }}
            />
            <div className="mt-4 space-y-1">
              <p className="text-2xl font-mono font-bold text-white">{targetHex.toUpperCase()}</p>
              <p className="text-sm text-white/40 font-mono">RGB({targetColor.r}, {targetColor.g}, {targetColor.b})</p>
            </div>
          </div>

          {/* Player info card */}
          {playerStats && (
            <div className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold">
                    {currentPlayer.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{currentPlayer}</p>
                    <p className="text-xs text-white/50">Level {playerStats.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-amber-400">{playerStats.totalScore.toLocaleString()}</p>
                  <p className="text-xs text-white/40">Total Score</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Color Picker */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="lg:col-span-3"
        >
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6 text-center">
              Match the Color
            </h2>

            <ColorPicker
              onColorSelect={handleColorSelect}
              disabled={hasSubmitted || showResult || isPaused}
              size={260}
              showValueSlider={true}
            />

            {/* Selected color preview */}
            <AnimatePresence>
              {selectedColor && !hasSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 flex items-center justify-center gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-xl border-2 border-white/20 shadow-lg"
                      style={{ backgroundColor: rgbToHex(selectedColor) }}
                    />
                    <div className="text-sm">
                      <p className="font-mono font-bold text-white">{rgbToHex(selectedColor).toUpperCase()}</p>
                      {badge && (
                        <p className={`text-xs font-semibold ${badge.color}`}>
                          {badge.emoji} {badge.text}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="btn-primary px-8 py-3 text-lg"
                  >
                    Submit Guess
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {showResult && lastResult && !gameOver && (
          <GameResultOverlay
            result={lastResult}
            onNext={handleNext}
            isMultiplayer={mode === 'multiplayer'}
            nextPlayer={mode === 'multiplayer' ? session.players[(session.currentPlayerIndex + 1) % session.players.length] : undefined}
          />
        )}

        {gameOver && (
          <GameOverScreen
            session={session}
            onPlayAgain={onPlayAgain}
            onQuit={onQuit}
          />
        )}

        {isPaused && !gameOver && (
          <PauseScreen
            onResume={() => { togglePause(); playClick(); }}
            onQuit={onQuit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function calculateQuickSimilarity(c1: RGB, c2: RGB): number {
  const dr = c2.r - c1.r;
  const dg = c2.g - c1.g;
  const db = c2.b - c1.b;
  const distance = Math.sqrt(0.3 * dr * dr + 0.59 * dg * dg + 0.11 * db * db);
  const maxDistance = Math.sqrt(0.3 * 255 * 255 + 0.59 * 255 * 255 + 0.11 * 255 * 255);
  return Math.max(0, Math.min(100, 100 - (distance / maxDistance) * 100));
}
