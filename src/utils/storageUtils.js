// LocalStorage utilities for leaderboard and active players management

const LEADERBOARD_KEY = 'colorGuesserLeaderboard';
const ACTIVE_PLAYERS_KEY = 'colorGuesserActivePlayers';

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

// ===== Active players (session) helpers =====

/**
 * Get active players list from localStorage (turn order array of usernames)
 * @returns {string[]} Array of usernames
 */
export function getActivePlayers() {
  try {
    const raw = localStorage.getItem(ACTIVE_PLAYERS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    // Ensure it's an array of unique strings
    return Array.isArray(list) ? Array.from(new Set(list.filter(x => typeof x === 'string' && x.trim()))) : [];
  } catch (e) {
    console.error('Error reading active players from localStorage:', e);
    return [];
  }
}

/**
 * Save active players list to localStorage
 * @param {string[]} players
 */
export function saveActivePlayers(players) {
  try {
    const unique = Array.from(new Set((players || []).filter(x => typeof x === 'string' && x.trim())));
    localStorage.setItem(ACTIVE_PLAYERS_KEY, JSON.stringify(unique));
  } catch (e) {
    console.error('Error saving active players to localStorage:', e);
  }
}

/**
 * Add a username to active players list (if not present)
 * @param {string} username
 * @returns {string[]} updated list
 */
export function addActivePlayer(username) {
  const trimmed = (username || '').trim();
  if (!trimmed) return getActivePlayers();
  const list = getActivePlayers();
  if (!list.includes(trimmed)) list.push(trimmed);
  saveActivePlayers(list);
  return list;
}

/**
 * Remove a username from active players list
 * @param {string} username
 * @returns {string[]} updated list
 */
export function removeActivePlayer(username) {
  const trimmed = (username || '').trim();
  const list = getActivePlayers().filter(u => u !== trimmed);
  saveActivePlayers(list);
  return list;
}

/**
 * Clear active players list
 */
export function clearActivePlayers() {
  try {
    localStorage.removeItem(ACTIVE_PLAYERS_KEY);
  } catch (e) {
    console.error('Error clearing active players:', e);
  }
}
