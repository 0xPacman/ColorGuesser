// LocalStorage utilities for leaderboard management

const LEADERBOARD_KEY = 'colorGuesserLeaderboard';

/**
 * Get leaderboard from localStorage
 * @returns {Array} Array of player objects
 */
export function getLeaderboard() {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading leaderboard from localStorage:', error);
    return [];
  }
}

/**
 * Save leaderboard to localStorage
 * @param {Array} leaderboard - Array of player objects
 */
export function saveLeaderboard(leaderboard) {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  } catch (error) {
    console.error('Error saving leaderboard to localStorage:', error);
  }
}

/**
 * Add or update a player in the leaderboard
 * @param {string} username - Player's username
 * @param {number} score - Points earned this round
 * @param {number} accuracy - Accuracy percentage for this round
 * @returns {Array} Updated leaderboard
 */
export function updatePlayerStats(username, score, accuracy) {
  const leaderboard = getLeaderboard();
  
  // Find existing player or create new one
  let player = leaderboard.find(p => p.username === username);
  
  if (player) {
    // Update existing player
    player.totalScore += score;
    player.gamesPlayed += 1;
    player.bestAccuracy = Math.max(player.bestAccuracy, accuracy);
  } else {
    // Create new player
    player = {
      username,
      totalScore: score,
      gamesPlayed: 1,
      bestAccuracy: accuracy,
      joinedAt: new Date().toISOString()
    };
    leaderboard.push(player);
  }
  
  // Sort by total score descending
  leaderboard.sort((a, b) => b.totalScore - a.totalScore);
  
  // Keep only top 10 players
  const topPlayers = leaderboard.slice(0, 10);
  
  saveLeaderboard(topPlayers);
  return topPlayers;
}

/**
 * Get a player's stats
 * @param {string} username - Player's username
 * @returns {object|null} Player object or null if not found
 */
export function getPlayerStats(username) {
  const leaderboard = getLeaderboard();
  return leaderboard.find(p => p.username === username) || null;
}

/**
 * Clear all leaderboard data (for testing/debugging)
 */
export function clearLeaderboard() {
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
  }
}
