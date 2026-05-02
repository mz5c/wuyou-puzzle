import { useEffect, useCallback, useState, useRef } from 'react'
import { usePuzzleGame } from '../hooks/usePuzzleGame'
import { useTimer } from '../hooks/useTimer'
import { useSound } from '../hooks/useSound'
import type { Difficulty } from '../types'
import PuzzleBoard from '../components/PuzzleBoard'
import GameStats from '../components/GameStats'
import GameControls from '../components/GameControls'
import DirectionPad from '../components/DirectionPad'
import DifficultySelector from '../components/DifficultySelector'
import CompletionModal from '../components/CompletionModal'
import styles from './NumberPuzzlePage.module.css'

interface NumberPuzzlePageProps {
  sound: ReturnType<typeof useSound>
  onSaveScore: (time: number, moves: number, difficulty: Difficulty, playerName?: string) => void
}

export default function NumberPuzzlePage({ sound, onSaveScore }: NumberPuzzlePageProps) {
  const { state, movableIndices, moveTile, moveByDirection, reset, togglePause, changeDifficulty } = usePuzzleGame(3)
  const timer = useTimer(state.isPaused, state.isComplete, state.hasStarted)
  const [showHint, setShowHint] = useState(false)

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.isPaused || state.isComplete) return
      switch (e.key) {
        case 'ArrowUp':    e.preventDefault(); moveByDirection('up'); break
        case 'ArrowDown':  e.preventDefault(); moveByDirection('down'); break
        case 'ArrowLeft':  e.preventDefault(); moveByDirection('left'); break
        case 'ArrowRight': e.preventDefault(); moveByDirection('right'); break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.isPaused, state.isComplete, moveByDirection])

  // Sound effects on move
  const prevMoveCountRef = useRef(state.moveCount)
  useEffect(() => {
    if (state.moveCount > prevMoveCountRef.current) {
      sound.playMove()
    }
    prevMoveCountRef.current = state.moveCount
  }, [state.moveCount, sound])

  // Sound on complete
  useEffect(() => {
    if (state.isComplete) {
      sound.playComplete()
    }
  }, [state.isComplete, sound])

  const handleTileClick = useCallback((index: number) => {
    if (movableIndices.includes(index)) {
      moveTile(index)
    }
  }, [movableIndices, moveTile])

  const handleShuffle = useCallback(() => {
    reset()
    timer.reset()
    setShowHint(false)
  }, [reset, timer])

  const handleDifficultyChange = useCallback((size: Difficulty) => {
    changeDifficulty(size)
    timer.reset()
    setShowHint(false)
  }, [changeDifficulty, timer])

  return (
    <div className={styles.page}>
      <DifficultySelector current={state.size} onChange={handleDifficultyChange} />
      <PuzzleBoard state={state} movableIndices={showHint ? movableIndices : []} isImageMode={false} onTileClick={handleTileClick} />
      <GameStats time={timer.time} moves={state.moveCount} showHint={showHint} onToggleHint={() => setShowHint(h => !h)} />
      <GameControls onShuffle={handleShuffle} onPause={togglePause} onReset={handleShuffle} isPaused={state.isPaused} />
      <DirectionPad onDirection={moveByDirection} />
      {state.isComplete && (
        <CompletionModal time={timer.time} moves={state.moveCount} onSave={name => onSaveScore(timer.time, state.moveCount, state.size, name)} onClose={() => {}} />
      )}
    </div>
  )
}
