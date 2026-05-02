import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Timer, Target, Users, Trophy, Settings, Sparkles, ChevronRight, Star, Zap } from 'lucide-react';
import type { GameMode, Difficulty } from '@/types';

interface MenuScreenProps {
  onStartGame: (mode: GameMode, difficulty: Difficulty, username: string, players?: string[]) => void;
  onShowLeaderboard: () => void;
  onShowSettings: () => void;
}

const modes: { id: GameMode; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
  { id: 'classic', label: 'Classic', desc: '10 rounds, match colors at your pace', icon: <Gamepad2 className="w-6 h-6" />, color: 'from-violet-500 to-purple-500' },
  { id: 'timed', label: 'Timed', desc: '30 seconds, score as much as you can', icon: <Timer className="w-6 h-6" />, color: 'from-orange-500 to-red-500' },
  { id: 'precision', label: 'Precision', desc: 'Only perfect guesses score big', icon: <Target className="w-6 h-6" />, color: 'from-emerald-500 to-teal-500' },
  { id: 'multiplayer', label: 'Multiplayer', desc: 'Pass & play with friends', icon: <Users className="w-6 h-6" />, color: 'from-pink-500 to-rose-500' },
];

const difficulties: { id: Difficulty; label: string; desc: string; color: string }[] = [
  { id: 'easy', label: 'Easy', desc: 'Bright, saturated colors', color: 'text-green-400 border-green-400/30 bg-green-400/10' },
  { id: 'medium', label: 'Medium', desc: 'Standard color range', color: 'text-blue-400 border-blue-400/30 bg-blue-400/10' },
  { id: 'hard', label: 'Hard', desc: 'Muted, tricky colors', color: 'text-orange-400 border-orange-400/30 bg-orange-400/10' },
  { id: 'extreme', label: 'Extreme', desc: 'Near-identical colors', color: 'text-red-400 border-red-400/30 bg-red-400/10' },
];

