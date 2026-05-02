import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MenuScreen } from '@/components/MenuScreen';
import { GameScreen } from '@/components/GameScreen';
import { LeaderboardScreen } from '@/components/LeaderboardScreen';
import { SettingsScreen } from '@/components/SettingsScreen';
import type { GameMode, Difficulty } from '@/types';

type Screen = 'menu' | 'game' | 'leaderboard' | 'settings';

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [gameConfig, setGameConfig] = useState<{
    mode: GameMode;
    difficulty: Difficulty;
    username: string;
    players?: string[];
  } | null>(null);

  const handleStartGame = useCallback((mode: GameMode, difficulty: Difficulty, username: string, players?: string[]) => {
    setGameConfig({ mode, difficulty, username, players });
    setScreen('game');
  }, []);

  const handleQuit = useCallback(() => {
    setScreen('menu');
    setGameConfig(null);
  }, []);

  const handlePlayAgain = useCallback(() => {
    if (gameConfig) {
      setScreen('game');
    }
  }, [gameConfig]);

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {screen === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MenuScreen
              onStartGame={handleStartGame}
              onShowLeaderboard={() => setScreen('leaderboard')}
              onShowSettings={() => setScreen('settings')}
            />
          </motion.div>
        )}

        {screen === 'game' && gameConfig && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GameScreen
              mode={gameConfig.mode}
              difficulty={gameConfig.difficulty}
              username={gameConfig.username}
              players={gameConfig.players}
              onQuit={handleQuit}
              onPlayAgain={handlePlayAgain}
            />
          </motion.div>
        )}

        {screen === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <LeaderboardScreen onBack={() => setScreen('menu')} />
          </motion.div>
        )}

        {screen === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <SettingsScreen onBack={() => setScreen('menu')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
