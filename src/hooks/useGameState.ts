import { useState, useCallback, useRef, useEffect } from 'react';
import type { RGB, GameMode, Difficulty, GameResult, GameSession } from '@/types';
import { generateRandomColor, calculateColorSimilarity } from '@/utils/color';
import { updatePlayerStats, getPlayerStats } from '@/utils/storage';

interface UseGameStateProps {
  mode: GameMode;
  difficulty: Difficulty;
  username: string;
  maxRounds?: number;
  totalTime?: number;
  players?: string[];
}

export function useGameState({
  mode,
  difficulty,
  username,
  maxRounds = 10,
  totalTime = 60,
  players = [],
}: UseGameStateProps) {
  const [session, setSession] = useState<GameSession>({
    mode,
    difficulty,
    score: 0,
    streak: 0,
    round: 1,
    maxRounds,
    timeLeft: mode === 'timed' ? totalTime : undefined,
    totalTime: mode === 'timed' ? totalTime : undefined,
    results: [],
    players: mode === 'multiplayer' ? players : [username],
    currentPlayerIndex: 0,
  });

  const [targetColor, setTargetColor] = useState<RGB>(() => generateRandomColor(difficulty));
  const [guessedColor, setGuessedColor] = useState<RGB | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const roundStartTime = useRef<number>(Date.now());

  // Timer for timed mode
  useEffect(() => {
    if (mode === 'timed' && !showResult && !gameOver && !isPaused) {
      timerRef.current = setInterval(() => {
        setSession(prev => {
          const newTime = (prev.timeLeft ?? 0) - 1;
          if (newTime <= 0) {
            clearInterval(timerRef.current!);
            handleTimeout();
            return { ...prev, timeLeft: 0 };
          }
          return { ...prev, timeLeft: newTime };
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, showResult, gameOver, isPaused]);

  const handleTimeout = useCallback(() => {
    const result: GameResult = {
      accuracy: 0,
      pointsEarned: 0,
      streak: 0,
      targetColor,
      guessedColor: { r: 0, g: 0, b: 0 },
      timeTaken: (session.totalTime ?? 60),
    };
    setLastResult(result);
    setShowResult(true);
    setSession(prev => ({
      ...prev,
      results: [...prev.results, result],
      streak: 0,
    }));
  }, [targetColor, session.totalTime]);

  const handleGuess = useCallback((color: RGB) => {
    if (showResult || gameOver) return;

    const timeTaken = (Date.now() - roundStartTime.current) / 1000;
    const accuracy = calculateColorSimilarity(targetColor, color);

    let pointsEarned = Math.round(accuracy);

    // Streak bonus
    let newStreak = session.streak;
    if (accuracy >= 80) {
      newStreak = session.streak + 1;
      if (newStreak > 1) {
        const bonus = Math.min((newStreak - 1) * 15, 100);
        pointsEarned = Math.round(pointsEarned * (1 + bonus / 100));
      }
    } else {
      newStreak = 0;
    }

    // Time bonus for timed mode
    if (mode === 'timed' && session.timeLeft) {
      const timeBonus = Math.round((session.timeLeft / (session.totalTime ?? 60)) * 20);
      pointsEarned += timeBonus;
    }

    // Precision mode: fewer points for less accuracy, but perfect gets huge bonus
    if (mode === 'precision') {
      if (accuracy >= 99) {
        pointsEarned = 500;
      } else if (accuracy >= 95) {
        pointsEarned = 200;
      } else {
        pointsEarned = Math.max(0, Math.round(accuracy * 0.5));
      }
    }

    const result: GameResult = {
      accuracy,
      pointsEarned,
      streak: newStreak,
      targetColor,
      guessedColor: color,
      timeTaken,
    };

    setGuessedColor(color);
    setLastResult(result);
    setShowResult(true);

    const newScore = session.score + pointsEarned;
    const isLastRound = session.round >= session.maxRounds;

    setSession(prev => ({
      ...prev,
      score: newScore,
      streak: newStreak,
      results: [...prev.results, result],
    }));

    // Update leaderboard
    const currentPlayer = session.players[session.currentPlayerIndex];
    if (currentPlayer) {
      updatePlayerStats(currentPlayer, pointsEarned, accuracy);
    }

    if (isLastRound && (mode !== 'multiplayer' || session.currentPlayerIndex >= session.players.length - 1)) {
      setGameOver(true);
    }
  }, [targetColor, session, showResult, gameOver, mode]);

  const nextRound = useCallback(() => {
    if (gameOver) return;

    let nextPlayerIndex = session.currentPlayerIndex;
    let nextRound = session.round;

    if (mode === 'multiplayer') {
      if (session.currentPlayerIndex >= session.players.length - 1) {
        nextPlayerIndex = 0;
        nextRound = session.round + 1;
      } else {
        nextPlayerIndex = session.currentPlayerIndex + 1;
      }
    } else {
      nextRound = session.round + 1;
    }

    setTargetColor(generateRandomColor(difficulty));
    setGuessedColor(null);
    setShowResult(false);
    setLastResult(null);
    roundStartTime.current = Date.now();

    setSession(prev => ({
      ...prev,
      round: nextRound,
      currentPlayerIndex: nextPlayerIndex,
      timeLeft: mode === 'timed' ? (prev.totalTime ?? 60) : prev.timeLeft,
    }));
  }, [gameOver, session, mode, difficulty]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const currentPlayer = session.players[session.currentPlayerIndex] || username;
  const playerStats = getPlayerStats(currentPlayer);

  return {
    session,
    targetColor,
    guessedColor,
    showResult,
    gameOver,
    lastResult,
    isPaused,
    currentPlayer,
    playerStats,
    handleGuess,
    nextRound,
    togglePause,
    setGameOver,
  };
}