export function MenuScreen({ onStartGame, onShowLeaderboard, onShowSettings }: MenuScreenProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [username, setUsername] = useState('');
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayer, setNewPlayer] = useState('');
  const [step, setStep] = useState<'mode' | 'difficulty' | 'players' | 'ready'>('mode');

  const handleAddPlayer = () => {
    if (newPlayer.trim() && !players.includes(newPlayer.trim())) {
      setPlayers([...players, newPlayer.trim()]);
      setNewPlayer('');
    }
  };

  const handleStart = () => {
    const name = username.trim() || 'Player';
    if (selectedMode === 'multiplayer') {
      const allPlayers = players.length > 0 ? players : [name];
      onStartGame(selectedMode, selectedDifficulty, name, allPlayers);
    } else {
      onStartGame(selectedMode, selectedDifficulty, name);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* Hero */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-10 mt-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-4 shadow-lg shadow-violet-500/30">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">ColorGuesser Pro</h1>
        <p className="text-white/50 text-lg">Test your color vision. Beat the clock. Climb the ranks.</p>
      </motion.div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {(['mode', 'difficulty', 'players', 'ready'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step === s ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white' :
              ['mode', 'difficulty', 'players', 'ready'].indexOf(step) > i ? 'bg-white/20 text-white/60' : 'bg-white/5 text-white/30'
            }`}>
              {['mode', 'difficulty', 'players', 'ready'].indexOf(step) > i ? <Zap className="w-4 h-4" /> : i + 1}
            </div>
            {i < 3 && <div className={`w-8 h-0.5 ${['mode', 'difficulty', 'players', 'ready'].indexOf(step) > i ? 'bg-white/20' : 'bg-white/5'}`} />}
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Mode */}
          {step === 'mode' && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-3"
            >
              <h2 className="text-xl font-bold text-white mb-4">Select Game Mode</h2>
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => { setSelectedMode(mode.id); setStep('difficulty'); }}
                  className={`w-full glass-card p-4 flex items-center gap-4 transition-all hover:bg-white/[0.06] ${
                    selectedMode === mode.id ? 'ring-2 ring-violet-400 bg-white/[0.06]' : ''
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center text-white shadow-lg`}>
                    {mode.icon}
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-white">{mode.label}</h3>
                    <p className="text-sm text-white/50">{mode.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/30" />
                </button>
              ))}
            </motion.div>
          )}

          {/* Step 2: Select Difficulty */}
          {step === 'difficulty' && (
            <motion.div
              key="difficulty"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Select Difficulty</h2>
                <button onClick={() => setStep('mode')} className="text-sm text-white/50 hover:text-white transition-colors">Back</button>
              </div>
              {difficulties.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => {
                    setSelectedDifficulty(diff.id);
                    if (selectedMode === 'multiplayer') {
                      setStep('players');
                    } else {
                      setStep('ready');
                    }
                  }}
                  className={`w-full glass-card p-4 flex items-center justify-between transition-all hover:bg-white/[0.06] ${
                    selectedDifficulty === diff.id ? `ring-2 ${diff.color.split(' ')[2].replace('bg-', 'ring-').replace('/10', '/50')} bg-white/[0.06]` : ''
                  }`}
                >
                  <div className="text-left">
                    <h3 className="font-bold text-white">{diff.label}</h3>
                    <p className="text-sm text-white/50">{diff.desc}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${diff.color}`}>
                    {diff.label}
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {/* Step 3: Multiplayer Players */}
          {step === 'players' && (
            <motion.div
              key="players"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Add Players</h2>
                <button onClick={() => setStep('difficulty')} className="text-sm text-white/50 hover:text-white transition-colors">Back</button>
              </div>

              <div className="glass-card p-4 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPlayer}
                    onChange={(e) => setNewPlayer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
                    placeholder="Player name..."
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-400/50"
                    maxLength={20}
                  />
                  <button onClick={handleAddPlayer} className="btn-primary px-4 py-2">Add</button>
                </div>

                {players.length > 0 && (
                  <div className="space-y-2">
                    {players.map((p, i) => (
                      <div key={p} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </div>
                          <span className="text-white font-medium">{p}</span>
                        </div>
                        <button
                          onClick={() => setPlayers(players.filter(x => x !== p))}
                          className="text-xs text-red-400 hover:text-red-300 px-2 py-1"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setStep('ready')}
                  disabled={players.length === 0}
                  className="w-full btn-primary py-3 disabled:opacity-50"
                >
                  Continue ({players.length} players)
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Ready */}
          {step === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Ready to Play?</h2>
                <button onClick={() => setStep(selectedMode === 'multiplayer' ? 'players' : 'difficulty')} className="text-sm text-white/50 hover:text-white transition-colors">Back</button>
              </div>

              <div className="glass-card p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Mode</span>
                    <span className="text-white font-semibold capitalize">{selectedMode}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Difficulty</span>
                    <span className="text-white font-semibold capitalize">{selectedDifficulty}</span>
                  </div>
                  {selectedMode === 'multiplayer' && (
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Players</span>
                      <span className="text-white font-semibold">{players.join(', ')}</span>
                    </div>
                  )}
                </div>

                {selectedMode !== 'multiplayer' && (
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your name..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-400/50"
                      maxLength={20}
                    />
                  </div>
                )}

                <button onClick={handleStart} className="w-full game-btn btn-primary text-xl py-4">
                  <Star className="w-5 h-5 inline mr-2" />
                  Start Game
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center gap-4 mt-10">
        <button onClick={onShowLeaderboard} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
          <Trophy className="w-5 h-5" /> Leaderboard
        </button>
        <div className="w-px h-4 bg-white/20" />
        <button onClick={onShowSettings} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
          <Settings className="w-5 h-5" /> Settings
        </button>
      </div>
    </div>
  );
}
