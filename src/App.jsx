import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import ColorWheel from './components/ColorWheel.jsx';
import GameResult from './components/GameResult.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import PlayerForm from './components/PlayerForm.jsx';
import { 
  generateRandomColor, 
  calculateColorSimilarity, 
  rgbToHex 
} from './utils/colorUtils.js';
import { 
  getLeaderboard, 
  updatePlayerStats, 
  getPlayerStats,
  getActivePlayers,
  addActivePlayer,
  saveActivePlayers
} from './utils/storageUtils.js';

function App() {
  // Game state
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [players, setPlayers] = useState([]); // active players turn order
  const [turnIndex, setTurnIndex] = useState(0);
  const [targetColor, setTargetColor] = useState(generateRandomColor());
  const [selectedColor, setSelectedColor] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  
  // Player stats
  const [currentScore, setCurrentScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  // Load leaderboard and active players on component mount
  useEffect(() => {
    setLeaderboard(getLeaderboard());
    const active = getActivePlayers();
    setPlayers(active);
    setCurrentPlayer(active.length > 0 ? active[0] : null);
    setTurnIndex(0);
  }, []);

  // Update player's current score when they join
  useEffect(() => {
    if (currentPlayer) {
      const playerStats = getPlayerStats(currentPlayer);
      setCurrentScore(playerStats ? playerStats.totalScore : 0);
      setStreak(0); // Reset streak when switching players
    } else {
      setCurrentScore(0);
      setStreak(0);
    }
  }, [currentPlayer]);

  const handlePlayerJoin = (username) => {
    // If null, means switch to no player
    if (!username) {
      setCurrentPlayer(null);
      setShowResult(false);
      setSelectedColor(null);
      setGameResult(null);
      return;
    }
    const updated = addActivePlayer(username);
    setPlayers(updated);
    // If first player, set as current
    setCurrentPlayer(username);
    setTurnIndex(Math.max(0, updated.indexOf(username)));
    setShowResult(false);
    setSelectedColor(null);
    setGameResult(null);
  };

  const handleColorSelect = (color) => {
    if (!currentPlayer || showResult) return;

    setSelectedColor(color);
    
    // Calculate accuracy
    const accuracy = calculateColorSimilarity(targetColor, color);
    
    // Calculate base points (accuracy percentage)
    let pointsEarned = Math.round(accuracy);
    
    // Apply streak bonus for accurate guesses (80%+)
    let newStreak = streak;
    if (accuracy >= 80) {
      newStreak = streak + 1;
      if (newStreak > 1) {
        const bonus = (newStreak - 1) * 10; // 10% per streak level
        pointsEarned = Math.round(pointsEarned * (1 + bonus / 100));
      }
    } else {
      newStreak = 0; // Reset streak
    }
    
    setStreak(newStreak);

    // Create game result
    const result = {
      accuracy,
      pointsEarned,
      streak: newStreak
    };
    
    setGameResult(result);
    setShowResult(true);

    // Update player stats and leaderboard
    const updatedLeaderboard = updatePlayerStats(currentPlayer, pointsEarned, accuracy);
    setLeaderboard(updatedLeaderboard);
    
    // Update current score
    setCurrentScore(prev => prev + pointsEarned);
  };

  const handleNext = () => {
    // If 0 or 1 player, just next round
    if (players.length <= 1) {
      setTargetColor(generateRandomColor());
      setSelectedColor(null);
      setGameResult(null);
      setShowResult(false);
      return;
    }

    // Rotate to next player
    const nextIndex = (turnIndex + 1) % players.length;
    const nextPlayer = players[nextIndex] || null;
    setTurnIndex(nextIndex);
    setCurrentPlayer(nextPlayer);

    // Prepare next round state
    setTargetColor(generateRandomColor());
    setSelectedColor(null);
    setGameResult(null);
    setShowResult(false);
  };

  const targetHex = rgbToHex(targetColor.r, targetColor.g, targetColor.b);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header 
          currentPlayer={currentPlayer}
          currentScore={currentScore}
          streak={streak}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Game Area - Takes up 2/3 on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Target Color and Color Wheel - Side by Side */}
            <div className="glass-card-premium p-8">
              <h2 className="text-xl font-bold glass-text-primary mb-6 text-center">
                🎯 Match the Target Color
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Target Color Display */}
                <div className="flex flex-col items-center space-y-4">
                  <h3 className="text-lg font-semibold glass-text-primary">Target Color</h3>
                  <div 
                    className="w-40 h-32 rounded-xl border-4 border-white/50 shadow-xl"
                    style={{ backgroundColor: targetHex }}
                  ></div>
                  
                  <div className="text-center">
                    <p className="text-xl font-mono font-bold glass-text-primary mb-1">
                      {targetHex}
                    </p>
                    <p className="glass-text-muted text-sm">
                      RGB({targetColor.r}, {targetColor.g}, {targetColor.b})
                    </p>
                  </div>
                </div>

                {/* Color Wheel */}
                <div className="flex flex-col items-center space-y-4">
                  <h3 className="text-lg font-semibold glass-text-primary">🎨 Click to Select</h3>
                  <ColorWheel
                    onColorSelect={handleColorSelect}
                    disabled={!currentPlayer || showResult}
                    size={200}
                  />
                </div>
              </div>
            </div>

            {/* Game Result */}
            {showResult && gameResult && (
              <GameResult
                targetColor={targetColor}
                selectedColor={selectedColor}
                accuracy={gameResult.accuracy}
                pointsEarned={gameResult.pointsEarned}
                streak={gameResult.streak}
                onNext={handleNext}
                multiPlayer={players.length > 1}
                isVisible={showResult}
              />
            )}
          </div>

          {/* Sidebar - Takes up 1/3 on large screens */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Leaderboard 
              leaderboard={leaderboard}
              currentPlayer={currentPlayer}
            />

            {/* Player Form */}
            <PlayerForm 
              onPlayerJoin={handlePlayerJoin}
              currentPlayer={currentPlayer}
              players={players}
              onRemovePlayer={(u) => {
                const remaining = players.filter(p => p !== u);
                saveActivePlayers(remaining);
                setPlayers(remaining);
                // Adjust turn index and current player if needed
                if (remaining.length === 0) {
                  setCurrentPlayer(null);
                  setTurnIndex(0);
                } else {
                  const newIndex = turnIndex % remaining.length;
                  setTurnIndex(newIndex);
                  setCurrentPlayer(remaining[newIndex]);
                }
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center glass-text-muted text-sm">
          <p>🎨 ColorGuesser - Test your color vision skills!</p>
          {players.length > 1 && (
            <p className="mt-2 glass-text-muted">Turn: {turnIndex + 1} / {players.length} • Next up: {players[(turnIndex + 1) % players.length]}</p>
          )}
         
        </footer>
      </div>
    </div>
  );
}

export default App;
