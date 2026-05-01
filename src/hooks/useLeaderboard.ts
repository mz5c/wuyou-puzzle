import { useState, useCallback } from 'react'
import { LeaderboardEntry, PuzzleMode, Difficulty } from '../types'

const STORAGE_KEY = 'wuyou-puzzle-leaderboard'
const MAX_ENTRIES_PER_CATEGORY = 20

function loadEntries(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveEntries(entries: LeaderboardEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(loadEntries)

  const addEntry = useCallback((entry: Omit<LeaderboardEntry, 'id' | 'date'>) => {
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    }
    setEntries(prev => {
      const updated = [...prev, newEntry]
      // Keep only top MAX_ENTRIES_PER_CATEGORY per category
      const categoryKey = `${entry.mode}-${entry.difficulty}`
      const filtered = updated.filter(e => `${e.mode}-${e.difficulty}` === categoryKey)
        .sort((a, b) => a.time - b.time)
        .slice(0, MAX_ENTRIES_PER_CATEGORY)
      const others = updated.filter(e => `${e.mode}-${e.difficulty}` !== categoryKey)
      const result = [...others, ...filtered]
      saveEntries(result)
      return result
    })
    return newEntry
  }, [])

  const getFiltered = useCallback((mode: PuzzleMode, difficulty: Difficulty) => {
    return entries
      .filter(e => e.mode === mode && e.difficulty === difficulty)
      .sort((a, b) => a.time - b.time)
  }, [entries])

  const clearAll = useCallback(() => {
    setEntries([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { entries, addEntry, getFiltered, clearAll }
}
