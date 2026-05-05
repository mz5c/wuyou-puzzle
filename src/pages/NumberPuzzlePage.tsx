import { usePuzzleController } from '../hooks/usePuzzleController'
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
  const {
    state, movableIndices, isShuffling, timer, showHint, setShowHint,
    completionDismissed, setCompletionDismissed, delayedCompletion,
    moveTile, moveByDirection, handleShuffle, handleDifficultyChange, togglePause,
  } = usePuzzleController(sound)

  return (
    <div className={styles.page}>
      <DifficultySelector current={state.size} onChange={handleDifficultyChange} />
      <PuzzleBoard state={state} movableIndices={movableIndices} isImageMode={false} onTileClick={moveTile} showHints={showHint} isShuffling={isShuffling} />
      <GameStats time={timer.time} moves={state.moveCount} showHint={showHint} onToggleHint={() => setShowHint(h => !h)} />
      <GameControls onShuffle={handleShuffle} onPause={togglePause} onReset={handleShuffle} isPaused={state.isPaused} />
      <DirectionPad onDirection={moveByDirection} />
      {delayedCompletion && !completionDismissed && (
        <CompletionModal time={timer.time} moves={state.moveCount} onSave={name => { onSaveScore(timer.time, state.moveCount, state.size, name); setCompletionDismissed(true) }} onClose={() => setCompletionDismissed(true)} />
      )}
    </div>
  )
}
