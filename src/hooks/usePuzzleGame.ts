import { useState, useCallback } from 'react'
import { PuzzleGameState, Difficulty } from '../types'
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
  }
}

export function usePuzzleGame(initialSize: Difficulty = 3) {
  const [state, setState] = useState<PuzzleGameState>(() => createInitialState(initialSize))

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
      const isComplete = newTiles.every((t, i) => t === i) && newTiles[newTiles.length - 1] === 0

      return {
        ...prev,
        tiles: newTiles,
        emptyIndex: tileIndex,
        moveCount: newMoveCount,
        isComplete,
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
      const isComplete = newTiles.every((t, i) => t === i) && newTiles[newTiles.length - 1] === 0

      return {
        ...prev,
        tiles: newTiles,
        emptyIndex: targetIndex,
        moveCount: newMoveCount,
        isComplete,
      }
    })
  }, [])

  const reset = useCallback((size?: Difficulty) => {
    setState(prev => createInitialState(size ?? prev.size))
  }, [])

  const togglePause = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }))
  }, [])

  const changeDifficulty = useCallback((size: Difficulty) => {
    setState(createInitialState(size))
  }, [])

  const movableIndices = getMovableIndices(state.tiles, state.emptyIndex, state.size)

  return {
    state,
    movableIndices,
    moveTile,
    moveByDirection,
    reset,
    togglePause,
    changeDifficulty,
  }
}
