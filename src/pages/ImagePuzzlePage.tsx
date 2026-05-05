import { useState, useCallback } from 'react'
import { usePuzzleController } from '../hooks/usePuzzleController'
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
  const [imageReady, setImageReady] = useState(false)
  const [imageThumb, setImageThumb] = useState('')
  const [showReference, setShowReference] = useState(false)

  const {
    state, movableIndices, isShuffling, timer, showHint, setShowHint,
    completionDismissed, setCompletionDismissed, delayedCompletion,
    moveTile, moveByDirection, handleShuffle, handleDifficultyChange, togglePause,
  } = usePuzzleController(sound, imageReady)

  const handleImageReady = useCallback(async (data: string) => {
    try {
      await loadImage(data)
      setImageThumb(data)
      setImageReady(true)
      handleShuffle()
    } catch {
      alert('图片加载失败，请重试')
    }
  }, [handleShuffle])

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
      <GameControls onShuffle={handleShuffle} onPause={togglePause} onReset={handleShuffle} isPaused={state.isPaused} />
      <DirectionPad onDirection={moveByDirection} />
      {showReference && (
        <div className={styles.overlay} onClick={() => setShowReference(false)}>
          <img src={imageThumb} alt="原图参考" className={styles.referenceImg} />
        </div>
      )}
      {delayedCompletion && !completionDismissed && (
        <CompletionModal time={timer.time} moves={state.moveCount} onSave={name => { onSaveScore(timer.time, state.moveCount, state.size, name, imageThumb); setCompletionDismissed(true) }} onClose={() => setCompletionDismissed(true)} />
      )}
    </div>
  )
}
