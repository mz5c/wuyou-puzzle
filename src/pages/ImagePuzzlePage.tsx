import { useState, useEffect, useCallback, useRef } from 'react'
import { usePuzzleGame } from '../hooks/usePuzzleGame'
import { useTimer } from '../hooks/useTimer'
import { useSound } from '../hooks/useSound'
import type { Difficulty } from '../types'
import PuzzleBoard from '../components/PuzzleBoard'
import GameStats from '../components/GameStats'
import GameControls from '../components/GameControls'
import DirectionPad from '../components/DirectionPad'
import DifficultySelector from '../components/DifficultySelector'
import ImageUploader from '../components/ImageUploader'
import CompletionModal from '../components/CompletionModal'
import styles from './ImagePuzzlePage.module.css'

interface ImagePuzzlePageProps {
  sound: ReturnType<typeof useSound>
  onSaveScore: (time: number, moves: number, difficulty: Difficulty, playerName?: string, thumb?: string) => void
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export default function ImagePuzzlePage({ sound, onSaveScore }: ImagePuzzlePageProps) {
  const { state, movableIndices, moveTile, moveByDirection, reset, togglePause, changeDifficulty, isShuffling } = usePuzzleGame(3)
  const timer = useTimer(state.isPaused, state.isComplete, state.hasStarted)
  const [imageReady, setImageReady] = useState(false)
  const [imageThumb, setImageThumb] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showReference, setShowReference] = useState(false)
  const [completionDismissed, setCompletionDismissed] = useState(false)

  const handleImageReady = useCallback(async (data: string) => {
    try {
      await loadImage(data)
      setImageThumb(data)
      setImageReady(true)
      reset(3)
      timer.reset()
      setShowHint(false)
    } catch {
      alert('图片加载失败，请重试')
    }
  }, [reset, timer])

  const handleDifficultyChange = useCallback((size: Difficulty) => {
    if (!imageReady) return
    changeDifficulty(size)
    timer.reset()
    setShowHint(false)
  }, [imageReady, changeDifficulty, timer])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!imageReady || state.isPaused || state.isComplete || isShuffling) return
      switch (e.key) {
        case 'ArrowUp':    e.preventDefault(); moveByDirection('up'); break
        case 'ArrowDown':  e.preventDefault(); moveByDirection('down'); break
        case 'ArrowLeft':  e.preventDefault(); moveByDirection('left'); break
        case 'ArrowRight': e.preventDefault(); moveByDirection('right'); break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [imageReady, state.isPaused, state.isComplete, moveByDirection, isShuffling])

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

  const handleShuffle = useCallback(() => {
    reset()
    timer.reset()
    setShowHint(false)
    setCompletionDismissed(false)
  }, [reset, timer])

  if (!imageReady) {
    return (
      <div className={styles.page}>
        <ImageUploader onImageReady={handleImageReady} />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <DifficultySelector current={state.size} onChange={handleDifficultyChange} />
      <PuzzleBoard state={state} movableIndices={movableIndices} isImageMode={true} imageSrc={imageThumb} onTileClick={moveTile} showHints={showHint} isShuffling={isShuffling} />
      <div className={styles.imageActions}>
        <button className={styles.referenceBtn} onClick={() => setShowReference(r => !r)}>🖼 查看原图</button>
        <button className={styles.referenceBtn} onClick={() => { setImageReady(false); setImageThumb(''); setCompletionDismissed(false); }}>🔄 更换图片</button>
      </div>
      <GameStats time={timer.time} moves={state.moveCount} showHint={showHint} onToggleHint={() => setShowHint(h => !h)} />
      <GameControls onShuffle={handleShuffle} onPause={togglePause} onReset={() => { reset(); timer.reset() }} isPaused={state.isPaused} />
      <DirectionPad onDirection={moveByDirection} />
      {showReference && (
        <div className={styles.overlay} onClick={() => setShowReference(false)}>
          <img src={imageThumb} alt="原图参考" className={styles.referenceImg} />
        </div>
      )}
      {state.isComplete && !completionDismissed && (
        <CompletionModal time={timer.time} moves={state.moveCount} onSave={name => { onSaveScore(timer.time, state.moveCount, state.size, name, imageThumb); setCompletionDismissed(true) }} onClose={() => setCompletionDismissed(true)} />
      )}
    </div>
  )
}
