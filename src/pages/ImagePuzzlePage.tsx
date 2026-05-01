import { useState, useEffect, useCallback, useRef } from 'react'
import { usePuzzleGame } from '../hooks/usePuzzleGame'
import { useTimer } from '../hooks/useTimer'
import { useSound } from '../hooks/useSound'
import { Difficulty } from '../types'
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

function sliceImage(imageData: string, size: number): string[] {
  const img = new Image()
  img.src = imageData
  const tileSize = img.width / size
  const parts: string[] = []
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const tileCanvas = document.createElement('canvas')
      tileCanvas.width = tileSize
      tileCanvas.height = tileSize
      const ctx = tileCanvas.getContext('2d')!
      ctx.drawImage(img, col * tileSize, row * tileSize, tileSize, tileSize, 0, 0, tileSize, tileSize)
      parts.push(tileCanvas.toDataURL('image/jpeg', 0.8))
    }
  }
  return parts
}

export default function ImagePuzzlePage({ sound, onSaveScore }: ImagePuzzlePageProps) {
  const { state, movableIndices, moveTile, moveByDirection, reset, togglePause, changeDifficulty } = usePuzzleGame(3)
  const timer = useTimer(state.isPaused, state.isComplete)
  const [imageReady, setImageReady] = useState(false)
  const [imageParts, setImageParts] = useState<string[]>([])
  const [imageThumb, setImageThumb] = useState('')
  const [showHint, setShowHint] = useState(false)

  const handleImageReady = useCallback((data: string) => {
    setImageReady(true)
    setImageThumb(data)
    const parts = sliceImage(data, 3)
    setImageParts(parts)
    reset(3)
    timer.reset()
    setShowHint(false)
  }, [reset, timer])

  const handleDifficultyChange = useCallback((size: Difficulty) => {
    if (!imageReady) return
    changeDifficulty(size)
    timer.reset()
    setShowHint(false)
    const parts = sliceImage(imageThumb, size)
    setImageParts(parts)
  }, [imageReady, imageThumb, changeDifficulty, timer])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!imageReady || state.isPaused || state.isComplete) return
      switch (e.key) {
        case 'ArrowUp':    e.preventDefault(); moveByDirection('up'); break
        case 'ArrowDown':  e.preventDefault(); moveByDirection('down'); break
        case 'ArrowLeft':  e.preventDefault(); moveByDirection('left'); break
        case 'ArrowRight': e.preventDefault(); moveByDirection('right'); break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [imageReady, state.isPaused, state.isComplete, moveByDirection])

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
      <PuzzleBoard state={state} movableIndices={showHint ? movableIndices : []} isImageMode={true} imageParts={imageParts} onTileClick={handleTileClick} />
      <GameStats time={timer.time} moves={state.moveCount} showHint={showHint} onToggleHint={() => setShowHint(h => !h)} />
      <GameControls onShuffle={handleShuffle} onPause={togglePause} onReset={() => { reset(); timer.reset() }} isPaused={state.isPaused} />
      <DirectionPad onDirection={moveByDirection} />
      {state.isComplete && (
        <CompletionModal time={timer.time} moves={state.moveCount} onSave={name => onSaveScore(timer.time, state.moveCount, state.size, name, imageThumb)} onClose={() => {}} />
      )}
    </div>
  )
}
