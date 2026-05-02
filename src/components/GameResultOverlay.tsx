import { motion } from 'framer-motion';
import { ArrowRight, Target } from 'lucide-react';
import { rgbToHex, getAccuracyBadge, getWarmthHint } from '@/utils/color';
import type { GameResult } from '@/types';

interface GameResultOverlayProps {
  result: GameResult;
  onNext: () => void;
  isMultiplayer?: boolean;
  nextPlayer?: string;
}

export function GameResultOverlay({ result, onNext, isMultiplayer, nextPlayer }: GameResultOverlayProps) {
  const badge = getAccuracyBadge(result.accuracy);
  const targetHex = rgbToHex(result.targetColor);
  const guessHex = rgbToHex(result.guessedColor);
  const warmth = getWarmthHint(result.targetColor, result.guessedColor);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="glass-card-strong w-full max-w-lg p-6 md:p-8 space-y-6"
      >
        {/* Badge */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold ${badge.color} bg-white/5 border border-white/10`}
          >
            {badge.emoji} {badge.text}
          </motion.div>
        </div>

        {/* Accuracy Circle */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="url(#accuracyGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDasharray: '0 351' }}
                animate={{ strokeDasharray: `${(result.accuracy / 100) * 351} 351` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-bold text-white"
              >
                {result.accuracy.toFixed(1)}%
              </motion.span>
            </div>
          </div>
        </div>

        {/* Color Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center space-y-2">
            <div className="w-full aspect-square rounded-xl border-2 border-white/10 shadow-xl" style={{ backgroundColor: targetHex }} />
            <p className="text-xs text-white/50 uppercase tracking-wider">Target</p>
            <p className="font-mono text-sm text-white/80">{targetHex.toUpperCase()}</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-full aspect-square rounded-xl border-2 border-white/10 shadow-xl" style={{ backgroundColor: guessHex }} />
            <p className="text-xs text-white/50 uppercase tracking-wider">Your Guess</p>
            <p className="font-mono text-sm text-white/80">{guessHex.toUpperCase()}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">Points Earned</span>
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl font-bold text-emerald-400"
            >
              +{result.pointsEarned.toLocaleString()}
            </motion.span>
          </div>
          {result.streak > 1 && (
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Streak Bonus</span>
              <span className="text-lg font-bold text-orange-400">🔥 {result.streak}x</span>
            </div>
          )}
          {result.timeTaken !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Time Taken</span>
              <span className="text-sm font-mono text-white/80">{result.timeTaken.toFixed(1)}s</span>
            </div>
          )}
          <div className="pt-2 border-t border-white/10">
            <p className="text-sm text-white/50 text-center italic">"{warmth}"</p>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg"
        >
          {isMultiplayer && nextPlayer ? (
            <>
              <Target className="w-5 h-5" />
              Next: {nextPlayer}
            </>
          ) : (
            <>
              Next Round <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}
