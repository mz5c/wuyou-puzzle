import { useState, useEffect, useCallback, useRef } from 'react'
import { usePuzzleGame } from './usePuzzleGame'
import { useTimer } from './useTimer'
import type { Difficulty } from '../types'
import { useSound } from './useSound'

export function usePuzzleController(sound: ReturnType<typeof useSound>, enabled = true) {
  const { state, movableIndices, moveTile, moveByDirection, reset, togglePause, changeDifficulty, isShuffling } = usePuzzleGame(3)
  const timer = useTimer(state.isPaused, state.isComplete, state.hasStarted)
  const [showHint, setShowHint] = useState(false)
  const [completionDismissed, setCompletionDismissed] = useState(false)
  const [delayedCompletion, setDelayedCompletion] = useState(false)

  // Phase C: show CompletionModal after celebration animation finishes (~2.5s)
  useEffect(() => {
    if (state.isComplete) {
      const t = setTimeout(() => setDelayedCompletion(true), 2500)
      return () => clearTimeout(t)
    }
    setDelayedCompletion(false)
  }, [state.isComplete])

  // Keyboard controls
  useEffect(() => {
    if (!enabled) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.isPaused || state.isComplete || isShuffling) return
      switch (e.key) {
        case 'ArrowUp':    e.preventDefault(); moveByDirection('up'); break
        case 'ArrowDown':  e.preventDefault(); moveByDirection('down'); break
        case 'ArrowLeft':  e.preventDefault(); moveByDirection('left'); break
        case 'ArrowRight': e.preventDefault(); moveByDirection('right'); break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, state.isPaused, state.isComplete, moveByDirection, isShuffling])

  // Sound effects on move
  const prevMoveCountRef = useRef(state.moveCount)
  useEffect(() => {
    if (state.moveCount > prevMoveCountRef.current) {
      sound.playMove(state.size)
    }
    prevMoveCountRef.current = state.moveCount
  }, [state.moveCount, state.size, sound])

  // Sound on complete (guarded by ref to prevent re-fire on parent re-render)
  const completionSoundPlayedRef = useRef(false)
  useEffect(() => {
    if (state.isComplete && !completionSoundPlayedRef.current) {
      sound.playComplete()
      completionSoundPlayedRef.current = true
    }
    if (!state.isComplete) {
      completionSoundPlayedRef.current = false
    }
  }, [state.isComplete, sound])

  const handleShuffle = useCallback(() => {
    reset()
    timer.reset()
    setShowHint(false)
    setCompletionDismissed(false)
  }, [reset, timer])

  const handleDifficultyChange = useCallback((size: Difficulty) => {
    changeDifficulty(size)
    timer.reset()
    setShowHint(false)
  }, [changeDifficulty, timer])

  return {
    state,
    movableIndices,
    isShuffling,
    timer,
    showHint,
    setShowHint,
    completionDismissed,
    setCompletionDismissed,
    delayedCompletion,
    moveTile,
    moveByDirection,
    handleShuffle,
    handleDifficultyChange,
    togglePause,
  }
}
