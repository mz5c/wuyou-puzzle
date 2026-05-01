export type PuzzleMode = 'number' | 'image'
export type Difficulty = 3 | 4 | 5

export interface PuzzleGameState {
  tiles: number[]
  size: number
  emptyIndex: number
  moveCount: number
  isPaused: boolean
  isComplete: boolean
}

export interface LeaderboardEntry {
  id: string
  mode: PuzzleMode
  difficulty: Difficulty
  time: number
  moves: number
  playerName: string
  date: string
  imageThumb?: string
}

export interface GameStats {
  time: number
  moves: number
}
