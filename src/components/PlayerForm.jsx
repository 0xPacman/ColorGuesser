import React, { useState } from 'react';

const PlayerForm = ({ onPlayerJoin, currentPlayer, players = [], onRemovePlayer }) => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedUsername = username.trim();
    if (!trimmedUsername) return;
    
    setIsSubmitting(true);
    
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      onPlayerJoin(trimmedUsername);
      setUsername('');
      setIsSubmitting(false);
    }, 300);
  };

  const handleSwitchPlayer = () => {
    setUsername('');
    onPlayerJoin(null); // Switch to no player
  };

  if (currentPlayer) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold glass-text-primary mb-4 text-center">
          Current Player
        </h3>
        
        <div className="bg-white/20 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl">👤</span>
            <span className="text-xl font-bold glass-text-primary">{currentPlayer}</span>
          </div>
          <p className="text-sm glass-text-muted text-center">
            Click the color wheel to make your guess!
          </p>
        </div>
        {players.length > 0 && (
          <div className="mb-4">
            <p className="glass-text-secondary text-sm mb-2">Active Players</p>
            <ul className="space-y-2 max-h-40 overflow-auto pr-1">
              {players.map((p) => (
                <li key={p} className={`flex items-center justify-between bg-white/10 rounded-md px-3 py-2 ${p === currentPlayer ? 'ring-1 ring-yellow-400' : ''}`}>
                  <span className="glass-text-primary text-sm">{p}</span>
                  {onRemovePlayer && (
                    <button
                      onClick={() => onRemovePlayer(p)}
                      className="text-xs bg-white/20 hover:bg-white/30 glass-text-primary px-2 py-1 rounded"
                      title="Remove player"
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleSwitchPlayer}
          className="w-full bg-white/20 hover:bg-white/30 glass-text-primary py-2 px-4 rounded-lg 
                     transition-all duration-200 border border-white/30 hover:border-white/50"
        >
          Switch Player
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold glass-text-primary mb-4 text-center">Join Game</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium glass-text-secondary mb-2">
            Enter your username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your name..."
            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg 
                       glass-text-primary placeholder-white/50 focus:outline-none focus:ring-2 
                       focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
            maxLength={20}
            disabled={isSubmitting}
            autoComplete="off"
          />
        </div>
        
        <button
          type="submit"
          disabled={!username.trim() || isSubmitting}
          className={`
            w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200
            ${username.trim() && !isSubmitting
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 glass-text-primary shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-white/20 glass-text-muted cursor-not-allowed'
            }
          `}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Joining...</span>
            </div>
          ) : (
            'Join Game'
          )}
        </button>
      </form>
      
      <div className="mt-4 text-xs glass-text-muted text-center">
        <p>Enter a username to start playing!</p>
        <p className="mt-1">Add multiple players to auto-rotate turns after each result.</p>
      </div>
    </div>
  );
};

export default PlayerForm;
