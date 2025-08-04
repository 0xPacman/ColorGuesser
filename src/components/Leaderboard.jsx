import React from 'react';
import { getRankingBadgeClass } from '../utils/colorUtils.js';

const Leaderboard = ({ leaderboard, currentPlayer }) => {
  return (
    <div className="glass-card p-6 h-fit">
      <h2 className="text-xl font-bold glass-text-primary mb-4 text-center">
        🏆 Leaderboard
      </h2>
      
      {leaderboard.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg mb-2 glass-text-primary">No players yet!</p>
          <p className="text-sm glass-text-muted">Be the first to join and start playing.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((player, index) => {
            const position = index + 1;
            const isCurrentPlayer = player.username === currentPlayer;
            
            return (
              <div
                key={player.username}
                className={`
                  flex items-center justify-between p-3 rounded-lg transition-all duration-200
                  ${isCurrentPlayer 
                    ? 'bg-white/30 ring-2 ring-yellow-400 shadow-lg' 
                    : 'bg-white/10 hover:bg-white/20'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`ranking-badge ${getRankingBadgeClass(position)}`}>
                    {position}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className={`font-semibold ${isCurrentPlayer ? 'text-yellow-100 glass-text-primary' : 'glass-text-primary'}`}>
                        {player.username}
                      </p>
                      {isCurrentPlayer && (
                        <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs glass-text-muted">
                      <span>{player.gamesPlayed} games</span>
                      <span>{player.bestAccuracy.toFixed(1)}% best</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-lg font-bold ${isCurrentPlayer ? 'text-yellow-200 glass-text-primary' : 'glass-text-primary'}`}>
                    {player.totalScore.toLocaleString()}
                  </p>
                  <p className="text-xs glass-text-muted">points</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {leaderboard.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs glass-text-muted text-center">
            Showing top {leaderboard.length} player{leaderboard.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
