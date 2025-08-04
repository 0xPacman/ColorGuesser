import React from 'react';

const Header = ({ currentPlayer, currentScore, streak }) => {
  return (
    <header className="glass-card p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        {/* App Title */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold glass-text-primary mb-2">
            🎨 ColorGuesser
          </h1>
          <p className="glass-text-muted text-sm md:text-base">
            Match the target color by clicking on the color wheel
          </p>
        </div>

        {/* Player Info */}
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-6">
          {currentPlayer ? (
            <>
              {/* Current Player */}
              <div className="text-center md:text-right">
                <p className="glass-text-muted text-sm">Current Player</p>
                <p className="text-xl font-bold glass-text-primary">{currentPlayer}</p>
              </div>

              {/* Current Score */}
              <div className="text-center md:text-right">
                <p className="glass-text-muted text-sm">Score</p>
                <p className="text-2xl font-bold text-green-300 glass-text-primary">
                  {currentScore.toLocaleString()}
                </p>
              </div>

              {/* Streak */}
              {streak > 1 && (
                <div className="text-center md:text-right">
                  <p className="glass-text-muted text-sm">Streak</p>
                  <div className="flex items-center justify-center md:justify-end space-x-1">
                    <span className="text-xl">🔥</span>
                    <span className="text-xl font-bold text-yellow-300 glass-text-primary">{streak}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center md:text-right">
              <p className="glass-text-secondary text-lg">
                Welcome! Join the game to start playing.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Streak Indicator */}
      {streak > 1 && (
        <div className="mt-4 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-lg p-3">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-yellow-300 font-semibold glass-text-primary">
              🔥 {streak} round streak! 
            </span>
            <span className="glass-text-muted text-sm">
              (+{((streak - 1) * 10)}% bonus on accurate guesses)
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
