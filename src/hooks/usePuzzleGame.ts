import { useState, useCallback, useRef, useEffect } from 'react'
import type { PuzzleGameState, Difficulty } from '../types'
import { shuffleTiles } from '../utils/shuffle'

function createInitialState(size: Difficulty): PuzzleGameState {
  const { tiles, emptyIndex } = shuffleTiles(size)
  return {
    tiles,
    size,
    emptyIndex,
    moveCount: 0,
    isPaused: false,
    isComplete: false,
    hasStarted: false,
  }
}

export function usePuzzleGame(initialSize: Difficulty = 3) {
  const [state, setState] = useState<PuzzleGameState>(() => createInitialState(initialSize))
  const [isShuffling, setIsShuffling] = useState(false)
  const shuffleTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const isAdjacent = useCallback((index: number, emptyIndex: number, size: number): boolean => {
    const row = Math.floor(index / size)
    const col = index % size
    const emptyRow = Math.floor(emptyIndex / size)
    const emptyCol = emptyIndex % size
    return (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
           (col === emptyCol && Math.abs(row - emptyRow) === 1)
  }, [])

  const getMovableIndices = useCallback((tiles: number[], emptyIndex: number, size: number): number[] => {
    return tiles.reduce<number[]>((acc, _, i) => {
      if (isAdjacent(i, emptyIndex, size)) acc.push(i)
      return acc
    }, [])
  }, [isAdjacent])

  const moveTile = useCallback((tileIndex: number) => {
    setState(prev => {
      if (prev.isPaused || prev.isComplete) return prev
      if (!isAdjacent(tileIndex, prev.emptyIndex, prev.size)) return prev

      const newTiles = [...prev.tiles]
      newTiles[prev.emptyIndex] = newTiles[tileIndex]
      newTiles[tileIndex] = 0

      const newMoveCount = prev.moveCount + 1
      const totalTiles = newTiles.length
      const isComplete = newTiles.every((t, i) => t === (i + 1) % totalTiles)

      return {
        ...prev,
        tiles: newTiles,
        emptyIndex: tileIndex,
        moveCount: newMoveCount,
        isComplete,
        hasStarted: true,
      }
    })
  }, [isAdjacent])

  const moveByDirection = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setState(prev => {
      if (prev.isPaused || prev.isComplete) return prev
      const emptyRow = Math.floor(prev.emptyIndex / prev.size)
      const emptyCol = prev.emptyIndex % prev.size
      let targetIndex = -1

      // The tile moves INTO the empty space (reverse direction)
      switch (direction) {
        case 'up':    targetIndex = prev.emptyIndex + prev.size; break
        case 'down':  targetIndex = prev.emptyIndex - prev.size; break
        case 'left':  targetIndex = prev.emptyIndex + 1; break
        case 'right': targetIndex = prev.emptyIndex - 1; break
      }

      // Check bounds
      if (direction === 'up' && emptyRow === prev.size - 1) return prev
      if (direction === 'down' && emptyRow === 0) return prev
      if (direction === 'left' && emptyCol === prev.size - 1) return prev
      if (direction === 'right' && emptyCol === 0) return prev

      const newTiles = [...prev.tiles]
      newTiles[prev.emptyIndex] = newTiles[targetIndex]
      newTiles[targetIndex] = 0

      const newMoveCount = prev.moveCount + 1
      const totalTiles = newTiles.length
      const isComplete = newTiles.every((t, i) => t === (i + 1) % totalTiles)

      return {
        ...prev,
        tiles: newTiles,
        emptyIndex: targetIndex,
        moveCount: newMoveCount,
        isComplete,
        hasStarted: true,
      }
    })
  }, [])

  const reset = useCallback((size?: Difficulty) => {
    clearTimeout(shuffleTimeoutRef.current)
    setState(prev => createInitialState(size ?? prev.size))
    setIsShuffling(true)
    shuffleTimeoutRef.current = setTimeout(() => setIsShuffling(false), 600)
  }, [])

  const togglePause = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }))
  }, [])

  const changeDifficulty = useCallback((size: Difficulty) => {
    clearTimeout(shuffleTimeoutRef.current)
    setState(createInitialState(size))
    setIsShuffling(true)
    shuffleTimeoutRef.current = setTimeout(() => setIsShuffling(false), 600)
  }, [])

  const movableIndices = getMovableIndices(state.tiles, state.emptyIndex, state.size)

  useEffect(() => {
    return () => clearTimeout(shuffleTimeoutRef.current)
  }, [])

  return {
    state,
    movableIndices,
    moveTile,
    moveByDirection,
    reset,
    togglePause,
    changeDifficulty,
    isShuffling,
  }
}
