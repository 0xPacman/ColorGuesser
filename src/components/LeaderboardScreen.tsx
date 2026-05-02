import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Medal, Award, Crown } from 'lucide-react';
import { getLeaderboard } from '@/utils/storage';
import { getRankingBadge } from '@/utils/color';

interface LeaderboardScreenProps {
  onBack: () => void;
}

export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const leaderboard = getLeaderboard();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold gradient-text-gold">Leaderboard</h1>
        </div>

        {leaderboard.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 text-center"
          >
            <Trophy className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white/60 mb-2">No Scores Yet</h2>
            <p className="text-white/40">Play some games to see your name on the leaderboard!</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((player, index) => {
              const badge = getRankingBadge(index + 1);
              const isTop3 = index < 3;

              return (
                <motion.div
                  key={player.username}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-card p-4 flex items-center gap-4 ${isTop3 ? 'border-yellow-400/20' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${badge.className}`}>
                    {index === 0 ? <Crown className="w-5 h-5" /> :
                     index === 1 ? <Medal className="w-5 h-5" /> :
                     index === 2 ? <Award className="w-5 h-5" /> :
                     index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white truncate">{player.username}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-medium">
                        Lv.{player.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/50 mt-1">
                      <span>{player.gamesPlayed} games</span>
                      <span>{player.bestAccuracy.toFixed(1)}% best</span>
                      {player.perfectGuesses > 0 && (
                        <span className="text-yellow-400">{player.perfectGuesses} perfect</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-amber-400">{player.totalScore.toLocaleString()}</p>
                    <p className="text-xs text-white/40">points</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
