import type { Player, GameSettings } from '@/types';

const LEADERBOARD_KEY = 'colorGuesserPro_leaderboard';
const SETTINGS_KEY = 'colorGuesserPro_settings';

export function getLeaderboard(): Player[] {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLeaderboard(leaderboard: Player[]) {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard.slice(0, 20)));
  } catch (error) {
    console.error('Error saving leaderboard:', error);
  }
}

export function updatePlayerStats(username: string, score: number, accuracy: number): Player[] {
  const leaderboard = getLeaderboard();
  let player = leaderboard.find(p => p.username === username);

  if (player) {
    player.totalScore += score;
    player.gamesPlayed += 1;
    player.bestAccuracy = Math.max(player.bestAccuracy, accuracy);
    if (accuracy >= 80) {
      player.bestStreak = Math.max(player.bestStreak, 1);
    }
    player.xp += Math.round(score / 10);
    player.level = Math.floor(Math.sqrt(player.xp / 100)) + 1;
    player.totalGuesses += 1;
    if (accuracy >= 99) player.perfectGuesses += 1;
  } else {
    player = {
      username,
      totalScore: score,
      gamesPlayed: 1,
      bestAccuracy: accuracy,
      bestStreak: accuracy >= 80 ? 1 : 0,
      joinedAt: new Date().toISOString(),
      xp: Math.round(score / 10),
      level: 1,
      perfectGuesses: accuracy >= 99 ? 1 : 0,
      totalGuesses: 1,
    };
    leaderboard.push(player);
  }

  leaderboard.sort((a, b) => b.totalScore - a.totalScore);
  saveLeaderboard(leaderboard);
  return leaderboard;
}

export function getPlayerStats(username: string): Player | null {
  return getLeaderboard().find(p => p.username === username) || null;
}

export function clearLeaderboard() {
  localStorage.removeItem(LEADERBOARD_KEY);
}

export function getSettings(): GameSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) return JSON.parse(data);
  } catch { /* empty */ }
  return {
    soundEnabled: true,
    hapticsEnabled: true,
    showHints: true,
    animationsEnabled: true,
  };
}

export function saveSettings(settings: GameSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}
