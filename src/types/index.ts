export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export type GameMode = 'classic' | 'timed' | 'precision' | 'multiplayer';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme';

export interface GameResult {
  accuracy: number;
  pointsEarned: number;
  streak: number;
  targetColor: RGB;
  guessedColor: RGB;
  timeTaken?: number;
  hintsUsed?: number;
}

export interface Player {
  username: string;
  totalScore: number;
  gamesPlayed: number;
  bestAccuracy: number;
  bestStreak: number;
  joinedAt: string;
  xp: number;
  level: number;
  perfectGuesses: number;
  totalGuesses: number;
}

export interface GameSession {
  mode: GameMode;
  difficulty: Difficulty;
  score: number;
  streak: number;
  round: number;
  maxRounds: number;
  timeLeft?: number;
  totalTime?: number;
  results: GameResult[];
  players: string[];
  currentPlayerIndex: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  showHints: boolean;
  animationsEnabled: boolean;
}
