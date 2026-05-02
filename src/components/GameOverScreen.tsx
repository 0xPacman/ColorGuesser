import { motion } from 'framer-motion';
import { RotateCcw, Home, Trophy, Target, Flame, Star, TrendingUp } from 'lucide-react';
import type { GameSession } from '@/types';

interface GameOverScreenProps {
  session: GameSession;
  onPlayAgain: () => void;
  onQuit: () => void;
}

export function GameOverScreen({ session, onPlayAgain, onQuit }: GameOverScreenProps) {
  const avgAccuracy = session.results.length > 0
    ? session.results.reduce((sum, r) => sum + r.accuracy, 0) / session.results.length
    : 0;

  const bestAccuracy = session.results.length > 0
    ? Math.max(...session.results.map(r => r.accuracy))
    : 0;

  const maxStreak = session.results.length > 0
    ? Math.max(...session.results.map(r => r.streak))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="glass-card-strong w-full max-w-xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block"
          >
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto" />
          </motion.div>
          <h2 className="text-3xl font-bold gradient-text-gold">Game Over!</h2>
          <p className="text-white/60">{session.mode === 'timed' ? 'Time\'s up!' : `All ${session.maxRounds} rounds completed`}</p>
        </div>

        {/* Final Score */}
        <div className="text-center py-4">
          <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Final Score</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="text-5xl font-bold gradient-text"
          >
            {session.score.toLocaleString()}
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={<Target className="w-5 h-5" />} label="Rounds" value={session.results.length} color="text-blue-400" />
          <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Avg Accuracy" value={`${avgAccuracy.toFixed(1)}%`} color="text-emerald-400" />
          <StatCard icon={<Star className="w-5 h-5" />} label="Best" value={`${bestAccuracy.toFixed(1)}%`} color="text-yellow-400" />
          <StatCard icon={<Flame className="w-5 h-5" />} label="Max Streak" value={maxStreak} color="text-orange-400" />
        </div>

        {/* Round History */}
        {session.results.length > 0 && (
          <div className="glass-card p-4 space-y-2">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Round History</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {session.results.map((result, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/40 w-6">#{i + 1}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: `#${((1 << 24) + (result.targetColor.r << 16) + (result.targetColor.g << 8) + result.targetColor.b).toString(16).slice(1)}` }} />
                      <span className="text-sm text-white/70">{result.accuracy.toFixed(1)}%</span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-emerald-400">+{result.pointsEarned}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onQuit} className="btn-secondary flex items-center justify-center gap-2 py-3">
            <Home className="w-4 h-4" /> Main Menu
          </button>
          <button onClick={onPlayAgain} className="btn-primary flex items-center justify-center gap-2 py-3">
            <RotateCcw className="w-4 h-4" /> Play Again
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="glass-card p-3 text-center space-y-1">
      <div className={`flex justify-center ${color}`}>{icon}</div>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-xs text-white/50">{label}</p>
    </div>
  );
}
