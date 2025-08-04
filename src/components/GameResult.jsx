import React from 'react';
import { rgbToHex, getAccuracyBadge } from '../utils/colorUtils.js';

const GameResult = ({ 
  targetColor, 
  selectedColor, 
  accuracy, 
  pointsEarned, 
  streak, 
  onNextRound,
  isVisible 
}) => {
  if (!isVisible) return null;

  const badge = getAccuracyBadge(accuracy);
  const targetHex = rgbToHex(targetColor.r, targetColor.g, targetColor.b);
  const selectedHex = rgbToHex(selectedColor.r, selectedColor.g, selectedColor.b);

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold glass-text-primary mb-4">
          Round Results
        </h3>

        {/* Accuracy Badge */}
        <div className="flex justify-center">
          <span className={`accuracy-badge ${badge.className} text-lg animate-bounce-in`}>
            {badge.text}
          </span>
        </div>

        {/* Score Display */}
        <div className="bg-white/20 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="glass-text-secondary">Accuracy:</span>
            <span className="text-xl font-bold glass-text-primary">
              {accuracy.toFixed(1)}%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="glass-text-secondary">Points Earned:</span>
            <span className="text-xl font-bold text-green-300 glass-text-primary">
              +{pointsEarned}
            </span>
          </div>

          {streak > 1 && (
            <div className="flex justify-between items-center border-t border-white/20 pt-2">
              <span className="glass-text-secondary">Streak Bonus:</span>
              <span className="text-lg font-bold text-yellow-300 glass-text-primary">
                🔥 {streak} rounds
              </span>
            </div>
          )}
        </div>

        {/* Color Comparison */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold glass-text-primary">Color Comparison</h4>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Target Color */}
            <div className="text-center">
              <div 
                className="w-full h-20 rounded-lg border-2 border-white/50 mb-2 shadow-lg"
                style={{ backgroundColor: targetHex }}
              ></div>
              <div className="text-sm">
                <p className="glass-text-primary font-semibold">Target</p>
                <p className="glass-text-muted font-mono text-xs">{targetHex}</p>
              </div>
            </div>

            {/* Selected Color */}
            <div className="text-center">
              <div 
                className="w-full h-20 rounded-lg border-2 border-white/50 mb-2 shadow-lg"
                style={{ backgroundColor: selectedHex }}
              ></div>
              <div className="text-sm">
                <p className="glass-text-primary font-semibold">Your Guess</p>
                <p className="glass-text-muted font-mono text-xs">{selectedHex}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Round Button */}
        <button
          onClick={onNextRound}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 
                     hover:to-purple-600 glass-text-primary font-semibold py-3 px-6 rounded-lg 
                     transition-all duration-200 shadow-lg hover:shadow-xl 
                     transform hover:scale-105 active:scale-95"
        >
          Next Round 🎯
        </button>

        {/* Achievement Messages */}
        {accuracy >= 95 && (
          <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-lg p-3">
            <p className="text-yellow-200 font-semibold glass-text-primary">🎉 Perfect match! Amazing color vision!</p>
          </div>
        )}
        
        {streak >= 3 && accuracy >= 80 && (
          <div className="bg-orange-400/20 border border-orange-400/50 rounded-lg p-3">
            <p className="text-orange-200 font-semibold glass-text-primary">
              🔥 On fire! {streak} great guesses in a row!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameResult;
